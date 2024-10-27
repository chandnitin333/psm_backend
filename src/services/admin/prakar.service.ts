import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createPrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM prakar WHERE PRAKAR_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Prakar already exists');
        }
        await executeQuery('INSERT INTO prakar( PRAKAR_NAME ) VALUES ( ?)', [prakar.name]);
        logger.info('Prakar created successfully');
    } catch (err) {
        logger.error('Error creating Prakar', err);
        throw err;
    }
};

export const updatePrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM prakar WHERE PRAKAR_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Updated prakar name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE prakar SET PRAKAR_NAME = ? WHERE PRAKAR_ID = ?', [prakar.name,prakar.prakar_id]);
        logger.info('Prakar updated successfully');
    } catch (err) {
        logger.error('Error updating Prakar', err);
        throw err;
    }
};

export const getPrakarList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM prakar WHERE IS_DELETE=0';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(PRAKAR_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY PRAKAR_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching prakar list', err);
        throw err;
    }
};

export const getPrakarById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM prakar WHERE PRAKAR_ID = ? AND IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching prakar by PRAKAR_ID', err);
        throw err;
    }
};

export const softDeletePrakar = async (id: number) => {
    try {
        return await executeQuery('UPDATE prakar SET IS_DELETE=1, DELETED_AT = NOW() WHERE PRAKAR_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting prakar', err);
        throw err;
    }
};
 

export const getTotalPrakarCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM prakar WHERE LOWER(PRAKAR_NAME) LIKE LOWER(?) AND IS_DELETE=0', [`%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM prakar WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total prakar count', err);
        throw err;
    }
};

