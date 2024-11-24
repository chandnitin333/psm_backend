import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";




export const createMilkatVapar = async (milkat: any) => {
    try {
        const existingMilkat: any[] = await executeQuery('SELECT * FROM milkat WHERE MILKAT_NAME = ? AND MILKAT_VAPAR_ID=?', [milkat.name, milkat.malmatta_id]);
        if (existingMilkat.length > 0) {
            throw new Error('Milkat already exists');
        }
        await executeQuery('INSERT INTO  milkat ( MILKAT_VAPAR_ID, MILKAT_NAME) VALUES ( ?,?)', [milkat.malmatta_id, milkat.name]);
        logger.info('Milkat vapar created successfully'); 
    } catch (err) {
        logger.error('Error creating milkat vapar', err);
        throw err;
    }
};

export const updateMilkatVapar = async (milkat: any) => {
    try {
        await executeQuery('UPDATE milkat SET MILKAT_NAME = ?, MILKAT_VAPAR_ID=? WHERE MILKAT_ID = ?', [milkat.name,milkat.malmatta_id,milkat.vapar_id]);
        logger.info('Milkat updated successfully');
    } catch (err) {
        logger.error('Error updating milkat', err);
        throw err;
    }
};

export const getMilkatVaparList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT m.*,mv.MILKAT_VAPAR_NAME FROM milkat m JOIN milkat_vapar mv ON m.MILKAT_VAPAR_ID = mv.MILKAT_VAPAR_ID WHERE m.DELETED_AT IS NULL';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(m.MILKAT_NAME) LIKE LOWER(?) OR LOWER(mv.MILKAT_VAPAR_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`,`%${search}%`);
        }

        query += ' ORDER BY m.MILKAT_ID DESC LIMIT ? OFFSET ?';
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
        const result = await executeQuery('SELECT * FROM milkat WHERE MILKAT_ID = ? AND DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching milkat by MILKAT_VAPAR_ID', err);
        throw err;
    }
};

export const softDeleteMilkatVapar = async (id: number) => {
    try {
        return await executeQuery('UPDATE milkat SET DELETED_AT = NOW() WHERE MILKAT_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting milkat', err);
        throw err;
    }
};
 

export const getTotalMilkatVaparCount = async (search: string = "") => {
    try {
        let result:any;
        if(search)
        {
            result = await executeQuery('SELECT COUNT(*) AS total FROM milkat m JOIN milkat_vapar mv ON m.MILKAT_VAPAR_ID = mv.MILKAT_VAPAR_ID  WHERE m.DELETED_AT IS NULL AND (LOWER(m.MILKAT_NAME) LIKE LOWER(?) OR LOWER(mv.MILKAT_VAPAR_NAME) LIKE LOWER(?) )', [`%${search}%`, `%${search}%`]);
        }
        else
        {
            result = await executeQuery('SELECT COUNT(*) AS total FROM milkat WHERE DELETED_AT IS NULL', []);
        }
        
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total milkat vapar count', err);
        throw err;
    }
};

