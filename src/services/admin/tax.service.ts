import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM othertax WHERE OTHERTAX_NAME = ? AND DELETED_AT IS NULL', [tax.name]);
        if (existing.length > 0) {
            throw new Error('Tax already exists');
        }
        await executeQuery('INSERT INTO othertax( OTHERTAX_NAME ) VALUES ( ?)', [tax.name]);
        logger.info('Tax created successfully');
    } catch (err) {
        logger.error('Error creating Tax', err);
        throw err;
    }
};

export const updateTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM othertax WHERE OTHERTAX_NAME = ? AND DELETED_AT IS NULL', [tax.name]);
        if (existing.length > 0) {
            throw new Error('Updated tax name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE othertax SET OTHERTAX_NAME = ? WHERE OTHERTAX_ID = ?', [tax.name, tax.tax_id]);
        logger.info('Tax updated successfully');
    } catch (err) {
        logger.error('Error updating Tax', err);
        throw err;
    }
};

export const getTaxList = async (offset: number, search: string, is_page: boolean = true) => {
    try {
        let query = 'SELECT * FROM othertax WHERE DELETED_AT IS NULL';
        const params: any[] = [];

        if (search) {
            query += ' AND LOWER(OTHERTAX_NAME) LIKE LOWER(?)';
            params.push(`%${search}%`);
        }

        query += ' ORDER BY OTHERTAX_ID DESC ';
        if (is_page) {
            query += ' LIMIT ? OFFSET ?';
            params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);
        }


        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching tax list', err);
        throw err;
    }
};

export const getTaxById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT * FROM othertax WHERE OTHERTAX_ID = ? AND DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching tax by OTHERTAX_ID', err);
        throw err;
    }
};

export const softDeleteTax = async (id: number) => {
    try {
        return await executeQuery('UPDATE othertax SET DELETED_AT = NOW() WHERE OTHERTAX_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting tax', err);
        throw err;
    }
};


export const getTotalTaxCount = async (search = '') => {
    try {
        let result: any;
        if (search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM othertax WHERE LOWER(OTHERTAX_NAME) LIKE LOWER(?) AND  DELETED_AT IS NULL', [`%${search}%`]);
        } else {
            result = await executeQuery('SELECT COUNT(*) AS total FROM othertax WHERE DELETED_AT IS NULL', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total tax count', err);
        throw err;
    }
};

