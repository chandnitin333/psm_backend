import e = require("express");
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


let scannerColumnsEnsured = false;

// Scanner images + bank details (one set for gruhkar, one for pani kar).
const PANCHAYAT_EXTRA_COLUMNS = [
    'GHAR_TAX_SCANNER', 'PANI_TAX_SCANNER',
    'GHAR_BANK_NAME', 'GHAR_IFSC', 'GHAR_ACCOUNT_NO', 'GHAR_ACCOUNT_HOLDER', 'GHAR_UPI_ID',
    'PANI_BANK_NAME', 'PANI_IFSC', 'PANI_ACCOUNT_NO', 'PANI_ACCOUNT_HOLDER', 'PANI_UPI_ID',
];

const ensureScannerColumns = async () => {
    if (scannerColumnsEnsured) return;
    try {
        const cols: any = await executeQuery(
            `SHOW COLUMNS FROM panchayat WHERE Field IN (${PANCHAYAT_EXTRA_COLUMNS.map(() => '?').join(',')})`,
            PANCHAYAT_EXTRA_COLUMNS
        );
        const existing = new Set((cols as any[]).map((c: any) => c.Field));
        for (const col of PANCHAYAT_EXTRA_COLUMNS) {
            if (!existing.has(col)) {
                await executeQuery(
                    `ALTER TABLE panchayat ADD COLUMN ${col} VARCHAR(200) DEFAULT NULL`,
                    []
                );
                logger.info(`Added ${col} column to panchayat`);
            }
        }
        scannerColumnsEnsured = true;
    } catch (err) {
        logger.error("ensureScannerColumns :: ", err);
    }
};

export const BANK_FIELDS = [
    'GHAR_BANK_NAME', 'GHAR_IFSC', 'GHAR_ACCOUNT_NO', 'GHAR_ACCOUNT_HOLDER', 'GHAR_UPI_ID',
    'PANI_BANK_NAME', 'PANI_IFSC', 'PANI_ACCOUNT_NO', 'PANI_ACCOUNT_HOLDER', 'PANI_UPI_ID',
];


export const addGramPanchayat = async (params: any[], bank: any = {}) => {
    try {
        await ensureScannerColumns();
        const [districtId, talukaId, name, gharTaxScanner, paniTaxScanner] = params;
        let sql = `SELECT PANCHAYAT_ID FROM panchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_NAME=? AND DELETED_AT IS NULL`;
        const dupParams = [districtId, talukaId, name];
        return executeQuery(sql, dupParams).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                const bankCols = BANK_FIELDS.join(', ');
                const bankPlaceholders = BANK_FIELDS.map(() => '?').join(', ');
                const bankValues = BANK_FIELDS.map(f => (bank?.[f] ?? null) || null);
                sql = `INSERT INTO panchayat (DISTRICT_ID, TALUKA_ID, PANCHAYAT_NAME, GHAR_TAX_SCANNER, PANI_TAX_SCANNER, ${bankCols})
                       VALUES (?, ?, ?, ?, ?, ${bankPlaceholders})`;
                const insertParams = [districtId, talukaId, name, gharTaxScanner ?? null, paniTaxScanner ?? null, ...bankValues];
                return executeQuery(sql, insertParams).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("addGramPanchayat fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addGrampanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addGrampanchaya :: ", error)
        throw new Error(error)
    }

}

export const getGramPanchayat = async (params: object) => {
    try {
        await ensureScannerColumns();
        let sql = ` select p.*, RTRIM(p.PANCHAYAT_NAME)  AS PANCHAYAT_NAME, RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME, RTRIM(t.TALUKA_NAME) AS TALUKA_NAME from panchayat p join district d on p.DISTRICT_ID = d.DISTRICT_ID join taluka t on p.TALUKA_ID = t.TALUKA_ID where p.PANCHAYAT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("GramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const getGramPanchayatList = async (params: object) => {
    try {
        await ensureScannerColumns();
        const { limit, offset, searchValue } = params as { limit: number, offset: number, searchValue?: string };
        let sql = `select p.PANCHAYAT_ID ,p.DISTRICT_ID , p.TALUKA_ID , RTRIM(p.PANCHAYAT_NAME) AS PANCHAYAT_NAME, p.GHAR_TAX_SCANNER, p.PANI_TAX_SCANNER, RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME, RTRIM(t.TALUKA_NAME) AS TALUKA_NAME
               from panchayat p
               join district d on p.DISTRICT_ID = d.DISTRICT_ID
               join taluka t on p.TALUKA_ID = t.TALUKA_ID
               WHERE p.DELETED_AT IS NULL`;

        let data = [];
        if (searchValue) {
            sql += ` AND (RTRIM(LOWER(p.PANCHAYAT_NAME)) LIKE LOWER(?)  OR RTRIM(LOWER(t.TALUKA_NAME)) LIKE LOWER(?))`;
            let searchText = `%${searchValue}%`
            data = [searchText, searchText, limit, offset];
        } else {
            data = [limit, offset];
        }

        let total_count = await getGramPanchayaCount(sql, data);

        sql += ` ORDER BY p.PANCHAYAT_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, data).then(result => {
            return (result) ? { 'data': result, 'total_count': total_count } : null;
        }).catch(error => {
            console.error("getGramPanchayatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

export const getGramPanchayaCount = async (sql: string, params: object) => {
    try {

        return executeQuery(sql, params).then(result => {
            return (result) ? Object.keys(result).length : 0;

        }).catch(error => {
            console.error("getGramPanchayatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

export const updateGramPanchayat = async (params: any[], bank: any = {}) => {
    try {
        await ensureScannerColumns();
        const [districtId, talukaId, name, panchayatId, gharTaxScanner, paniTaxScanner] = params;
        // Duplicate check excludes the current row.
        let dupSql = `SELECT PANCHAYAT_ID FROM panchayat WHERE DISTRICT_ID = ? AND TALUKA_ID = ? AND PANCHAYAT_NAME = ? AND PANCHAYAT_ID <> ? AND DELETED_AT IS NULL`;
        const dupParams = [districtId, talukaId, name, panchayatId];
        return executeQuery(dupSql, dupParams).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            }

            const setClauses: string[] = ['DISTRICT_ID = ?', 'TALUKA_ID = ?', 'PANCHAYAT_NAME = ?'];
            const updateParams: any[] = [districtId, talukaId, name];
            if (gharTaxScanner) {
                setClauses.push('GHAR_TAX_SCANNER = ?');
                updateParams.push(gharTaxScanner);
            }
            if (paniTaxScanner) {
                setClauses.push('PANI_TAX_SCANNER = ?');
                updateParams.push(paniTaxScanner);
            }
            // Bank/UPI details: text fields are always updated (empty clears them)
            // when the field is present in the request body.
            for (const f of BANK_FIELDS) {
                if (bank && Object.prototype.hasOwnProperty.call(bank, f)) {
                    setClauses.push(`${f} = ?`);
                    updateParams.push((bank[f] ?? null) || null);
                }
            }
            updateParams.push(panchayatId);

            const sql = `UPDATE panchayat SET ${setClauses.join(', ')} WHERE PANCHAYAT_ID = ? AND DELETED_AT IS NULL`;
            return executeQuery(sql, updateParams).then(result => {
                return (result) ? result : null;
            }).catch(error => {
                console.error("updateGramPanchayat fetch data error: ", error);
                return null;
            });
        }).catch(error => {
            console.error("addGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("updateGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const deleteGramPanchayat = async (params: object) => {
    try {
        let sql = `UPDATE panchayat SET DELETED_AT = NOW() WHERE PANCHAYAT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteGramPanchayat :: ", error)
        throw new Error(error)
    }
}

// export const getTalukaListBYDistrictID = async (params: object) => {
//     try {
//         // console.log("params",params)
//         // const { limit, offset } = params as { limit: number, offset: number };
//         let sql = `select t.TALUKA_ID,RTRIM(t.TALUKA_NAME),RTRIM(d.DISTRICT_NAME),t.DISTRICT_ID from taluka t join district d on t.DISTRICT_ID = d.DISTRICT_ID WHERE t.DELETED_AT IS NULL  AND t.DISTRICT_ID=? ORDER BY t.TALUKA_ID DESC`;
//         return executeQuery(sql, [params]).then(result => {
//             return (result) ? result : null;
//         }).catch(error => {
//             console.error("getTalukaList fetch data error: ", error);
//             return null;
//         });
//     } catch (error) {
//         logger.error("getTalukaList :: ", error);
//         throw new Error(error);
//     }

// }

export const getPanchayatListForDDL = async (params: object) => {
    try {
        let sql = `SELECT PANCHAYAT_ID,PANCHAYAT_NAME FROM panchayat WHERE DELETED_AT IS NULL`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;


        }).catch((error) => {
            console.error("getPanchayatListForDDL fetch data error: ", error);
            return null;
        }
        );
    } catch (error) {
        logger.error("getPanchayatListForDDL :: ", error)
        throw new Error(error)
    }
}