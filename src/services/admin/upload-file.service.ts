import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

interface UploadFile {
    UPLOAD_ID: number;
    FILE_NAME: string;
    R_PATH: string;
    totalRecords?: number;
}

interface UploadFileResponse {
    data: UploadFile[];
    totalRecords: number;
}

export const getAllUploadFile = async (params: any): Promise<any> => {
    try {
        
        const { page_number, searchText } = params;

        const offset = (page_number - 1) * PAGINATION.LIMIT;

        let query = `SELECT * FROM up WHERE DELETED_AT IS NULL`;
        const queryParams: any[] = [];

        if (searchText) {
            query += ` AND FILE_NAME LIKE ?`;
            queryParams.push(`%${searchText}%`);
        }
        let totalCount = await getUploadFileCount(query, queryParams);
        query += ` ORDER BY UPLOAD_ID DESC LIMIT ? OFFSET ?`;
        queryParams.push(PAGINATION.LIMIT, offset);

        const result = await executeQuery(query, queryParams) as any[];

        return { 'data': result, 'totalRecords': totalCount };

    } catch (error) {
        console.log("error===", error);
        logger.error(`Error fetching upload file : ${error}`);
        throw error;
    }
};

export const getUploadFileById = async (id: number): Promise<UploadFile | null> => {
    try {
        const query = `SELECT * FROM up WHERE UPLOAD_ID = ? AND DELETED_AT IS NULL`;
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

        if (!name || !r_path) {
            throw new Error("Missing required fields");
        }
        const query = `INSERT INTO up (FILE_NAME, R_PATH) VALUES (?, ?)`;
        const values = [name, r_path, Date.now()];
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
        const query = `UPDATE up SET DELETED_AT = NOW()  WHERE UPLOAD_ID = ?`;
        await executeQuery(query, [id]);
    } catch (error) {
        logger.error(`Error soft deleting upload data: ${error}`);
        throw error;
    }
};

export const getUploadFileCount = async (sql: string, params: any): Promise<number> => {
    try {
        const result = await executeQuery(sql, params);
        return Object.keys(result).length ?? 0;
    } catch (error) {
        logger.error(`Error fetching upload file count: ${error}`);
        throw error;
    }
};