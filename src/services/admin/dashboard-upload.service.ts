import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";



/*
UPLOAD_ID
TALUKA_ID
PANCHAYAT_ID
FILE_NAME
R_PATH
TDATE
TTIME
DISTRICT_ID


SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID
FROM uploaddatadashboard;

*/
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

export const getAllUploadData = async (page: number): Promise<UploadDataDashboard[]> => {
    try {
        const offset = (page - 1) * PAGINATION.LIMIT;
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID FROM uploaddatadashboard WHERE DELETED_AT IS NULL LIMIT ? OFFSET ?`;
        const result = await executeQuery(query, [PAGINATION.LIMIT, offset]) as UploadDataDashboard[];
        return result;
    } catch (error) {
        logger.error(`Error fetching upload data: ${error}`);
        throw error;
    }
};

export const getUploadDataById = async (id: number): Promise<UploadDataDashboard | null> => {
    try {
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID FROM uploaddatadashboard WHERE UPLOAD_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by ID: ${error}`);
        throw error;
    }
};

export const createUploadData = async (data: any): Promise<void> => {
    try {
        const dateNow = new Date(Date.now()).toISOString().replace('T', ' ').split('.')[0];

        const query = `INSERT INTO uploaddatadashboard ( TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
        const values = [data.taluka_id, data.panchayat_id, data.file_name, data.r_path, dateNow, dateNow, data.district_id];
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error creating upload data: ${error}`);
        throw error;
    }
};

export const updateUploadData = async (id: number, data: any): Promise<void> => {
    try {
        const dateNow = new Date(Date.now()).toISOString().replace('T', ' ').split('.')[0];
        const query = `UPDATE uploaddatadashboard SET TALUKA_ID = ?, PANCHAYAT_ID = ?, FILE_NAME = ?, R_PATH = ?, TDATE = ?, TTIME = ?, DISTRICT_ID = ? WHERE UPLOAD_ID = ?`;
        const values = [data.taluka_id, data.panchayat_id, data.file_name, data.r_path, dateNow, dateNow, data.district_id, id];
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error updating upload data: ${error}`);
        throw error;
    }
};

export const softDeleteUploadData = async (id: number): Promise<void> => {
    try {
        const query = `UPDATE uploaddatadashboard SET DELETED_AT = CURRENT_TIMESTAMP WHERE UPLOAD_ID = ?`;
        await executeQuery(query, [id]);
    } catch (error) {
        logger.error(`Error soft deleting upload data: ${error}`);
        throw error;
    }
};

export const getUploadDataByPanchayatId = async (id: number): Promise<UploadDataDashboard | null> => {
    try {
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID FROM uploaddatadashboard WHERE PANCHAYAT_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by panchayat ID: ${error}`);
        throw error;
    }
};

export const getUploadDataByTalukaId = async (id: number): Promise<UploadDataDashboard | null> => {
    try {
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID FROM uploaddatadashboard WHERE TALUKA_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by taluka ID: ${error}`);
        throw error;
    }
};

export const getUploadDataByDistrictId = async (id: number): Promise<UploadDataDashboard | null> => {
    try {
        const query = `SELECT UPLOAD_ID, TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID FROM uploaddatadashboard WHERE DISTRICT_ID = ? AND DELETED_AT IS NULL`;
        const result = await executeQuery(query, [id]) as UploadDataDashboard[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload data by district ID: ${error}`);
        throw error;
    }
};

export const getUploadDataCount = async (): Promise<number> => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as count FROM uploaddatadashboard WHERE DELETED_AT IS NULL', []);
        return result[0].count;
    } catch (error) {
        logger.error(`Error fetching upload data count: ${error}`);
        throw error;
    }
};