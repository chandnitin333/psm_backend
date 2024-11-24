import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createOtherTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM createothertax WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=?', [tax.district_id, tax.taluka_id, tax.panchayat_id]);
        if (existing.length > 0) {
            throw new Error('Other Tax already exists');
        }
        await executeQuery('INSERT INTO createothertax( DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, TAXID1, TAXRATE1, TAXID2, TAXRATE2, TAXID3, TAXRATE3, TAXID4, TAXRATE4, TAXID5, TAXRATE5) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [tax.district_id, tax.taluka_id, tax.panchayat_id, tax.taxid1, tax.taxrate1, tax.taxid2, tax.taxrate2, tax.taxid3, tax.taxrate3, tax.taxid4, tax.taxrate4, tax.taxid5, tax.taxrate5]);
        logger.info('Other Tax created successfully');
    } catch (err) {
        logger.error('Error creating Other Tax', err);
        throw err;
    }
};

export const updateOtherTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM createothertax WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND TAXID1=? AND TAXRATE1=? AND TAXID2=? AND TAXRATE2=? AND TAXID3=? AND TAXRATE3=? AND TAXID4=? AND TAXRATE4=? AND TAXID5=? AND TAXRATE5=?', [tax.district_id, tax.taluka_id, tax.panchayat_id, tax.taxid1, tax.taxrate1, tax.taxid2, tax.taxrate2, tax.taxid3, tax.taxrate3, tax.taxid4, tax.taxrate4, tax.taxid5, tax.taxrate5]);
        if (existing.length > 0) {
            throw new Error('Updated other tax name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE createothertax SET  DISTRICT_ID = ?, TALUKA_ID=?, PANCHAYAT_ID=?, TAXID1=?, TAXRATE1=?, TAXID2=?, TAXRATE2=?, TAXID3=?, TAXRATE3=?, TAXID4=?, TAXRATE4=?, TAXID5=?, TAXRATE5=? WHERE CREATEOTHERTAX_ID = ?', [tax.district_id, tax.taluka_id, tax.panchayat_id, tax.taxid1, tax.taxrate1, tax.taxid2, tax.taxrate2, tax.taxid3, tax.taxrate3, tax.taxid4, tax.taxrate4, tax.taxid5, tax.taxrate5, tax.othertax_id]);
        logger.info('Other Tax updated successfully');
    } catch (err) {
        logger.error('Error updating Tax', err);
        throw err;
    }
};

export const getOtherTaxList = async (offset: number, search: string, panchayat_id: number) => {
    try {
        let query = 'SELECT ot.*, d.DISTRICT_NAME, t.TALUKA_NAME, p.PANCHAYAT_NAME FROM createothertax ot LEFT JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID LEFT JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID LEFT JOIN panchayat p ON ot.PANCHAYAT_ID = p.PANCHAYAT_ID WHERE ot. DELETED_AT IS NULL';
        const params: any[] = [];

        if (search) {
            query += ' AND (LOWER(d.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(t.TALUKA_NAME) LIKE LOWER(?) OR LOWER(p.PANCHAYAT_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (panchayat_id) {
            query += ' AND ot.PANCHAYAT_ID = ?';
            params.push(panchayat_id);
        }
        query += ' ORDER BY ot.CREATEOTHERTAX_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching tax list', err);
        throw err;
    }
};

export const getOtherTaxById = async (id: number) => {
    try {
        const result = await executeQuery('SELECT ot.*, d.DISTRICT_NAME, t.TALUKA_NAME, p.PANCHAYAT_NAME FROM createothertax ot JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID JOIN panchayat p ON ot.PANCHAYAT_ID = p.PANCHAYAT_ID WHERE ot.CREATEOTHERTAX_ID = ? AND ot. DELETED_AT IS NULL', [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching tax by CREATEOTHERTAX_ID', err);
        throw err;
    }
};

export const softDeleteOtherTax = async (id: number) => {
    try {
        return await executeQuery('UPDATE createothertax SET  DELETED_AT = NOW() WHERE CREATEOTHERTAX_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting tax', err);
        throw err;
    }
};


export const getTotalOtherTaxCount = async (search = '') => {
    try {
        let result: any;
        if (search) {
            result = await executeQuery('SELECT COUNT(*) AS total FROM createothertax ot JOIN district d ON ot.DISTRICT_ID = d.DISTRICT_ID JOIN taluka t ON ot.TALUKA_ID = t.TALUKA_ID JOIN panchayat p ON ot.PANCHAYAT_ID = p.PANCHAYAT_ID WHERE (LOWER(d.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(t.TALUKA_NAME) LIKE LOWER(?) OR LOWER(p.PANCHAYAT_NAME) LIKE LOWER(?)) AND ot. DELETED_AT IS NULL', [`%${search}%`, `%${search}%`, `%${search}%`]);
        } else {
            result = await executeQuery('SELECT COUNT(*) AS total FROM createothertax WHERE  DELETED_AT IS NULL', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total tax count', err);
        throw err;
    }
};

