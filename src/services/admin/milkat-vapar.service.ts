import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";




export const createMilkatVapar = async (milkat: any) => {
    try {
        const existingMilkat: any[] = await executeQuery('SELECT * FROM milkat_vapar WHERE MILKAT_VAPAR_NAME = ?', [milkat.id]);
        if (existingMilkat.length > 0) {
            throw new Error('Milkat already exists');
        }
        await executeQuery('INSERT INTO  milkat_vapar ( MILKAT_VAPAR_NAME) VALUES ( ?)', [milkat.name]);
        logger.info('Milkat vapar created successfully');
    } catch (err) {
        logger.error('Error creating milkat vapar', err);
        throw err;
    }
};

export const updateMilkatVapar = async (milkat: any) => {
    try {
        await executeQuery('UPDATE milkat_vapar SET MILKAT_VAPAR_NAME = ? WHERE MILKAT_VAPAR_ID = ?', [milkat.name,milkat.vapar_id]);
        logger.info('Milkat updated successfully');
    } catch (err) {
        logger.error('Error updating milkat', err);
        throw err;
    }
};

export const getMilkatVaparList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM milkat_vapar WHERE DELETED_AT IS NULL';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(MILKAT_VAPAR_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY MILKAT_VAPAR_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching milkat list', err);
        throw err;
    }
};

export const getMilkatVaparById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM milkat_vapar WHERE MILKAT_VAPAR_ID = ? AND DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching milkat by MILKAT_VAPAR_ID', err);
        throw err;
    }
};

export const softDeleteMilkatVapar = async (id: number) => {
    try {
        return await executeQuery('UPDATE milkat_vapar SET DELETED_AT = NOW() WHERE MILKAT_VAPAR_ID = ? AND DELETED_AT IS NULL', [id]);

    } catch (err) {
        logger.error('Error soft deleting milkat', err);
        throw err;
    }
};
 

export const getTotalMilkatVaparCount = async () => {
    try {
        const result = await executeQuery('SELECT COUNT(*) AS total FROM milkat_vapar WHERE DELETED_AT IS NULL', []);
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total milkat vapar count', err);
        throw err;
    }
};

