import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createMalmattechePrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM milkat_vapar WHERE MILKAT_VAPAR_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Malmatteche Prakar already exists');
        }
        await executeQuery('INSERT INTO milkat_vapar( MILKAT_VAPAR_NAME ) VALUES ( ?)', [prakar.name]);
        logger.info('Prakar created successfully');
    } catch (err) {
        logger.error('Error creating Malmatteche Prakar', err);
        throw err;
    }
};

export const updateMalmattechePrakar = async (prakar: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM milkat_vapar WHERE MILKAT_VAPAR_NAME = ?', [prakar.name]);
        if (existing.length > 0) {
            throw new Error('Updated malmatteche prakar name already exists. Please choose a different name');
        }

        await executeQuery('UPDATE milkat_vapar SET MILKAT_VAPAR_NAME = ? WHERE MILKAT_VAPAR_ID = ?', [prakar.name, prakar.prakar_id]);

        logger.info('Malmatteche Prakar updated successfully');
    } catch (err) {
        logger.error('Error updating Malmatteche Prakar', err);
        throw err;
    }
};

export const getMalmattechePrakarList = async (offset: number, search: string) => {
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
        logger.error('Error fetching malmatteche prakar list', err);
        throw err;
    }
};

export const getMalmattechePrakarById = async (id: number) => {
    try {

        const result = await executeQuery('SELECT * FROM milkat_vapar WHERE MILKAT_VAPAR_ID = ? AND  DELETED_AT IS NULL', [id]);

        return result[0];
    } catch (err) {
        logger.error('Error fetching malmatteche prakar by MILKAT_VAPAR_ID', err);
        throw err;
    }
};

export const softDeleteMalmattechePrakar = async (id: number) => {
    try {

        return await executeQuery('UPDATE milkat_vapar SET DELETED_AT = NOW() WHERE MILKAT_VAPAR_ID = ?', [id]);


    } catch (err) {
        logger.error('Error soft deleting malmatteche prakar', err);
        throw err;
    }
};



export const getTotalMalmattechePrakarCount = async (search = '') => {
    try {
        let result: any;
        if (search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM milkat_vapar WHERE LOWER(MILKAT_VAPAR_NAME) LIKE LOWER(?) AND DELETED_AT IS NULL', [`%${search}%`]);
        } else {
            result = await executeQuery('SELECT COUNT(*) AS total FROM milkat_vapar WHERE DELETED_AT IS NULL ', []);

        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total malmatteche prakar count', err);
        throw err;
    }
};


export const getMalmattechePrakarDDL = async (params: object) => {
    try {
        let sql = `SELECT MILKAT_VAPAR_ID,MILKAT_VAPAR_NAME FROM milkat_vapar WHERE DELETED_AT IS NULL`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;


        }).catch((error) => {
            console.error("getMalmattechePrakarDDL fetch data error: ", error);
            return null;
        }
        );
    } catch (error) {
        logger.error("getMalmattechePrakarDDL :: ", error)
        throw new Error(error)
    }
}