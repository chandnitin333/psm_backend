import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { Utils } from "../../utils/util";


interface UploadDataDashboard {
    UPLOAD_ID: number;
    TALUKA_ID: number;
    PANCHAYAT_ID: number;
    FILE_NAME: string;
    R_PATH: string;
    TDATE: string;
    TTIME: string;
    DISTRICT_ID: number;
    DELETED_AT: string
}

let tableNames = {
    'sachive': 'uploaddatadashboard',
    'sarpanch': 'uploaddatadashboard1',
    'upsarpanch': 'uploaddatadashboard2',
};

let list = ['sachive', 'sarpanch', 'upsarpanch'];

export const getAllUploadData = async (params: any): Promise<{ data: any[], totalRecords: number }> => {
    try {

        const { page_number, searchText, type } = params;
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';

        const offset = (page_number - 1) * PAGINATION.LIMIT;
        let query = `SELECT ds.UPLOAD_ID, ds.TALUKA_ID, ds.PANCHAYAT_ID, ds.FILE_NAME${i}, ds.R_PATH${i}, ds.TDATE, ds.TTIME, ds.DISTRICT_ID,  RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME, RTRIM(t.TALUKA_NAME) as TALUKA_NAME, RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME FROM ${table} as ds
              join district d on ds.DISTRICT_ID = d.DISTRICT_ID 
               join taluka t on ds.TALUKA_ID = t.TALUKA_ID 
               join panchayat p on ds.PANCHAYAT_ID = p.PANCHAYAT_ID 
        WHERE  ds.DELETED_AT IS NULL  `;
        console.log("tableNames===", query)
        let data = [];

        if (searchText) {
            const searchPattern = `%${searchText}%`;
            query += ` AND (ds.FILE_NAME${i} LIKE ? OR d.DISTRICT_NAME LIKE ? OR t.TALUKA_NAME LIKE ? OR p.PANCHAYAT_NAME LIKE ?)`;
            data = [searchPattern, searchPattern, searchPattern, searchPattern, PAGINATION.LIMIT, offset]
        } else {
            data = [PAGINATION.LIMIT, offset];
        }
        let totalRecords = await getUploadDataCount(query, data);

        query += ` ORDER BY ds.UPLOAD_ID DESC LIMIT ? OFFSET ?`;
        const result: any = await executeQuery(query, data) as any[];
        return { 'data': result, 'totalRecords': totalRecords };
    } catch (error) {
        logger.error(`Error fetching upload data: ${error}`);
        throw error;
    }
};

export const getUploadDataById = async (id: number, type: string): Promise<UploadDataDashboard | null> => {
    try {
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME${i}, R_PATH${i}, TDATE, TTIME, DISTRICT_ID FROM ${table} WHERE UPLOAD_ID = ? AND DELETED_AT IS NULL`;
        console.log("query===", query)
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by ID: ${error}`);
        throw error;
    }
};

export const createUploadData = async (data: any): Promise<void> => {
    try {
        const { taluka_id, panchayat_id, name, r_path, district_id, type } = data;
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        if (!taluka_id || !panchayat_id || !name || !r_path || !district_id || !type) {
            throw new Error("Missing required fields");
        }

        const dateNow = await Utils.getCurrentDateTime();

        // console.log("dateNow=====",dateNow);
        const query = `INSERT INTO ${table} (TALUKA_ID, PANCHAYAT_ID, FILE_NAME${i}, R_PATH${i}, TDATE, TTIME, DISTRICT_ID) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [taluka_id, panchayat_id, name, r_path, dateNow, dateNow, district_id];
        console.log("values===", values)
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error creating upload data: ${error}`);
        throw error;
    }
};

export const updateUploadData = async (id: number, data: any, type: string): Promise<void> => {
    try {
        let table = tableNames[type] ?? '';
        const dateNow = await Utils.getCurrentDateTime();
        const fieldsToUpdate = [];
        const values = [];
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        if (data.taluka_id !== undefined && data.taluka_id !== null) {
            fieldsToUpdate.push("TALUKA_ID = ?");
            values.push(data.taluka_id);
        }
        if (data.panchayat_id !== undefined && data.panchayat_id !== null) {
            fieldsToUpdate.push("PANCHAYAT_ID = ?");
            values.push(data.panchayat_id);
        }
        if (data.name !== undefined && data.name !== null) {
            fieldsToUpdate.push(`FILE_NAME${i} = ?`);
            values.push(data.name);
        }

        if (data.r_path !== undefined && data.r_path !== null && data.r_path !== 'undefined/undefined') {
            fieldsToUpdate.push(`R_PATH${i} = ?`);
            values.push(data.r_path);
        }
        if (data.district_id !== undefined && data.district_id !== null) {
            fieldsToUpdate.push("DISTRICT_ID = ?");
            values.push(data.district_id);
        }

        fieldsToUpdate.push("TDATE = ?", "TTIME = ?");
        values.push(dateNow, dateNow);

        values.push(id);

        const query = `UPDATE ${table} SET ${fieldsToUpdate.join(", ")} WHERE UPLOAD_ID = ?`;
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error updating upload data: ${error}`);
        throw error;
    }
};

export const softDeleteUploadData = async (id: number, type: string): Promise<void> => {
    try {
        let table = tableNames[type] ?? '';
        const query = `UPDATE ${table} SET DELETED_AT = CURRENT_TIMESTAMP WHERE UPLOAD_ID = ?`;
        await executeQuery(query, [id]);
    } catch (error) {
        logger.error(`Error soft deleting upload data: ${error}`);
        throw error;
    }
};

export const getUploadDataByPanchayatId = async (id: number, type: string): Promise<UploadDataDashboard | null> => {
    try {
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME${i}, R_PATH${i}, TDATE, TTIME, DISTRICT_ID FROM ${table} WHERE PANCHAYAT_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by panchayat ID: ${error}`);
        throw error;
    }
};

export const getUploadDataByTalukaId = async (id: number, type: string): Promise<UploadDataDashboard | null> => {
    try {
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME${i}, R_PATH${i}, TDATE, TTIME, DISTRICT_ID FROM ${table} WHERE TALUKA_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by taluka ID: ${error}`);
        throw error;
    }
};

export const getUploadDataByDistrictId = async (id: number, type: string): Promise<UploadDataDashboard | null> => {
    try {
        let table = tableNames[type] ?? '';
        let i = list.indexOf(type) != 0 ? list.indexOf(type) == 1 ? 1 : 2 : '';
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME${i}, R_PATH${i}, TDATE, TTIME, DISTRICT_ID FROM ${table} WHERE DISTRICT_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by district ID: ${error}`);
        throw error;
    }
};

export const getUploadDataCount = async (query: string, params: any): Promise<any> => {
    try {

        const result = await executeQuery(query, params);
        return Object.keys(result).length ?? 0;
    } catch (error) {
        logger.error(`Error fetching upload data count: ${error}`);
        throw new Error(error);

    }
};