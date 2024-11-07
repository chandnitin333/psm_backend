import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

interface UploadFile {
    UPLOAD_ID: number;
    FILE_NAME: string;
    R_PATH: string;
    IS_DELETE: number;
}

export const getAllUploadFile = async (page: number): Promise<UploadFile[]> => {
    try {
        const offset = (page - 1) * PAGINATION.LIMIT;
        const query = `SELECT * FROM up WHERE IS_DELETE = 0 LIMIT ? OFFSET ?`;
        const result = await executeQuery(query, [PAGINATION.LIMIT, offset]) as UploadFile[];
        return result;
    } catch (error) {
        logger.error(`Error fetching upload file: ${error}`);
        throw error;
    }
};

export const getUploadFileById = async (id: number): Promise<UploadFile | null> => {
    try {
        const query = `SELECT * FROM up WHERE UPLOAD_ID = ? AND IS_DELETE = 0`;
        const result = await executeQuery(query, [id]) as UploadFile[];
        return result.length ? result[0] : null;
    } catch (error) {
        logger.error(`Error fetching upload file by ID: ${error}`);
        throw error;
    }
};

export const createUploadFile = async (data: any): Promise<void> => {
    try {
        const { name, r_path } = data;

        if (!name || !r_path ) {
            throw new Error("Missing required fields");
        }
        const query = `INSERT INTO up (FILE_NAME, R_PATH) VALUES (?, ?)`;
        const values = [name, r_path];
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error creating upload file: ${error}`);
        throw error;
    }
};

export const updateUploadFile = async (id: number, data: any): Promise<void> => {
    try {
        const query = `UPDATE up SET FILE_NAME = ?, R_PATH = ? WHERE UPLOAD_ID = ?`;
        const values = [data.name, data.r_path, id];
        await executeQuery(query, values);
    } catch (error) {
        logger.error(`Error updating upload file: ${error}`);
        throw error;
    }
};

export const softDeleteUploadFile = async (id: number): Promise<void> => {
    try {
        const query = `UPDATE up SET IS_DELETE = 1 WHERE UPLOAD_ID = ?`;
        await executeQuery(query, [id]);
    } catch (error) {
        logger.error(`Error soft deleting upload data: ${error}`);
        throw error;
    }
};

export const getUploadFileCount = async (): Promise<number> => {
    try {
        const result = await executeQuery('SELECT COUNT(*) as count FROM up WHERE IS_DELETE = 0', []);
        return result[0].count;
    } catch (error) {
        logger.error(`Error fetching upload file count: ${error}`);
        throw error;
    }
};