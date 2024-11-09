import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";




export const createGhasaraDar = async (ghasaraDar: any) => {
    try {
        const existingRecord: any[] = await executeQuery('SELECT * FROM depreciation WHERE MALMATTA_ID = ? AND DEPRECIATION_NAME=? AND AGEOFBUILDING_ID=? AND DELETED_AT IS NULL', [ghasaraDar.malmatta_id, ghasaraDar.depreciation_name, ghasaraDar.ageofbuilding_id]);
        if (existingRecord.length > 0) {
            throw new Error('Ghasara Dar already exists');
        }
        await executeQuery('INSERT INTO  depreciation ( MALMATTA_ID, DEPRECIATION_NAME, AGEOFBUILDING_ID) VALUES ( ?, ?, ?)', [ghasaraDar.malmatta_id, ghasaraDar.depreciation_name, ghasaraDar.ageofbuilding_id]);
        logger.info('Ghasara Dar created successfully');
    } catch (err) {
        logger.error('Error creating Ghasara Dar', err);
        throw err;
    }
};

export const updateGhasaraDar = async (ghasaraDar: any) => {
    try {
        const existingRecord: any[] = await executeQuery('SELECT * FROM depreciation WHERE MALMATTA_ID = ? AND DEPRECIATION_NAME=? AND AGEOFBUILDING_ID=? AND DELETED_AT IS NULL', [ghasaraDar.malmatta_id, ghasaraDar.depreciation_name, ghasaraDar.ageofbuilding_id]);
        if (existingRecord.length > 0) {
            throw new Error('Updated Ghasara Dar name already exists. Please choose a different one');
        }
        await executeQuery('UPDATE depreciation SET MALMATTA_ID = ?,DEPRECIATION_NAME=?,AGEOFBUILDING_ID=? WHERE DEPRECIATION_ID = ?', [ghasaraDar.malmatta_id, ghasaraDar.depreciation_name, ghasaraDar.ageofbuilding_id, ghasaraDar.ghasara_id]);
        logger.info('Ghasara Dar updated successfully');
    } catch (err) {
        logger.error('Error updating Ghasara Dar', err);
        throw err;
    }
};

export const getGhasaraDarList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT d.*, m.DESCRIPTION_NAME as MALAMATA_NAME, a.AGEOFBUILDING_NAME FROM depreciation d JOIN malmatta m ON d.MALMATTA_ID = m.MALMATTA_ID JOIN ageofbuilding a ON d.AGEOFBUILDING_ID = a.AGEOFBUILDING_ID WHERE d.DELETED_AT IS NULL';
        const params: any[] = [];
        if (search) {
            query += ' AND (d.DEPRECIATION_NAME LIKE (?) OR LOWER(a.AGEOFBUILDING_NAME) LIKE LOWER(?) OR LOWER(m.DESCRIPTION_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY d.DEPRECIATION_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching ghasara dar list', err);
        throw err;
    }
};

export const getGhasaraDarById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT d.*, m.DESCRIPTION_NAME, a.AGEOFBUILDING_NAME FROM depreciation d JOIN malmatta m ON d.MALMATTA_ID = m.MALMATTA_ID JOIN ageofbuilding a ON d.AGEOFBUILDING_ID = a.AGEOFBUILDING_ID WHERE d.DEPRECIATION_ID = ? AND d. DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching ghasara by DEPRECIATION_ID', err);
        throw err;
    }
};

export const softDeleteGhasaraDar = async (id: number) => {
    try {
        return await executeQuery('UPDATE depreciation SET   DELETED_AT = NOW() WHERE DEPRECIATION_ID = ?', [id]);
    } catch (err) {
        logger.error('Error soft deleting milkat', err);
        throw err;
    }
};


export const getTotalGhasaraDarCount = async (search = '') => {
    try {
        let result: any;
        if (search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM depreciation d JOIN malmatta m ON d.MALMATTA_ID = m.MALMATTA_ID JOIN ageofbuilding a ON d.AGEOFBUILDING_ID = a.AGEOFBUILDING_ID WHERE (d.DEPRECIATION_NAME LIKE (?) OR LOWER(a.AGEOFBUILDING_NAME) LIKE LOWER(?) OR LOWER(m.DESCRIPTION_NAME) LIKE LOWER(?)) AND d. DELETED_AT IS NULL', [`%${search}%`, `%${search}%`, `%${search}%`]);
        } else {
            result = await executeQuery('SELECT COUNT(*) AS total FROM depreciation WHERE  DELETED_AT IS NULL', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total ghasara count', err);
        throw err;
    }
};