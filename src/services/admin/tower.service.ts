import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createTower = async (tower: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM manoramaster WHERE MANORAMASTER_NAME = ?', [tower.name]);
        if (existing.length > 0) {
            throw new Error('Tower already exists');
        }
        await executeQuery('INSERT INTO manoramaster( MANORAMASTER_NAME ) VALUES ( ?)', [tower.name]);
        logger.info('Tower created successfully');
    } catch (err) {
        logger.error('Error creating Tower', err);
        throw err;
    }
};

export const updateTower = async (tower: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM manoramaster WHERE MANORAMASTER_NAME = ?', [tower.name]);
        if (existing.length > 0) {
            throw new Error('Updated tower name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE manoramaster SET MANORAMASTER_NAME = ? WHERE MANORAMASTER_ID = ?', [tower.name,tower.tower_id]);
        logger.info('Tower updated successfully');
    } catch (err) {
        logger.error('Error updating Tower', err);
        throw err;
    }
};

export const getTowerList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM manoramaster WHERE IS_DELETE=0';
        const params: any[] = [];
        if (search) {
            query += ' AND LOWER(MANORAMASTER_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }
        query += ' ORDER BY MANORAMASTER_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching tower list', err);
        throw err;
    }
};

export const getTowerById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM manoramaster WHERE MANORAMASTER_ID = ? AND IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching tower by MANORAMASTER_ID', err);
        throw err;
    }
};

export const softDeleteTower = async (id: number) => {
    try {
        return await executeQuery('UPDATE manoramaster SET IS_DELETE=1 WHERE MANORAMASTER_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting tower', err);
        throw err;
    }
};
 

export const getTotalTowerCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM manoramaster WHERE LOWER(MANORAMASTER_NAME) LIKE LOWER(?) AND IS_DELETE=0', [`%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM manoramaster WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total tower count', err);
        throw err;
    }
};

