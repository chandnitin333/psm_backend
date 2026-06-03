import * as crypto from "crypto";
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";

/** Current IST (UTC+5:30) wall-clock time as 'YYYY-MM-DD HH:mm:ss'. */
const istNow = (): string => {
    return new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
};

let reportLinkTableEnsured = false;
const ensureReportLinkTable = async () => {
    if (reportLinkTableEnsured) return;
    try {
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS report_view_link (
                id INT NOT NULL AUTO_INCREMENT,
                token VARCHAR(64) NOT NULL,
                user_id INT DEFAULT NULL,
                newuser_id INT DEFAULT NULL,
                report_key VARCHAR(40) DEFAULT NULL,
                params TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                deleted_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY uq_report_view_link_token (token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
            []
        );
        reportLinkTableEnsured = true;
    } catch (err) {
        logger.error("ensureReportLinkTable :: ", err);
    }
};

/**
 * Create (or reuse) a public read-only view link for a report.
 * Idempotent per (user_id, newuser_id, report_key) — the params snapshot is
 * refreshed on every call so the link always reflects the latest context.
 */
export async function createReportViewLink(data: {
    user_id: number,
    newuser_id: number,
    report_key: string,
    params: any,
}): Promise<string> {
    await ensureReportLinkTable();

    const existing: any = await executeQuery(
        `SELECT id, token FROM report_view_link
         WHERE user_id = ? AND newuser_id = ? AND report_key = ? AND deleted_at IS NULL
         ORDER BY id DESC LIMIT 1`,
        [data.user_id, data.newuser_id, data.report_key]
    );
    if (Array.isArray(existing) && existing.length > 0) {
        await executeQuery(
            `UPDATE report_view_link SET params = ? WHERE id = ?`,
            [JSON.stringify(data.params ?? {}), existing[0].id]
        );
        return existing[0].token;
    }

    const token = crypto.randomBytes(16).toString("hex");
    await executeQuery(
        `INSERT INTO report_view_link (token, user_id, newuser_id, report_key, params, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [token, data.user_id, data.newuser_id, data.report_key,
            JSON.stringify(data.params ?? {}), istNow()]
    );
    return token;
}

export async function getReportViewLinkByToken(token: string): Promise<any | null> {
    await ensureReportLinkTable();
    const rows: any = await executeQuery(
        `SELECT id, token, user_id, newuser_id, report_key, params, created_at
         FROM report_view_link WHERE token = ? AND deleted_at IS NULL`,
        [token]
    );
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const link = rows[0];
    try { link.params = JSON.parse(link.params || '{}'); } catch { link.params = {}; }
    return link;
}
