import * as crypto from "crypto";
import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

/** Current IST (UTC+5:30) wall-clock time as 'YYYY-MM-DD HH:mm:ss', independent of server timezone. */
const istNow = (): string => {
    return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
};

let billTablesEnsured = false;
const ensureBillPaymentTables = async () => {
    if (billTablesEnsured) return;
    try {
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS bill_payment_link (
                id INT NOT NULL AUTO_INCREMENT,
                token VARCHAR(64) NOT NULL,
                user_id INT DEFAULT NULL,
                newuser_id INT DEFAULT NULL,
                ward_no INT DEFAULT NULL,
                year_id INT DEFAULT NULL,
                panchayat_id INT DEFAULT NULL,
                report_type VARCHAR(10) DEFAULT '129-1',
                bill_data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                deleted_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uq_bill_payment_link_token (token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
            []
        );

        const linkCols: any = await executeQuery(
            `SHOW COLUMNS FROM bill_payment_link WHERE Field = 'report_type'`,
            []
        );
        if (!Array.isArray(linkCols) || linkCols.length === 0) {
            await executeQuery(
                `ALTER TABLE bill_payment_link ADD COLUMN report_type VARCHAR(10) DEFAULT '129-1' AFTER panchayat_id`,
                []
            );
            logger.info("bill_payment_link: added report_type column");
        }
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS bill_payment (
                id INT NOT NULL AUTO_INCREMENT,
                link_id INT NOT NULL,
                kar_type ENUM('gruhkar','panikar') DEFAULT NULL,
                payment_mode ENUM('cash','upi') DEFAULT NULL,
                amount DECIMAL(12,2) DEFAULT NULL,
                utr_number VARCHAR(100) DEFAULT NULL,
                transaction_image VARCHAR(200) DEFAULT NULL,
                payer_name VARCHAR(200) DEFAULT NULL,
                payer_mobile VARCHAR(20) DEFAULT NULL,
                payer_remark VARCHAR(300) DEFAULT NULL,
                username VARCHAR(100) DEFAULT NULL,
                status ENUM('claimed','verified','rejected') DEFAULT 'claimed',
                remark VARCHAR(300) DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT NULL,
                deleted_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
            []
        );

        // Migrate older installs that created bill_payment before these columns existed.
        const cols: any = await executeQuery(
            `SHOW COLUMNS FROM bill_payment WHERE Field IN ('payment_mode', 'transaction_image', 'payer_remark', 'username')`,
            []
        );
        const existing = new Set((cols as any[]).map((c: any) => c.Field));
        if (!existing.has('payment_mode')) {
            await executeQuery(
                `ALTER TABLE bill_payment ADD COLUMN payment_mode ENUM('cash','upi') DEFAULT NULL AFTER kar_type`,
                []
            );
            logger.info("bill_payment: added payment_mode column");
        }
        if (!existing.has('transaction_image')) {
            await executeQuery(
                `ALTER TABLE bill_payment ADD COLUMN transaction_image VARCHAR(200) DEFAULT NULL AFTER utr_number`,
                []
            );
            logger.info("bill_payment: added transaction_image column");
        }
        if (!existing.has('payer_remark')) {
            await executeQuery(
                `ALTER TABLE bill_payment ADD COLUMN payer_remark VARCHAR(300) DEFAULT NULL AFTER payer_mobile`,
                []
            );
            logger.info("bill_payment: added payer_remark column");
        }
        if (!existing.has('username')) {
            await executeQuery(
                `ALTER TABLE bill_payment ADD COLUMN username VARCHAR(100) DEFAULT NULL AFTER payer_remark`,
                []
            );
            logger.info("bill_payment: added username column");
        }

        billTablesEnsured = true;
    } catch (err) {
        logger.error("ensureBillPaymentTables :: ", err);
    }
};

export async function createBillPaymentLink(data: {
    user_id: number,
    newuser_id: number,
    ward_no: number,
    year_id: number,
    panchayat_id: number,
    report_type: string,
    bill_data: any,
}): Promise<string> {
    await ensureBillPaymentTables();
    const reportType = data.report_type === '129-2' ? '129-2' : '129-1';

    // Rule (YEAR + REPORT WISE): links and claims are scoped per year AND per
    // report (129-1 vs 129-2 are separate bills). If this bill already has ANY
    // active claim for this year+report, reuse that link so the claims stay
    // attached. Only when both taxes are still बाकी do we issue a fresh link
    // (the old empty links for that year+report get soft-deleted).
    // `<=>` is the null-safe equality operator (handles year_id NULL).
    const existing: any = await executeQuery(
        `SELECT l.id, l.token,
                (SELECT COUNT(*) FROM bill_payment p
                  WHERE p.link_id IN (
                        SELECT l2.id FROM bill_payment_link l2
                        WHERE l2.user_id = l.user_id AND l2.newuser_id = l.newuser_id
                          AND l2.ward_no = l.ward_no AND l2.year_id <=> l.year_id
                          AND l2.report_type <=> l.report_type
                          AND l2.deleted_at IS NULL)
                    AND p.status <> 'rejected' AND p.deleted_at IS NULL
                ) AS active_claims
         FROM bill_payment_link l
         WHERE l.user_id = ? AND l.newuser_id = ? AND l.ward_no = ? AND l.year_id <=> ?
           AND l.report_type <=> ? AND l.deleted_at IS NULL
         ORDER BY l.id DESC LIMIT 1`,
        [data.user_id, data.newuser_id, data.ward_no, data.year_id, reportType]
    );
    if (Array.isArray(existing) && existing.length > 0) {
        if (Number(existing[0].active_claims) > 0) {
            // Claims in progress for this year+report — keep the same link, refresh amounts.
            await executeQuery(
                `UPDATE bill_payment_link SET bill_data = ?, panchayat_id = ? WHERE id = ?`,
                [JSON.stringify(data.bill_data ?? {}), data.panchayat_id, existing[0].id]
            );
            logger.info(`bill_payment_link: reused link ${existing[0].id} (claims exist, year ${data.year_id}, report ${reportType}) for newuser ${data.newuser_id}`);
            return existing[0].token;
        }
        // Both taxes still बाकी — retire the empty links for this year+report, issue fresh.
        await executeQuery(
            `UPDATE bill_payment_link SET deleted_at = NOW()
             WHERE user_id = ? AND newuser_id = ? AND ward_no = ? AND year_id <=> ?
               AND report_type <=> ? AND deleted_at IS NULL`,
            [data.user_id, data.newuser_id, data.ward_no, data.year_id, reportType]
        );
        logger.info(`bill_payment_link: retired empty links (year ${data.year_id}, report ${reportType}) for newuser ${data.newuser_id}, issuing fresh`);
    }

    const token = crypto.randomBytes(16).toString("hex");
    await executeQuery(
        `INSERT INTO bill_payment_link (token, user_id, newuser_id, ward_no, year_id, panchayat_id, report_type, bill_data, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [token, data.user_id, data.newuser_id, data.ward_no, data.year_id, data.panchayat_id,
            reportType, JSON.stringify(data.bill_data ?? {}), istNow()]
    );
    return token;
}

export async function getBillByToken(token: string): Promise<any | null> {
    await ensureBillPaymentTables();
    const rows: any = await executeQuery(
        `SELECT id, token, user_id, newuser_id, ward_no, year_id, panchayat_id, report_type, bill_data, created_at
         FROM bill_payment_link WHERE token = ? AND deleted_at IS NULL`,
        [token]
    );
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const link = rows[0];

    let billData: any = {};
    try { billData = JSON.parse(link.bill_data || '{}'); } catch { billData = {}; }

    // Khatedar (property holder) details for prefilling the payment form.
    try {
        const nuRows: any = await executeQuery(
            `SELECT HOMEUSER_NAME, MOBILE_NUMBER FROM newuser WHERE NEWUSER_ID = ? AND DELETED_AT IS NULL`,
            [link.newuser_id]
        );
        if (Array.isArray(nuRows) && nuRows.length > 0) {
            billData.khatedar_name = billData.khatedar_name || nuRows[0].HOMEUSER_NAME || '';
            billData.khatedar_mobile = nuRows[0].MOBILE_NUMBER || '';
        }
    } catch (err) {
        logger.error("getBillByToken newuser fetch :: ", err);
    }

    // Panchayat name + scanner images (columns may not exist on very old DBs — tolerate).
    let panchayat: any = null;
    try {
        const pRows: any = await executeQuery(
            `SELECT PANCHAYAT_ID, RTRIM(PANCHAYAT_NAME) AS PANCHAYAT_NAME, GHAR_TAX_SCANNER, PANI_TAX_SCANNER,
                    GHAR_BANK_NAME, GHAR_IFSC, GHAR_ACCOUNT_NO, GHAR_ACCOUNT_HOLDER, GHAR_UPI_ID,
                    PANI_BANK_NAME, PANI_IFSC, PANI_ACCOUNT_NO, PANI_ACCOUNT_HOLDER, PANI_UPI_ID
             FROM panchayat WHERE PANCHAYAT_ID = ?`,
            [link.panchayat_id]
        );
        panchayat = Array.isArray(pRows) && pRows.length > 0 ? pRows[0] : null;
    } catch (err) {
        logger.error("getBillByToken panchayat fetch :: ", err);
        const pRows: any = await executeQuery(
            `SELECT PANCHAYAT_ID, RTRIM(PANCHAYAT_NAME) AS PANCHAYAT_NAME FROM panchayat WHERE PANCHAYAT_ID = ?`,
            [link.panchayat_id]
        );
        panchayat = Array.isArray(pRows) && pRows.length > 0 ? pRows[0] : null;
    }

    // Existing claims for this bill — across active links of the same
    // user+newuser+ward AND THE SAME YEAR + REPORT (each year/report has its
    // own bill and claims).
    const payments: any = await executeQuery(
        `SELECT p.id, p.kar_type, p.payment_mode, p.amount, p.utr_number, p.transaction_image,
                p.payer_name, p.payer_remark, p.status, p.created_at,
                DATE_FORMAT(p.created_at, '%d/%m/%Y %H:%i') AS created_at_display
         FROM bill_payment p
         JOIN bill_payment_link l ON l.id = p.link_id
         WHERE l.user_id = ? AND l.newuser_id = ? AND l.ward_no = ? AND l.year_id <=> ?
           AND l.report_type <=> ?
           AND p.deleted_at IS NULL AND l.deleted_at IS NULL
         ORDER BY p.id DESC`,
        [link.user_id, link.newuser_id, link.ward_no, link.year_id, link.report_type]
    );

    return {
        link_id: link.id,
        token: link.token,
        newuser_id: link.newuser_id,
        ward_no: link.ward_no,
        year_id: link.year_id,
        report_type: link.report_type,
        bill: billData,
        panchayat: panchayat,
        payments: payments || [],
    };
}

export async function claimBillPayment(token: string, data: {
    kar_type: string,
    payment_mode: string,
    amount: any,
    utr_number: string | null,
    transaction_image: string | null,
    payer_name: string,
    payer_mobile: string,
    payer_remark: string | null,
    username: string | null,
}): Promise<any | null> {
    await ensureBillPaymentTables();
    const rows: any = await executeQuery(
        `SELECT id FROM bill_payment_link WHERE token = ? AND deleted_at IS NULL`,
        [token]
    );
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const linkId = rows[0].id;

    await executeQuery(
        `INSERT INTO bill_payment (link_id, kar_type, payment_mode, amount, utr_number, transaction_image, payer_name, payer_mobile, payer_remark, username, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'claimed', ?)`,
        [linkId, data.kar_type, data.payment_mode ?? null, Number(data.amount) || 0,
            data.utr_number ?? null, data.transaction_image ?? null,
            data.payer_name ?? null, data.payer_mobile ?? null, data.payer_remark ?? null,
            data.username ?? null, istNow()]
    );
    return { link_id: linkId };
}

export async function listBillPayments(user_id: number, opts: { page?: number, status?: string }): Promise<{ data: any[], totalRecords: number }> {
    await ensureBillPaymentTables();
    const limit = PAGINATION.LIMIT || 10;
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const offset = (page - 1) * limit;

    const where: string[] = ['l.user_id = ?', 'p.deleted_at IS NULL', 'l.deleted_at IS NULL'];
    const params: any[] = [user_id];
    if (opts.status) {
        where.push('p.status = ?');
        params.push(opts.status);
    }
    const whereClause = `WHERE ${where.join(' AND ')}`;

    const countRows: any = await executeQuery(
        `SELECT COUNT(*) AS cnt FROM bill_payment p JOIN bill_payment_link l ON l.id = p.link_id ${whereClause}`,
        params
    );
    const totalRecords = Array.isArray(countRows) && countRows.length > 0 ? Number(countRows[0].cnt) : 0;

    const data: any = await executeQuery(
        `SELECT p.id, p.kar_type, p.payment_mode, p.amount, p.utr_number, p.transaction_image,
                p.payer_name, p.payer_mobile, p.payer_remark, p.username, p.status, p.remark,
                p.created_at, p.updated_at,
                DATE_FORMAT(p.created_at, '%d/%m/%Y %H:%i') AS created_at_display,
                DATE_FORMAT(p.updated_at, '%d/%m/%Y %H:%i') AS updated_at_display,
                l.token, l.newuser_id, l.ward_no, l.year_id, l.report_type, l.bill_data,
                y.YEAR_NAME,
                nu.HOMEUSER_NAME, nu.MALMATTA_NUMBER, nu.ANNU_KRAMANK
         FROM bill_payment p
         JOIN bill_payment_link l ON l.id = p.link_id
         LEFT JOIN newuser nu ON nu.NEWUSER_ID = l.newuser_id
         LEFT JOIN year y ON y.YEAR_ID = l.year_id
         ${whereClause}
         ORDER BY p.id DESC
         LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    return { data: (data as any[]) || [], totalRecords };
}

/**
 * Aggregate gruhkar/panikar payment status per newuser for the given user.
 * Per kar: 'verified' wins over 'claimed' wins over 'pending'; rejected claims ignored.
 * When year_id is provided, only that year's links/claims are considered.
 */
export async function getKarStatusByNewusers(user_id: number, newuserIds: number[], year_id?: number | null, report_type?: string | null): Promise<any> {
    await ensureBillPaymentTables();
    const map: any = {};
    const ids = (newuserIds || []).map(Number).filter(n => Number.isFinite(n) && n > 0);
    for (const id of ids) map[id] = { gruhkar: 'pending', panikar: 'pending' };
    if (ids.length === 0) return map;

    const placeholders = ids.map(() => '?').join(',');
    const params: any[] = [user_id, ...ids];
    let yearClause = '';
    if (year_id !== undefined && year_id !== null && Number.isFinite(Number(year_id))) {
        yearClause = ' AND l.year_id = ?';
        params.push(Number(year_id));
    }
    let reportClause = '';
    if (report_type === '129-1' || report_type === '129-2') {
        reportClause = ' AND l.report_type = ?';
        params.push(report_type);
    }
    const rows: any = await executeQuery(
        `SELECT l.newuser_id, p.kar_type, p.status
         FROM bill_payment p
         JOIN bill_payment_link l ON l.id = p.link_id
         WHERE l.user_id = ? AND l.newuser_id IN (${placeholders})${yearClause}${reportClause}
           AND p.deleted_at IS NULL AND l.deleted_at IS NULL`,
        params
    );

    const rank: any = { pending: 0, claimed: 1, verified: 2 };
    for (const r of (rows as any[]) || []) {
        if (r.status === 'rejected') continue;
        if (r.kar_type !== 'gruhkar' && r.kar_type !== 'panikar') continue;
        const next = r.status === 'verified' ? 'verified' : 'claimed';
        const cur = map[r.newuser_id]?.[r.kar_type] ?? 'pending';
        if (rank[next] > rank[cur]) map[r.newuser_id][r.kar_type] = next;
    }
    return map;
}

export async function updateBillPaymentStatus(user_id: number, paymentId: number, status: string, remark: string | null): Promise<boolean> {
    await ensureBillPaymentTables();
    const rows: any = await executeQuery(
        `SELECT p.id FROM bill_payment p JOIN bill_payment_link l ON l.id = p.link_id
         WHERE p.id = ? AND l.user_id = ? AND p.deleted_at IS NULL`,
        [paymentId, user_id]
    );
    if (!Array.isArray(rows) || rows.length === 0) return false;
    await executeQuery(
        `UPDATE bill_payment SET status = ?, remark = ?, updated_at = ? WHERE id = ?`,
        [status, remark ?? null, istNow(), paymentId]
    );
    return true;
}
