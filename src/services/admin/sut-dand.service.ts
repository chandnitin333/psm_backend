import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

let dandSutTableEnsured = false;

const COLUMN_RENAMES: { from: string, to: string }[] = [
    { from: 'gruhkar_v_bhumikar', to: 'gruhkar_v_bhumikar_5' },
    { from: 'viz_v_divabatti_kar', to: 'viz_v_divabatti_kar_5' },
    { from: 'aarogya_rakshan_kar', to: 'aarogya_rakshan_kar_5' },
    { from: 'safae_kar', to: 'safae_kar_5' },
    { from: 'samanya_pani_kar', to: 'samanya_pani_kar_5' },
    { from: 'vishesh_pani_kar', to: 'vishesh_pani_kar_5' },
];

const OBSOLETE_COLUMNS = [
    'g_v_b_5_sut_dand',
    'v_v_d_5_sut_dand',
    'ark_5_sut_dand',
    's_k_5_sut_dand',
    's_p_k_5_sut_dand',
    'v_p_k_5_sut_dand',
];

const ensureDandSutTable = async () => {
    if (dandSutTableEnsured) return;
    try {
        await executeQuery(
            `CREATE TABLE IF NOT EXISTS dand_sut (
                id INT NOT NULL AUTO_INCREMENT,
                district_id INT DEFAULT NULL,
                taluka_id INT DEFAULT NULL,
                grampanchayat_id INT DEFAULT NULL,
                kar_type ENUM('chalu','magil') DEFAULT NULL,
                gruhkar_v_bhumikar_5 DECIMAL(12,2) DEFAULT NULL,
                viz_v_divabatti_kar_5 DECIMAL(12,2) DEFAULT NULL,
                aarogya_rakshan_kar_5 DECIMAL(12,2) DEFAULT NULL,
                safae_kar_5 DECIMAL(12,2) DEFAULT NULL,
                samanya_pani_kar_5 DECIMAL(12,2) DEFAULT NULL,
                vishesh_pani_kar_5 DECIMAL(12,2) DEFAULT NULL,
                deleted_at DATETIME DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,
            []
        );

        // Migrate older installs: drop obsolete _5_sut_dand columns and rename base
        // columns to their _5 form.
        const cols: any = await executeQuery(
            `SHOW COLUMNS FROM dand_sut`,
            []
        );
        const existing = new Set((cols as any[]).map((c: any) => c.Field));

        for (const c of OBSOLETE_COLUMNS) {
            if (existing.has(c)) {
                await executeQuery(`ALTER TABLE dand_sut DROP COLUMN ${c}`, []);
                logger.info(`dand_sut: dropped obsolete column ${c}`);
            }
        }
        for (const r of COLUMN_RENAMES) {
            if (existing.has(r.from) && !existing.has(r.to)) {
                await executeQuery(
                    `ALTER TABLE dand_sut CHANGE ${r.from} ${r.to} DECIMAL(12,2) DEFAULT NULL`,
                    []
                );
                logger.info(`dand_sut: renamed ${r.from} -> ${r.to}`);
            } else if (existing.has(r.from) && existing.has(r.to)) {
                // Both present (rare): drop the old one to converge on the new name.
                await executeQuery(`ALTER TABLE dand_sut DROP COLUMN ${r.from}`, []);
                logger.info(`dand_sut: dropped legacy column ${r.from} (target ${r.to} already exists)`);
            }
        }

        dandSutTableEnsured = true;
    } catch (err) {
        logger.error("ensureDandSutTable :: ", err);
    }
};

const SELECTABLE_FIELDS = [
    'id', 'district_id', 'taluka_id', 'grampanchayat_id', 'kar_type',
    'gruhkar_v_bhumikar_5',
    'viz_v_divabatti_kar_5',
    'aarogya_rakshan_kar_5',
    'safae_kar_5',
    'samanya_pani_kar_5',
    'vishesh_pani_kar_5',
];

const WRITABLE_FIELDS = SELECTABLE_FIELDS.filter(f => f !== 'id');

const toNumOrNull = (v: any): number | null => {
    if (v === undefined || v === null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

const toStrOrNull = (v: any): string | null => {
    if (v === undefined || v === null || v === '') return null;
    return String(v);
};

const buildWriteValues = (data: any) => ({
    district_id: toNumOrNull(data?.district_id),
    taluka_id: toNumOrNull(data?.taluka_id),
    grampanchayat_id: toNumOrNull(data?.grampanchayat_id),
    kar_type: toStrOrNull(data?.kar_type),
    gruhkar_v_bhumikar_5: toNumOrNull(data?.gruhkar_v_bhumikar_5),
    viz_v_divabatti_kar_5: toNumOrNull(data?.viz_v_divabatti_kar_5),
    aarogya_rakshan_kar_5: toNumOrNull(data?.aarogya_rakshan_kar_5),
    safae_kar_5: toNumOrNull(data?.safae_kar_5),
    samanya_pani_kar_5: toNumOrNull(data?.samanya_pani_kar_5),
    vishesh_pani_kar_5: toNumOrNull(data?.vishesh_pani_kar_5),
});

export async function createDandSut(data: any): Promise<any> {
    await ensureDandSutTable();
    const values = buildWriteValues(data);
    const cols = WRITABLE_FIELDS;
    const placeholders = cols.map(() => '?').join(', ');
    const sql = `INSERT INTO dand_sut (${cols.join(', ')}) VALUES (${placeholders})`;
    const params = cols.map(c => (values as any)[c]);
    return executeQuery(sql, params);
}

export async function updateDandSut(id: number, data: any): Promise<any> {
    await ensureDandSutTable();
    const values = buildWriteValues(data);
    const cols = WRITABLE_FIELDS;
    const setClause = cols.map(c => `${c} = ?`).join(', ');
    const sql = `UPDATE dand_sut SET ${setClause} WHERE id = ? AND deleted_at IS NULL`;
    const params = [...cols.map(c => (values as any)[c]), id];
    return executeQuery(sql, params);
}

export async function getDandSutById(id: number): Promise<any | null> {
    await ensureDandSutTable();
    const sql = `SELECT ${SELECTABLE_FIELDS.join(', ')} FROM dand_sut WHERE id = ? AND deleted_at IS NULL`;
    const result: any = await executeQuery(sql, [id]);
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
}

export async function listDandSut(opts: {
    page?: number,
    searchValue?: string,
    district_id?: any,
    taluka_id?: any,
    grampanchayat_id?: any,
    kar_type?: any,
}): Promise<{ data: any[], totalRecords: number }> {
    await ensureDandSutTable();
    const limit = PAGINATION.LIMIT || 10;
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const offset = (page - 1) * limit;

    const where: string[] = ['ds.deleted_at IS NULL'];
    const params: any[] = [];

    if (opts.district_id) { where.push('ds.district_id = ?'); params.push(toNumOrNull(opts.district_id)); }
    if (opts.taluka_id) { where.push('ds.taluka_id = ?'); params.push(toNumOrNull(opts.taluka_id)); }
    if (opts.grampanchayat_id) { where.push('ds.grampanchayat_id = ?'); params.push(toNumOrNull(opts.grampanchayat_id)); }
    if (opts.kar_type) { where.push('ds.kar_type = ?'); params.push(toStrOrNull(opts.kar_type)); }
    if (opts.searchValue) {
        where.push(`(LOWER(p.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(t.TALUKA_NAME) LIKE LOWER(?) OR LOWER(d.DISTRICT_NAME) LIKE LOWER(?))`);
        const search = `%${opts.searchValue}%`;
        params.push(search, search, search);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const countResult: any = await executeQuery(
        `SELECT COUNT(*) AS cnt FROM dand_sut ds
         LEFT JOIN district d ON d.DISTRICT_ID = ds.district_id
         LEFT JOIN taluka t ON t.TALUKA_ID = ds.taluka_id
         LEFT JOIN panchayat p ON p.PANCHAYAT_ID = ds.grampanchayat_id
         ${whereClause}`,
        params
    );
    const totalRecords = Array.isArray(countResult) && countResult.length > 0 ? Number(countResult[0].cnt) : 0;

    const dataSql = `
        SELECT ds.*,
               RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME,
               RTRIM(t.TALUKA_NAME) AS TALUKA_NAME,
               RTRIM(p.PANCHAYAT_NAME) AS PANCHAYAT_NAME
        FROM dand_sut ds
        LEFT JOIN district d ON d.DISTRICT_ID = ds.district_id
        LEFT JOIN taluka t ON t.TALUKA_ID = ds.taluka_id
        LEFT JOIN panchayat p ON p.PANCHAYAT_ID = ds.grampanchayat_id
        ${whereClause}
        ORDER BY ds.id DESC
        LIMIT ? OFFSET ?`;
    const data = await executeQuery(dataSql, [...params, limit, offset]);
    return { data: (data as any[]) || [], totalRecords };
}

export async function softDeleteDandSut(id: number): Promise<any> {
    await ensureDandSutTable();
    return executeQuery(`UPDATE dand_sut SET deleted_at = NOW() WHERE id = ?`, [id]);
}
