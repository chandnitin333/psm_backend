import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { Utils } from "../../utils/util";

const usersData = ["new_user", "existing_user"];
export const createNewUser = async (data: any) => {
    try {
        let dates = Utils.getCurrentDateTimeWithAMPM();
        if(data.user_type == "new_user")
        {
            const existing: any[] = await executeQuery("SELECT * FROM entries WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_id=? AND NAME=? AND SURNAME=? AND USERNAME=? AND pwd=?", [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd]);
            if (existing.length > 0) {
                throw new Error('This User already exists');
            }
            
            await executeQuery('INSERT INTO entries( DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_id, NAME, SURNAME, USERNAME, pwd,tempf, reg_date,reg_time,flag) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, "Y",dates.simpleDate,dates.dateWithAMPM,"Y"]);
            logger.info('User created successfully');
        }
        else if(data.user_type == "ferfar_user")
        {
            const existing: any[] = await executeQuery("SELECT * FROM ferfaruser WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_id=? AND NAME=? AND SURNAME=? AND USERNAME=? AND pwd=?", [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd]);
            if (existing.length > 0) {
                throw new Error('This Ferfar User already exists');
            }
            await executeQuery('INSERT INTO ferfaruser( DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_id, NAME, SURNAME, USERNAME, pwd,tempf, reg_date,reg_time) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, "Y",dates.simpleDate,dates.dateWithAMPM]);
            logger.info('Ferfar User created successfully');
        }
        else if(data.user_type == "ferfar_pdf_user")
        {
            const existing: any[] = await executeQuery("SELECT * FROM ferfaruserpdf WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_id=? AND NAME=? AND SURNAME=? AND USERNAME=? AND pwd=?", [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd]);
            if (existing.length > 0) {
                throw new Error('This Ferfar PDF User already exists');
            }
            await executeQuery('INSERT INTO ferfaruserpdf( DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_id, NAME, SURNAME, USERNAME, pwd,tempf, reg_date,reg_time) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, "Y",dates.simpleDate,dates.dateWithAMPM]);
            logger.info('Ferfar PDF User created successfully');
        }
        else if(data.user_type == "vasuli_user")
        {
            const existing: any[] = await executeQuery("SELECT * FROM vasuliuser WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_id=? AND NAME=? AND SURNAME=? AND USERNAME=? AND pwd=?", [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd]);
            if (existing.length > 0) {
                throw new Error('This Vasuli User already exists');
            }
            await executeQuery('INSERT INTO vasuliuser( DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_id, NAME, SURNAME, USERNAME, pwd,tempf, reg_date,reg_time) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, "Y",dates.simpleDate,dates.dateWithAMPM]);
            logger.info('Vasuli User created successfully');
        }
    } catch (err) {
        logger.error('Error creating User', err);
        throw err;
    }
};

export const updateUser = async (data: any) => {
    try {
        if(data.user_type == "new_user")
        {
            await executeQuery('UPDATE entries SET DISTRICT_ID = ? AND TALUKA_ID=? , PANCHAYAT_ID=? , GATGRAMPANCHAYAT_id=? , NAME=? , SURNAME=? , USERNAME=? , pwd=?  WHERE USER_ID = ?', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, data.id]);
            logger.info('User updated successfully');
        }
        else if(data.user_type == "ferfar_user")
        {
            await executeQuery('UPDATE ferfaruser SET DISTRICT_ID = ? AND TALUKA_ID=? , PANCHAYAT_ID=? , GATGRAMPANCHAYAT_id=? , NAME=? , SURNAME=? , USERNAME=? , pwd=?  WHERE FERFARUSER_ID = ?', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, data.id]);
            logger.info('Ferfar User updated successfully');
        }
        else if(data.user_type == "ferfar_pdf_user")
        {
            await executeQuery('UPDATE ferfaruserpdf SET DISTRICT_ID = ? AND TALUKA_ID=? , PANCHAYAT_ID=? , GATGRAMPANCHAYAT_id=? , NAME=? , SURNAME=? , USERNAME=? , pwd=?  WHERE FERFARUSERPDF_ID = ?', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, data.id]);
            logger.info('Ferfar PDF User updated successfully');
        }
        else if(data.user_type == "vasuli_user")
        {
            await executeQuery('UPDATE vasuliuser SET DISTRICT_ID = ? AND TALUKA_ID=? , PANCHAYAT_ID=? , GATGRAMPANCHAYAT_id=? , NAME=? , SURNAME=? , USERNAME=? , pwd=?  WHERE VASULIUSER_ID = ?', [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.name, data.surname, data.username, data.pwd, data.id]);
            logger.info('Vasuli User updated successfully');
        }
        
    } catch (err) {
        logger.error('Error updating User', err);
        throw err;
    }
};

export const getUserList = async (offset: number, search: string, user_type:string) => {
    try {
        if(user_type == "new_user")
        {
            let query = 'SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME FROM entries en ';
            query += 'JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID ';
            query += 'JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID ';
            query += 'JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID ';
            query += 'JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID ';
            query += 'WHERE en.IS_DELETE=0';

            const params: any[] = [];

            if (search) {
                query += ' AND (LOWER(district.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?) OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(en.NAME) LIKE LOWER(?) OR LOWER(en.SURNAME) LIKE LOWER(?) OR LOWER(en.USERNAME) LIKE LOWER(?))';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY en.USER_ID DESC LIMIT ? OFFSET ?';
            params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

            const result = await executeQuery(query, params);
            return result;
        }
        else if(user_type == "ferfar_user")
        {
            let query = 'SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME FROM ferfaruser en ';
            query += 'JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID ';
            query += 'JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID ';
            query += 'JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID ';
            query += 'JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID ';
            query += 'WHERE en.IS_DELETE=0';

            const params: any[] = [];

            if (search) {
                query += ' AND (LOWER(district.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?) OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(en.NAME) LIKE LOWER(?) OR LOWER(en.SURNAME) LIKE LOWER(?) OR LOWER(en.USERNAME) LIKE LOWER(?))';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY en.FERFARUSER_ID DESC LIMIT ? OFFSET ?';
            params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

            const result = await executeQuery(query, params);
            return result;
        }
        else if(user_type == "ferfar_pdf_user")
        {
            let query = 'SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME FROM ferfaruserpdf en ';
            query += 'JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID ';
            query += 'JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID ';
            query += 'JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID ';
            query += 'JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID ';
            query += 'WHERE en.IS_DELETE=0';

            const params: any[] = [];

            if (search) {
                query += ' AND (LOWER(district.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?) OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(en.NAME) LIKE LOWER(?) OR LOWER(en.SURNAME) LIKE LOWER(?) OR LOWER(en.USERNAME) LIKE LOWER(?))';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY en.FERFARUSERPDF_ID DESC LIMIT ? OFFSET ?';
            params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

            const result = await executeQuery(query, params);
            return result;
        }
        else if(user_type == "vasuli_user")
        {
            let query = 'SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME FROM vasuliuser en ';
            query += 'JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID ';
            query += 'JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID ';
            query += 'JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID ';
            query += 'JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID ';
            query += 'WHERE en.IS_DELETE=0';

            const params: any[] = [];

            if (search) {
                query += ' AND (LOWER(district.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?) OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(en.NAME) LIKE LOWER(?) OR LOWER(en.SURNAME) LIKE LOWER(?) OR LOWER(en.USERNAME) LIKE LOWER(?))';
                params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
            }

            query += ' ORDER BY en.VASULIUSER_ID DESC LIMIT ? OFFSET ?';
            params.push(PAGINATION.LIMIT, PAGINATION.LIMIT * offset);

            const result = await executeQuery(query, params);
            return result;
        }
        
    } catch (err) {
        logger.error('Error fetching tax list', err);
        throw err;
    }
};

export const getUserById = async (id: number, user_type:string) => {
        try {

            if(user_type == "new_user")
            {
                const query = `
                    SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME
                    FROM entries en
                    JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                    JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                    JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                    JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                    WHERE en.USER_ID = ? AnD en.IS_DELETE=0
                `;
                const result = await executeQuery(query, [id]);
                return result[0];
            }
            else if(user_type == "ferfar_user")
            {
                const query = `
                    SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME
                    FROM ferfaruser en
                    JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                    JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                    JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                    JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                    WHERE en.FERFARUSER_ID = ? AnD en.IS_DELETE=0
                `;
                const result = await executeQuery(query, [id]);
                return result[0];
            }
            else if(user_type == "ferfar_pdf_user")
            {
                const query = `
                    SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME
                    FROM ferfaruserpdf en
                    JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                    JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                    JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                    JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                    WHERE en.FERFARUSERPDF_ID = ? AnD en.IS_DELETE=0
                `;
                const result = await executeQuery(query, [id]);
                return result[0];
            }
            else if(user_type == "vasuli_user")
            {
                const query = `
                    SELECT en.*, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME
                    FROM vasuliuser en
                    JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                    JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                    JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                    JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                    WHERE en.VASULIUSER_ID = ? AnD en.IS_DELETE=0
                `;
                const result = await executeQuery(query, [id]);
                return result[0];
            } 
        } catch (err) {
            logger.error('Error fetching user by USER_ID', err);
            throw err;
        }    
};

export const softDeleteUser = async (id: number, user_type:string) => {
    try {
        if(user_type == "new_user")
        {
            return await executeQuery('UPDATE entries SET IS_DELETE=1 WHERE USER_ID = ?', [id]);
        }
        else if(user_type == "ferfar_user")
        {
            return await executeQuery('UPDATE ferfaruser SET IS_DELETE=1 WHERE FERFARUSER_ID = ?', [id]);
        }
        else if(user_type == "ferfar_pdf_user")
        {
            return await executeQuery('UPDATE ferfaruserpdf SET IS_DELETE=1 WHERE FERFARUSERPDF_ID = ?', [id]);
        }
        else if(user_type == "vasuli_user")
        {
            return await executeQuery('UPDATE vasuliuser SET IS_DELETE=1 WHERE VASULIUSER_ID = ?', [id]);
        }

    } catch (err) {
        logger.error('Error soft deleting in user', err);
        throw err;
    }
};
 

export const getTotalUserCount = async (user_type:string, search='') => {
    try {
        let result: any;
        
            if(user_type == "new_user")
            {
                if (search) {
                    result = await executeQuery(`
                        
                        SELECT COUNT(en.USER_ID) AS total
                        FROM entries en
                        JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                        JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                        JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                        JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                        WHERE LOWER(district.DISTRICT_NAME) LIKE LOWER(?)
                        OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?)
                        OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(en.NAME) LIKE LOWER(?)
                        OR LOWER(en.SURNAME) LIKE LOWER(?)
                        OR LOWER(en.USERNAME) LIKE LOWER(?)
                        AND en.IS_DELETE=0
                    `, [`%${search}%`, `%${search}%`, `%${search}%`,`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
                } else {
                    result = await executeQuery('SELECT COUNT(*) AS total FROM entries WHERE  IS_DELETE=0', []);
                }
            }
            else if(user_type == "ferfar_user")
            {
                if (search) {
                    result = await executeQuery(`
                        
                        SELECT COUNT(en.FERFARUSER_ID) AS total
                        FROM ferfaruser en
                        JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                        JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                        JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                        JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                        WHERE LOWER(district.DISTRICT_NAME) LIKE LOWER(?)
                        OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?)
                        OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(en.NAME) LIKE LOWER(?)
                        OR LOWER(en.SURNAME) LIKE LOWER(?)
                        OR LOWER(en.USERNAME) LIKE LOWER(?)
                        AND en.IS_DELETE=0
                    `, [`%${search}%`, `%${search}%`, `%${search}%`,`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
                } else {
                    result = await executeQuery('SELECT COUNT(*) AS total FROM ferfaruser WHERE  IS_DELETE=0', []);
                }
            }
            else if(user_type == "ferfar_pdf_user")
            {
                if (search) {
                    result = await executeQuery(`
                        
                        SELECT COUNT(en.FERFARUSERPDF_ID) AS total
                        FROM ferfaruserpdf en
                        JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                        JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                        JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                        JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                        WHERE LOWER(district.DISTRICT_NAME) LIKE LOWER(?)
                        OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?)
                        OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(en.NAME) LIKE LOWER(?)
                        OR LOWER(en.SURNAME) LIKE LOWER(?)
                        OR LOWER(en.USERNAME) LIKE LOWER(?)
                        AND en.IS_DELETE=0
                    `, [`%${search}%`, `%${search}%`, `%${search}%`,`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
                } else {
                    result = await executeQuery('SELECT COUNT(*) AS total FROM ferfaruserpdf WHERE  IS_DELETE=0', []);
                }
            }
            else if(user_type == "vasuli_user")
            {
                if (search) {
                    result = await executeQuery(`
                        
                        SELECT COUNT(en.VASULIUSER_ID) AS total
                        FROM vasuliuser en
                        JOIN district ON en.DISTRICT_ID = district.DISTRICT_ID
                        JOIN taluka ON en.TALUKA_ID = taluka.TALUKA_ID
                        JOIN panchayat ON en.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
                        JOIN gatgrampanchayat ON en.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
                        WHERE LOWER(district.DISTRICT_NAME) LIKE LOWER(?)
                        OR LOWER(taluka.TALUKA_NAME) LIKE LOWER(?)
                        OR LOWER(panchayat.PANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(gatgrampanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?)
                        OR LOWER(en.NAME) LIKE LOWER(?)
                        OR LOWER(en.SURNAME) LIKE LOWER(?)
                        OR LOWER(en.USERNAME) LIKE LOWER(?)
                        AND en.IS_DELETE=0
                    `, [`%${search}%`, `%${search}%`, `%${search}%`,`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
                } else {
                    result = await executeQuery('SELECT COUNT(*) AS total FROM vasuliuser WHERE  IS_DELETE=0', []);
                }
            }
        
        return result[0].total;
    } catch (err) {
        logger.error('Error fetching total user count', err);
        throw err;
    }
};

