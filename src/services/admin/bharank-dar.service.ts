import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createBharankDar = async (bharankDar: any) => {
    try {
        const existingRecord: any[] = await executeQuery('SELECT * FROM buildingweights WHERE MILKAT_VAPAR_ID = ? AND BUILDINGWEIGHTS_NAME=? AND DELETED_AT IS NULL', [bharankDar.milkat_vapar_id, bharankDar.bharank_name]);
        if (existingRecord.length > 0) {
            throw new Error('Bharank Dar already exists');
        }
        await executeQuery('INSERT INTO  buildingweights ( MILKAT_VAPAR_ID, BUILDINGWEIGHTS_NAME) VALUES ( ?, ?)', [bharankDar.milkat_vapar_id, bharankDar.bharank_name]);
        logger.info('Bharank Dar created successfully');
    } catch (err) {
        logger.error('Error creating Bharank Dar', err);
        throw err;
    }
};

export const updateBharankDar = async (bharankDar: any) => {
    try {
        const existingRecord: any[] = await executeQuery('SELECT * FROM buildingweights WHERE MILKAT_VAPAR_ID = ? AND BUILDINGWEIGHTS_NAME=? AND DELETED_AT IS NULL', [bharankDar.milkat_vapar_id, bharankDar.bharank_name]);
        if (existingRecord.length > 0) {
            throw new Error('Updated Bharank Dar name already exists. Please choose a different one');
        }
        await executeQuery('UPDATE buildingweights SET MILKAT_VAPAR_ID = ?,BUILDINGWEIGHTS_NAME=?WHERE BUILDINGWEIGHTS_ID = ?', [bharankDar.milkat_vapar_id, bharankDar.bharank_name,bharankDar.bharank_id]);
        logger.info('Bharank Dar updated successfully');
    } catch (err) {
        logger.error('Error updating Bharank Dar', err);
        throw err;
    }
};

export const getBharankDarList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT bw.*, mv.MILKAT_VAPAR_NAME FROM buildingweights bw JOIN milkat_vapar mv ON bw.MILKAT_VAPAR_ID = mv.MILKAT_VAPAR_ID WHERE bw.DELETED_AT IS NULL';
        const params: any[] = [];
        if (search) {
            query += ' AND (bw.BUILDINGWEIGHTS_NAME LIKE (?) OR LOWER(mv.MILKAT_VAPAR_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`);
        }
        query += ' ORDER BY bw.BUILDINGWEIGHTS_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching bharank dar list', err);
        throw err;
    }
};

export const getBharankDarById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM buildingweights bw JOIN milkat_vapar mv ON bw.MILKAT_VAPAR_ID = mv.MILKAT_VAPAR_ID WHERE bw.BUILDINGWEIGHTS_ID = ? AND bw.DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching bharank by BUILDINGWEIGHTS_ID', err);
        throw err;
    }
};

export const softDeleteBharankDar = async (id: number) => {
    try {
        return await executeQuery('UPDATE buildingweights SET  DELETED_AT = NOW() WHERE BUILDINGWEIGHTS_ID = ?', [id]);
    } catch (err) {
        logger.error('Error soft deleting Bharank dar', err);
        throw err;
    }
};

export const getTotalBharankDarCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM buildingweights bw JOIN milkat_vapar mv ON bw.MILKAT_VAPAR_ID = mv.MILKAT_VAPAR_ID WHERE bw.DELETED_AT IS NULL AND (bw.BUILDINGWEIGHTS_NAME LIKE (?) OR LOWER(mv.MILKAT_VAPAR_NAME) LIKE LOWER(?))', [`%${search}%`, `%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM buildingweights WHERE DELETED_AT IS NULL', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total bharank dar count', err);
        throw err;
    }
};

