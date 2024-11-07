import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createMalmattechePrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM malmattaincome WHERE INCOME_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Malmatteche Prakar already exists');
        }
        await executeQuery('INSERT INTO malmattaincome( INCOME_NAME ) VALUES ( ?)', [prakar.name]);
        logger.info('Prakar created successfully');
    } catch (err) {
        logger.error('Error creating Malmatteche Prakar', err);
        throw err;
    }
};

export const updateMalmattechePrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM malmattaincome WHERE INCOME_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Updated malmatteche prakar name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE malmattaincome SET INCOME_NAME = ? WHERE INCOME_ID = ?', [prakar.name,prakar.prakar_id]);
        logger.info('Malmatteche Prakar updated successfully');
    } catch (err) {
        logger.error('Error updating Malmatteche Prakar', err);
        throw err;
    }
};

export const getMalmattechePrakarList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM malmattaincome WHERE IS_DELETE=0';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(INCOME_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY INCOME_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching malmatteche prakar list', err);
        throw err;
    }
};

export const getMalmattechePrakarById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM malmattaincome WHERE INCOME_ID = ? AND IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching malmatteche prakar by INCOME_ID', err);
        throw err;
    }
};

export const softDeleteMalmattechePrakar = async (id: number) => {
    try {
        return await executeQuery('UPDATE malmattaincome SET IS_DELETE=1 WHERE INCOME_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting malmatteche prakar', err);
        throw err;
    }
};
 

export const getTotalMalmattechePrakarCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM malmattaincome WHERE LOWER(INCOME_NAME) LIKE LOWER(?) AND IS_DELETE=0', [`%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM malmattaincome WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total malmatteche prakar count', err);
        throw err;
    }
};

