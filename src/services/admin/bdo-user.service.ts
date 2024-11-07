import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createBDOUser = async (data: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM bdouser WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND EMAIL_NAME = ? AND USER_NAME=?', [data.district_id, data.taluka_id, data.email, data.username]);
        if (existing.length > 0) {
            throw new Error('BDO User already exists');
        }
        await executeQuery('INSERT INTO bdouser( DISTRICT_ID, TALUKA_ID, NAME_NAME,EMAIL_NAME,USER_NAME, PASSWORD_NAME, tempf) VALUES ( ?, ?, ?, ?, ?, ?, "Y")', [data.district_id, data.taluka_id, data.name, data.email, data.username, data.password]);
        logger.info('BDO User created successfully');
    } catch (err) {
        logger.error('Error creating BDO User', err);
        throw err;
    }
};

export const updateBDOUser = async (data: any) => {
    try {
        //  const existing: any[] = await executeQuery('SELECT * FROM bdouser WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND EMAIL_NAME = ? AND USER_NAME=?', [data.district_id, data.taluka_id, data.email, data.username]);
        // if (existing.length > 0) {
        //     throw new Error('Updated BDO user name already exists. Please choose a different name');
        // }
        await executeQuery('UPDATE bdouser SET  DISTRICT_ID = ?, TALUKA_ID=?, NAME_NAME=?, EMAIL_NAME=?, USER_NAME=?, PASSWORD_NAME=? WHERE BDOUser_ID = ?', [data.district_id, data.taluka_id, data.name, data.email, data.username, data.password, data.id]);
        logger.info('BDO User updated successfully');
    } catch (err) {
        logger.error('Error updating BDO User', err);
        throw err;
    }
};

export const getBDOUserList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT ot.*, d.DISTRICT_NAME, t.TALUKA_NAME FROM bdouser ot JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID WHERE ot.IS_DELETE=0';
        const params: any[] = [];

        if (search) {
            query += ' AND (LOWER(d.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(t.TALUKA_NAME) LIKE LOWER(?) OR LOWER(ot.NAME_NAME) LIKE LOWER(?) OR LOWER(ot.EMAIL_NAME) LIKE LOWER(?) OR LOWER(ot.USER_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY ot.BDOUser_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching BDO User list', err);
        throw err;
    }
};

export const getBDOUserById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT ot.*, d.DISTRICT_NAME, t.TALUKA_NAME FROM bdouser ot JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID WHERE ot.BDOUser_ID = ? AND ot.IS_DELETE=0', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching BDO User by BDOUser_ID', err);
        throw err;
    }
};

export const softDeleteBDOUser = async (id: number) => {
    try {
        return await executeQuery('UPDATE bdouser SET IS_DELETE=1 WHERE BDOUser_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting BDO user', err);
        throw err;
    }
};
 

export const getTotalBDOUserCount = async (search='') => {
    try {
        let result: any;
        if(search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM bdouser ot JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID WHERE (LOWER(d.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(t.TALUKA_NAME) LIKE LOWER(?) OR LOWER(ot.NAME_NAME) LIKE LOWER(?) OR LOWER(ot.EMAIL_NAME) LIKE LOWER(?) OR LOWER(ot.USER_NAME) LIKE LOWER(?)) AND ot.IS_DELETE=0', [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
        }else{
            result = await executeQuery('SELECT COUNT(*) AS total FROM bdouser WHERE IS_DELETE = 0', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total BDO User count', err);
        throw err;
    }
};

