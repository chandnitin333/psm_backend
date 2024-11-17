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

export const getAllUploadData = async (page: number): Promise<UploadDataDashboard[]> => {
    try {
        const offset = (page - 1) * PAGINATION.LIMIT;
        const query = `SELECT ds.UPLOAD_ID, ds.TALUKA_ID, ds.PANCHAYAT_ID, ds.FILE_NAME, ds.R_PATH, ds.TDATE, ds.TTIME, ds.DISTRICT_ID,  RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME, RTRIM(t.TALUKA_NAME) as TALUKA_NAME, RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME FROM uploaddatadashboard as ds
              join district d on ds.DISTRICT_ID = d.DISTRICT_ID 
                   join taluka t on ds.TALUKA_ID = t.TALUKA_ID 
                   join panchayat p on ds.PANCHAYAT_ID = p.PANCHAYAT_ID 
        WHERE  ds.DELETED_AT IS NULL ORDER BY ds.UPLOAD_ID DESC LIMIT ? OFFSET ?`;
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
        const { taluka_id, panchayat_id, name, r_path, district_id } = data;

        if (!taluka_id || !panchayat_id || !name || !r_path || !district_id) {
            throw new Error("Missing required fields");
        }

        const dateNow = await Utils.getCurrentDateTime();

        // console.log("dateNow=====",dateNow);
        const query = `INSERT INTO uploaddatadashboard (TALUKA_ID, PANCHAYAT_ID, FILE_NAME, R_PATH, TDATE, TTIME, DISTRICT_ID) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [taluka_id, panchayat_id, name, r_path, dateNow, dateNow, district_id];
        console.log("values===", values)
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error creating upload data: ${error}`);
        throw error;
    }
};

export const updateUploadData = async (id: number, data: any): Promise<void> => {
    try {
        const dateNow = await Utils.getCurrentDateTime();
        const fieldsToUpdate = [];
        const values = [];

        if (data.taluka_id !== undefined && data.taluka_id !== null) {
            fieldsToUpdate.push("TALUKA_ID = ?");
            values.push(data.taluka_id);
        }
        if (data.panchayat_id !== undefined && data.panchayat_id !== null) {
            fieldsToUpdate.push("PANCHAYAT_ID = ?");
            values.push(data.panchayat_id);
        }
        if (data.name !== undefined && data.name !== null) {
            fieldsToUpdate.push("FILE_NAME = ?");
            values.push(data.name);
        }

        if (data.r_path !== undefined && data.r_path !== null && data.r_path !== 'undefined/undefined') {
            fieldsToUpdate.push("R_PATH = ?");
            values.push(data.r_path);
        }
        if (data.district_id !== undefined && data.district_id !== null) {
            fieldsToUpdate.push("DISTRICT_ID = ?");
            values.push(data.district_id);
        }

        fieldsToUpdate.push("TDATE = ?", "TTIME = ?");
        values.push(dateNow, dateNow);

        values.push(id);

        const query = `UPDATE uploaddatadashboard SET ${fieldsToUpdate.join(", ")} WHERE UPLOAD_ID = ?`;
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
        const result = await executeQuery('SELECT COUNT(*) as count FROM uploaddatadashboard  as ds join district d on ds.DISTRICT_ID = d.DISTRICT_ID join taluka t on ds.TALUKA_ID = t.TALUKA_ID  join panchayat p on ds.PANCHAYAT_ID = p.PANCHAYAT_ID WHERE  ds.DELETED_AT IS NULL', []);
        return result[0].count;
    } catch (error) {
        logger.error(`Error fetching upload data count: ${error}`);
        throw new Error(error);

    }
};