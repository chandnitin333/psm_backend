import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createMalmatta = async (data: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM malmatta WHERE DESCRIPTION_NAME = ? AND DESCRIPTION_NAME_EXTRA = ?', [data.desc, data.extra]);
        if (existing.length > 0) {
            throw new Error('Malmatta already exists');
        }
        await executeQuery('INSERT INTO malmatta( DESCRIPTION_NAME, DESCRIPTION_NAME_EXTRA ) VALUES ( ?, ?)', [data.desc, data.extra]);
        logger.info('Malmatta created successfully');
    } catch (err) {
        logger.error('Error creating Malmatta', err);
        throw err;
    }
};

export const updateMalmatta = async (data: any) => {
    try {
       const existing: any[] = await executeQuery('SELECT * FROM malmatta WHERE DESCRIPTION_NAME = ? AND DESCRIPTION_NAME_EXTRA = ?', [data.desc, data.extra]);
        if (existing.length > 0) {
            throw new Error('Updated malmatta name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE malmatta SET DESCRIPTION_NAME = ?, DESCRIPTION_NAME_EXTRA=? WHERE MALMATTA_ID = ?', [data.desc, data.extra, data.id]);
        logger.info('Malmatta updated successfully');
    } catch (err) {
        logger.error('Error updating Malmatta', err);
        throw err;
    }
};

export const getMalmattechaList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM malmatta WHERE IS_DELETE=0';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(DESCRIPTION_NAME) LIKE LOWER(?) OR LOWER(DESCRIPTION_NAME_EXTRA) LIKE LOWER(?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY MALMATTA_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching malmatta list', err);
        throw err;
    }
};

export const getMalmattaById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM malmatta WHERE MALMATTA_ID = ? AND IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching malmatta by MALMATTA_ID', err);
        throw err;
    }
};

export const softDeleteMalmatta = async (id: number) => {
    try {
        return await executeQuery('UPDATE malmatta SET IS_DELETE=1 WHERE MALMATTA_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting malmatta', err);
        throw err;
    }
};
 

export const getTotalMalmattaCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM malmatta WHERE (LOWER(DESCRIPTION_NAME) LIKE LOWER(?) OR LOWER(DESCRIPTION_NAME_EXTRA) LIKE LOWER(?)) AND IS_DELETE=0', [`%${search}%`, `%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM malmatta WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total malmatta count', err);
        throw err;
    }
};

