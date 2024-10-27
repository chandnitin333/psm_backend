import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createFloor = async (floor: any) => {
    try {
        const existingFloor: any[] = await executeQuery('SELECT * FROM floor WHERE FLOOR_NAME = ?', [floor.name]);
        if (existingFloor.length > 0) {
            throw new Error('Floor already exists');
        }
        await executeQuery('INSERT INTO  floor ( FLOOR_NAME) VALUES ( ?)', [floor.name]);
        logger.info('Floor created successfully');
    } catch (err) {
        logger.error('Error creating floor', err);
        throw err;
    }
};

export const updateFloor = async (floor: any) => {
    try {
        const existingFloor: any[] = await executeQuery('SELECT * FROM floor WHERE FLOOR_NAME = ?', [floor.name]);
        if (existingFloor.length > 0) {
            throw new Error('Updated Floor name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE floor SET FLOOR_NAME = ? WHERE FLOOR_ID = ?', [floor.name,floor.floor_id]);
        logger.info('Floor updated successfully');
    } catch (err) {
        logger.error('Error updating Floor', err);
        throw err;
    }
};

export const getFloorList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT * FROM floor WHERE IS_DELETE=0';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(FLOOR_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY FLOOR_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching floor list', err);
        throw err;
    }
};

export const getFloorById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM floor WHERE FLOOR_ID = ? AND IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching floor by FLOOR_ID', err);
        throw err;
    }
};

export const softDeleteFloor = async (id: number) => {
    try {
        return await executeQuery('UPDATE floor SET IS_DELETE=1, DELETED_AT = NOW() WHERE FLOOR_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting floor', err);
        throw err;
    }
};
 

export const getTotalFloorCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM floor WHERE LOWER(FLOOR_NAME) LIKE LOWER(?) AND IS_DELETE=0', [`%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM floor WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total floor count', err);
        throw err;
    }
};

