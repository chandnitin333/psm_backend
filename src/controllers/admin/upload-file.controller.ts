
import { logger } from "../../logger/Logger";

import { Request, Response } from "express";
import { upload } from "../../config/Multer";
import { createUploadData, getAllUploadData, getUploadDataById, getUploadDataCount, softDeleteUploadData, updateUploadData } from "../../services/admin/dashboard-upload.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createUploadFile, getUploadFileById, getUploadFileCount, softDeleteUploadFile, updateUploadFile } from "../../services/admin/upload-file.service";
export class UploadFile {

    static async addUploadFile(req: Request, res: Response) {
        try {
            await new Promise<void>((resolve, reject) => {
                upload.single('upload_file')(req, res, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(_400(res, err.message));
                    } else {
                        resolve();
                    }
                });
            });

            if (!req?.files) {
                return _400(res, "File is required");
            }
            const uploadData = {
                ...req.body,
                name: req?.body?.file_name,
                r_path: req?.body?.fileDestination+'/'+req?.body?.newFileName,

            };

            await createUploadFile(uploadData);
            return _201(res, "Upload File created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


    static async updateUploadDataInfo(req: Request, res: Response) {
            try {
            
                await new Promise<void>((resolve, reject) => {
                    upload.single('upload_file')(req, res, (err: any) => {
                        if (err) {
                            logger.error(err);
                            reject(_400(res, err.message));
                        } else {

                            resolve();
                        }
                    });
                });

                const uploadId = Number(req.params.id);
               
                if (!uploadId) {
                    return _400(res, "Upload File ID is required");
                }
                let isExists = await getUploadFileById(uploadId);
                if (!isExists) {
                    return _404(res, "Upload File Details not found.");
                }
            
                if (!req?.files) {
                    return _400(res, "File is required");
                }


                const uploadData = {
                    ...req.body,
                    name: req?.body?.file_name,
                    r_path: req?.body?.fileDestination+'/'+req?.body?.newFileName,

                };

                const result = await updateUploadFile(uploadId, uploadData);
                return _200(res, "Upload File updated successfully", result);
            } catch (error) {
                logger.error(error);
                return _400(res, error.message);
            }
       
    }

    static async getUploadFile(req: Request, res: Response) {
        try {
            let response = []
            const { id } = req.params;
            if (!id) {
                return _400(res, "Upload File ID is required");
            }
            const result = await getUploadFileById(Number(id));
            if(result){
                response['data'] = result;
                return _200(res, "Upload File retrieved successfully", response);
            }else{
                return _404(res, "Upload File not found");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllUploadFile(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number } = req.body;

            const result:any[] = await getAllUploadData(Number(page_number));
            if(result.length === 0){
                return _404(res, "Upload File not found");
            }

            response['totalRecords'] = await getUploadFileCount();
            response['data'] = result;
            return _200(res, "Upload file list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async deleteUploadFile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Upload file ID is required");
            }
            const result = await getUploadFileById(Number(id));
            if (!result) {
                return _404(res, "Upload file not found");
            }
            await softDeleteUploadFile(Number(id));
            return _200(res, "Upload file deleted successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
}





