import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export const createAnnualTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM annualtax WHERE DISTRICT_ID = ? AND MALMATTA_ID=? AND MILKAT_VAPAR_ID=? AND ANNUALPRICE_NAME=? AND LEVYRATE_NAME=?', [tax.district_id, tax.malmatta_id, tax.milkat_vapar_id, tax.annualprice_name, tax.levyrate_name]);
        if (existing.length > 0) {
            throw new Error('Annual Tax already exists');
        }
        await executeQuery('INSERT INTO annualtax( DISTRICT_ID, MALMATTA_ID, MILKAT_VAPAR_ID, ANNUALPRICE_NAME, LEVYRATE_NAME) VALUES ( ?, ?, ?, ?, ?)', [tax.district_id, tax.malmatta_id, tax.milkat_vapar_id, tax.annualprice_name, tax.levyrate_name]);
        logger.info('Annual Tax created successfully');
    } catch (err) {
        logger.error('Error creating Annual Tax', err);
        throw err;
    }
};

export const updateAnnualTax = async (tax: any) => {
    try {
        const existing: any[] = await executeQuery('SELECT * FROM annualtax WHERE DISTRICT_ID = ? AND MALMATTA_ID=? AND MILKAT_VAPAR_ID=? AND ANNUALPRICE_NAME=? AND LEVYRATE_NAME=?', [tax.district_id, tax.malmatta_id, tax.milkat_vapar_id, tax.annualprice_name, tax.levyrate_name]);
        if (existing.length > 0) {
            throw new Error('Updated Annual tax name already exists. Please choose a different name');
        }
        await executeQuery('UPDATE annualtax SET DISTRICT_ID = ?, MALMATTA_ID=?, MILKAT_VAPAR_ID=?, ANNUALPRICE_NAME=?, LEVYRATE_NAME=? WHERE ANNUALTAX_ID = ?', [tax.district_id, tax.malmatta_id, tax.milkat_vapar_id, tax.annualprice_name, tax.levyrate_name, tax.annualtax_id]);
        logger.info('Annual Tax updated successfully');
    } catch (err) {
        logger.error('Error updating Annual Tax', err);
        throw err;
    }
};

export const getAnnualTaxList = async (offset: number, search: string) => {
    try {
        let query = 'SELECT annualtax.*, district.DISTRICT_NAME, malmatta.DESCRIPTION_NAME, milkatvapar.MILKAT_VAPAR_NAME FROM annualtax ';
        query += 'JOIN district ON annualtax.DISTRICT_ID = district.DISTRICT_ID ';
        query += 'JOIN malmatta ON annualtax.MALMATTA_ID = malmatta.MALMATTA_ID ';
        query += 'JOIN milkat_vapar  milkatvapar ON annualtax.MILKAT_VAPAR_ID = milkatvapar.MILKAT_VAPAR_ID ';
        query += 'WHERE annualtax.DELETED_AT IS NULL';

        const params: any[] = [];

        if (search) {
            query += ' AND (LOWER(annualtax.ANNUALPRICE_NAME) LIKE LOWER(?) OR LOWER(annualtax.LEVYRATE_NAME) LIKE LOWER(?) OR LOWER(district.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(malmatta.DESCRIPTION_NAME) LIKE LOWER(?) OR LOWER(milkatvapar.MILKAT_VAPAR_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY annualtax.ANNUALTAX_ID DESC  LIMIT ? OFFSET ?';
        console.log(query);
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        logger.error('Error fetching tax list', err);
        throw err;
    }
};

export const getAnnualTaxById = async (id: number) => {
    try {
        const query = `
                SELECT annualtax.*, district.DISTRICT_NAME, malmatta.DESCRIPTION_NAME, milkatvapar.MILKAT_VAPAR_NAME
                FROM annualtax
                JOIN district ON annualtax.DISTRICT_ID = district.DISTRICT_ID
                JOIN malmatta ON annualtax.MALMATTA_ID = malmatta.MALMATTA_ID
                JOIN milkat_vapar milkatvapar ON annualtax.MILKAT_VAPAR_ID = milkatvapar.MILKAT_VAPAR_ID
                WHERE annualtax.ANNUALTAX_ID = ? AND annualtax.DELETED_AT IS NULL
            `;
        const result = await executeQuery(query, [id]);
        return result[0];
    } catch (err) {
        logger.error('Error fetching tax by ANNUALTAX_ID', err);
        throw err;
    }
};

export const softDeleteAnnualTax = async (id: number) => {
    try {
        return await executeQuery('UPDATE annualtax SET  DELETED_AT = NOW() WHERE ANNUALTAX_ID = ?', [id]);

    } catch (err) {
        logger.error('Error soft deleting annual tax', err);
        throw err;
    }
};


export const getTotalAnnualTaxCount = async (search = '') => {
    try {
        let result: any;
        if (search) {
            result = await executeQuery(`
                SELECT COUNT(*) AS total
                FROM annualtax
                JOIN district ON annualtax.DISTRICT_ID = district.DISTRICT_ID
                JOIN malmatta ON annualtax.MALMATTA_ID = malmatta.MALMATTA_ID
                JOIN milkat_vapar milkatvapar ON annualtax.MILKAT_VAPAR_ID = milkatvapar.MILKAT_VAPAR_ID
                WHERE 
                LOWER(district.DISTRICT_NAME) LIKE LOWER(?) 
                OR LOWER(malmatta.DESCRIPTION_NAME) LIKE LOWER(?) 
                OR LOWER(milkatvapar.MILKAT_VAPAR_NAME) LIKE LOWER(?) 
                AND annualtax.DELETED_AT IS NULL
            `, [`%${search}%`, `%${search}%`, `%${search}%`]);
        } else {
            result = await executeQuery('SELECT COUNT(*) AS total FROM annualtax WHERE  DELETED_AT IS NULL', []);
        }
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total annual tax count', err);
        throw err;
    }
};


export const getAnnualTaxByDistrict = async (districtId: number) => {
    try {
        const query = `
                SELECT annualtax.*, district.DISTRICT_NAME, malmatta.DESCRIPTION_NAME, milkatvapar.MILKAT_VAPAR_NAME
                FROM annualtax
                JOIN district ON annualtax.DISTRICT_ID = district.DISTRICT_ID
                JOIN malmatta ON annualtax.MALMATTA_ID = malmatta.MALMATTA_ID
                JOIN milkat_vapar milkatvapar ON annualtax.MILKAT_VAPAR_ID = milkatvapar.MILKAT_VAPAR_ID
                WHERE annualtax.DISTRICT_ID = ? AND annualtax.DELETED_AT IS NULL
            `;
        const result = await executeQuery(query, [districtId]);
        return result;
    } catch (err) {
        logger.error('Error fetching tax by district', err);
        throw err;
    }
}
export const getAnnualTaxByDistrictWithPagination = async (districtId: number, offset: number, search: string) => {
    try {
        let query = `
            SELECT annualtax.*, district.DISTRICT_NAME, malmatta.DESCRIPTION_NAME, milkatvapar.MILKAT_VAPAR_NAME
            FROM annualtax
            JOIN district ON annualtax.DISTRICT_ID = district.DISTRICT_ID
            JOIN malmatta ON annualtax.MALMATTA_ID = malmatta.MALMATTA_ID
            JOIN milkat_vapar milkatvapar ON annualtax.MILKAT_VAPAR_ID = milkatvapar.MILKAT_VAPAR_ID
            WHERE annualtax.DISTRICT_ID = ? AND annualtax.DELETED_AT IS NULL
        `;

        const params: any[] = [districtId];

        if (search) {
            query += ' AND (LOWER(annualtax.ANNUALPRICE_NAME) LIKE LOWER(?) OR LOWER(annualtax.LEVYRATE_NAME) LIKE LOWER(?) OR LOWER(malmatta.DESCRIPTION_NAME) LIKE LOWER(?) OR LOWER(milkatvapar.MILKAT_VAPAR_NAME) LIKE LOWER(?))';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        let totalCount = await getCount(query, params);
        query += ' ORDER BY annualtax.ANNUALTAX_ID DESC LIMIT ? OFFSET ?';
        params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

        const result = await executeQuery(query, params);
        (result) ? result : null;
        return (result) ? { 'data': result, 'total_count': totalCount } : null;

    } catch (err) {
        logger.error('Error fetching tax by district with pagination', err);
        throw err;
    }
};

export const getCount = async (query, params) => {
    try {
        const result = await executeQuery(query, params);

        return Object.keys(result).length ?? 0;
    } catch (err) {
        logger.error('Error fetching step count', err);
        throw err;
    }
}

export const getDistrictList = async () => {
    try {
        const result = await executeQuery('SELECT d.DISTRICT_ID, d.DISTRICT_NAME  FROM annualtax as an JOIN district d ON d.DISTRICT_ID = an.DISTRICT_ID  WHERE an.DELETED_AT IS NULL GROUP BY an.DISTRICT_ID', []);
        return result ?? [];
    } catch (err) {
        logger.error('Error fetching district list', err);
        throw err;
    }
}

