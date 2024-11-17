
import { logger } from "../../logger/Logger";

import { Request, Response } from "express";
import { upload } from "../../config/Multer";
import { createUploadData, getAllUploadData, getUploadDataById, softDeleteUploadData, updateUploadData } from "../../services/admin/dashboard-upload.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
export class DashboardUpload {


    static async addUploadData(req: Request, res: Response, next) {
        try {
            await new Promise<void>((resolve, reject) => {
                upload.single('upload_profile')(req, res, (err: any) => {
                    if (err) {
                        logger.error(err);
                        reject(_400(res, err?.message || "File is required"));
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
                name: req?.body?.name,
                r_path: req?.body?.fileDestination + '/' + req?.body?.newFileName,

            };

            await createUploadData(uploadData);
            return _201(res, "Upload Data created successfully");
        } catch (error) {
            logger.error("addUploadData Error:: ", error?.message);
            next(error);
            //return _400(res, "Error while uploading file");
        }
    }


    static async updateUploadDataInfo(req: Request, res: Response) {
        try {

            await new Promise<void>((resolve, reject) => {
                upload.single('upload_profile')(req, res, (err: any) => {
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
                return _400(res, "Upload Data ID is required");
            }
            let isExists = await getUploadDataById(uploadId);
            if (!isExists) {
                return _404(res, "Upload Data Details not found.");
            }


            // if (!req?.files) {

            //     return _400(res, "File is required");
            // }


            const uploadData = {
                ...req.body,
                name: req?.body?.name,
                r_path: req?.body?.fileDestination + '/' + req?.body?.newFileName,

            };

            const result = await updateUploadData(uploadId, uploadData);
            return _200(res, "Upload Data updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }

    }

    static async getUploadData(req: Request, res: Response) {
        try {
            let response = []
            const { id } = req.params;
            if (!id) {
                return _400(res, "Upload Data ID is required");
            }
            const result = await getUploadDataById(Number(id));
            if (result) {
                response['data'] = result;
                return _200(res, "Upload Data retrieved successfully", response);
            } else {
                return _404(res, "Upload Data not found");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllUploadData(req: Request, res: Response) {
        try {
            let response: { data?: any[], totalRecords?: number } = {};
            const { page_number, search_text } = req.body;

            const result: { data: any[], totalRecords: number } = await getAllUploadData({ page_number: Number(page_number), searchText: search_text as string });
            if (Object.keys(result).length === 0) {
                return _404(res, "Upload Data not found");
            }

            // response['totalRecords'] = await getUploadDataCount();
            response['data'] = result.data;
            response['totalRecords'] = result?.totalRecords || 0;
            return _200(res, "Upload Data list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async deleteUploadData(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Upload Data ID is required");
            }
            const result = await getUploadDataById(Number(id));
            if (!result) {
                return _404(res, "Upload Data not found");
            }
            await softDeleteUploadData(Number(id));
            return _200(res, "Upload Data deleted successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
}





