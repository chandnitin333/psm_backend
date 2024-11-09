import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createKaryaKarniCommitee = async (data: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM designation WHERE DESIGNATION_NAME = ?', [data.name]);
        if (existing.length > 0) {
            throw new Error('Karyakarni Committee already exists');
        }
        await executeQuery('INSERT INTO designation( DESIGNATION_NAME ) VALUES ( ?)', [data.name]);
        logger.info('Karyakarni Committee created successfully');
    } catch (err) {
        logger.error('Error creating Karyakarni Committee', err);
        throw err;
    }
};

export const updateKaryaKarniCommitee = async (data: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM designation WHERE DESIGNATION_NAME = ?', [data.name]);
        if (existing.length > 0) {
            throw new Error('Updated Karyakarni Committee name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE designation SET DESIGNATION_NAME = ? WHERE DESIGNATION_ID = ?', [data.name,data.id]);
        logger.info('Karyakarni Committee updated successfully');
    } catch (err) {
        logger.error('Error updating Karyakarni Committee', err);
        throw err;
    }
};

export const getKaryaKarniCommiteeList = async (offset: number, search: string) => {
    try {

        let query = 'SELECT * FROM designation WHERE DELETED_AT IS NULL';

        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(DESIGNATION_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY DESIGNATION_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching Karyakarni Committee list', err);
        throw err;
    }
};

export const getKaryaKarniCommiteeById = async (id: number) => {
    try {

        const result = await executeQuery('SELECT * FROM designation WHERE DESIGNATION_ID = ? AND DELETED_AT IS NULL', [id]);

        return result[0];
    } catch (err) {
        logger.error('Error fetching Karyakarni Committee by DESIGNATION_ID', err);
        throw err;
    }
};

export const softDeleteKaryaKarniCommitee = async (id: number) => {
    try {

        return await executeQuery('UPDATE designation SET DELETED_AT = NOW() WHERE DESIGNATION_ID = ?', [id]);


    } catch (err) {
        logger.error('Error soft deleting Karyakarni Committee', err);
        throw err;
    }
};
 

export const getTotalKaryaKarniCommiteeCount = async (search='') => {
    try {
        let result: any;
        if(search) {

            result = await executeQuery('SELECT COUNT(*) AS total FROM designation WHERE LOWER(DESIGNATION_NAME) LIKE LOWER(?) AND DELETED_AT IS NULL', [`%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM designation WHERE DELETED_AT IS NULL', []);

        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total Karyakarni Committee count', err);
        throw err;
    }
};

