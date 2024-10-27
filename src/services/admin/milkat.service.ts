import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";




export const createMilkat = async (milkat: any) => {
    try {
        const existingMilkat: any[] = await executeQuery('SELECT * FROM milkat WHERE MILKAT_ID = ?', [milkat.id]);
        if (existingMilkat.length > 0) {
            throw new Error('Milkat already exists');
        }
        await executeQuery('INSERT INTO milkat ( MILKAT_VAPAR_ID,MILKAT_NAME) VALUES ( ?,?)', [milkat.vapar_id, milkat.name]);
        logger.info('Milkat created successfully');
    } catch (err) {
        logger.error('Error creating milkat', err);
        throw err;
    }
};

export const updateMilkat = async (milkat: any) => {
    try {
        await executeQuery('UPDATE milkat SET MILKAT_NAME = ?, MILKAT_VAPAR_ID =?  WHERE MILKAT_ID = ?', [milkat.name, milkat.vapar_id, milkat.mikat_id]);
        logger.info('Milkat updated successfully');
    } catch (err) {
        logger.error('Error updating milkat', err);
        throw err;
    }
};

export const getMilkatList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM milkat  WHERE DELETED_AT IS NULL';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(MILKAT_NAME) LIKE LOWER(?)';

            params.push(`%${search}%`);
        }

        query += ' LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);
        console.log(params)
        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching milkat list', err);
        throw err;
    }
};

export const getMilkatById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM milkat WHERE MILKAT_ID = ? AND DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching milkat by MILKAT_ID', err);
        throw err;
    }
};

export const softDeleteMilkat = async (id: number) => {
    try {
        return await executeQuery('UPDATE milkat SET DELETED_AT = NOW() WHERE MILKAT_ID = ? AND DELETED_AT IS NULL', [id]);
       
    } catch (err) {
        logger.error('Error soft deleting milkat', err);
        throw err;
    }
};

//get total count of milkat 

export const getMilkatCount = async () => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as count FROM milkat WHERE DELETED_AT IS NULL', []);
        return result[0].count;
    } catch (err) {
        logger.error('Error fetching milkat count', err);
        throw err;
    }
};