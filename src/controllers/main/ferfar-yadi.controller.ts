import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import { addNewFerfarYadiFormInfo, createUploadFerFarPDFData, geFerFarYadiList, getAnnuKramank, getCustomerByAnuId_wardNo, getFerFarYadiDetailById, getFerfarNamunaYadiDDL, getPDFFerfarYadi, getPanchayatIdById, getYearList, searchFerFarYadi, softDeleteFerfarYadi, softDeleteFerfarYadiPDF, updateFerfarYadi } from "../../services/main/ferfar-yadi.service";
import { _200, _201, _400 } from "../../utils/ApiResponse";
import { upload } from "../../config/Multer";


// फेरफार यादी (Ferfar Yadi) Module API     
export class FerFarYadi {
   static async getYearList(req: Request, res: Response) {
        try {
            const data: any = await getYearList();
            return _200(res, "From years list fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching From years list", error);
            return _400(res, "Error fetching From years list");
        }
   }

   static async getAnnuKramankFerfarYadi(req: Request, res: Response) {
       

        try {
            const anu_details: any = await getAnnuKramank(req.body);
            return _201(res, "Annu Kramank fetch successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }

    static async createNewFerfarYadiInfo(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            if (req.body.date) {
                req.body.date = new Date(req.body.date).toLocaleDateString('en-GB');
            }
            const member: any = await addNewFerfarYadiFormInfo(req.body, Number(decoded_user['userId']));
            return _201(res, "Successfully added new ferfar yadi in malmatta ferfar form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta ferfar form", error);
            return _400(res, "Error creating new customer in malmatta ferfar form");
        }
    }

    static async searchFerfarYadi(req: Request, res: Response) {
        try {
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const ferfaryadiData = await searchFerFarYadi(Number(decoded_user['userId']), req.body,page_number);
            return _200(res, "Ferfar Yadi details fetched successfully", ferfaryadiData);
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }
    static async getFerfarYadiList(req: Request, res: Response) {
        try {
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let search: string = req.body.search_text ? req.body.search_text : "";
            let user_id: number = req.body.user_id ? Number(req.body.user_id) : 0;
            if(user_id == 0) {
                return _400(res, "Invalid or missing User ID");
            }
            console.log("console", page_number, search, user_id)
            const data: any = await geFerFarYadiList(page_number, search, user_id);
            return _200(res, "Ferfar Yadi list fetched successfully", { status: 200, data: data.data, total_count: data.total_count });
        } catch (error) {
            logger.error("Error fetching getFerfarYadiList", error);
            return _400(res, "Error fetching ferfar yadi list");
        }
    }

    static async getFerfarDetailById(req: Request, res: Response) {
        try {
            const ferfar_id: number = Number(req.params.ferfar_id);
            if (!ferfar_id) {
                return _400(res, "Invalid or missing Ferfar ID");
            }
            const ferfarDetail: any = await getFerFarYadiDetailById(ferfar_id);
            return _200(res, "Ferfar detail fetched successfully", { status: 200, data: ferfarDetail });
        } catch (error) {
            logger.error("Error fetching ferfar detail", error);
            return _400(res, "Error fetching ferfar detail");
        }
    }

    static async updateFerfarYadi(req: Request, res: Response) {
        try {
            const ferfar_id: number = Number(req.params.ferfar_id);
            if (!ferfar_id) {
                return _400(res, "Invalid or missing Ferfar ID");
            }
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            if (req.body.date) {
                req.body.date = new Date(req.body.date).toLocaleDateString('en-GB');
            }
            const updatedData: any = await updateFerfarYadi(ferfar_id, req.body, Number(decoded_user['userId']));
            return _200(res, "Ferfar Yadi updated successfully");
        } catch (error) {
            logger.error("Error updating ferfar yadi", error);
            return _400(res, "Error updating ferfar yadi");
        }
    }

    static async deleteFerfarYadi(req: Request, res: Response) {
       try {
           const ferfar_id: number = Number(req.params.ferfar_id);
           if (!ferfar_id) {
               return _400(res, "Invalid or missing Ferfar ID");
           }
           await softDeleteFerfarYadi(ferfar_id);
           return _200(res, "Ferfar Yadi deleted successfully");
       } catch (error) {
           logger.error("Error deleting ferfar yadi", error);
           return _400(res, "Error deleting ferfar yadi");
       }
   }    
    
   static async pdfFerfarYadi(req: Request, res: Response) {
         try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let ferfar_id = Number(req.body.ferfar_id);
            let user_id = Number(decoded_user['userId']);
            if(user_id == 0) {
                return _400(res, "Invalid or missing User ID");
            }
            const data: any = await getPDFFerfarYadi(page_number,ferfar_id, user_id);
            return _200(res, "Ferfar Yadi PDF list fetched successfully", data);
        } catch (error) {
            logger.error("Error fetching pdfFerfarYadi", error);
            return _400(res, "Error fetching ferfar yadi pdf list");
        }
   }

   static async getFerfarNamunaYadiList(req: Request, res: Response) {
        try {
            const ferfarDetail: any = await getFerfarNamunaYadiDDL();
            return _200(res, "Ferfar namuna yadi list detail fetched successfully", { status: 200, data: ferfarDetail });
        } catch (error) {
            logger.error("Error fetching ferfar detail", error);
            return _400(res, "Error fetching ferfar detail");
        }
    }

    static async getPanchayatListOnPanchayatId(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            let panchayat_id = Number(decoded_user['PANCHAYAT_ID']);
            const panchayatDetails: any = await getPanchayatIdById(panchayat_id);
            return _200(res, "Panchayat list detail fetched successfully", { status: 200, data: panchayatDetails });
        } catch (error) {
            logger.error("Error fetching panchayat detail", error);
            return _400(res, "Error fetching panchayat detail");
        }
    }

    static async deleteFerfarYadiPDF(req: Request, res: Response) {
       try {
           const pdf_id: number = Number(req.params.pdf_id);
           if (!pdf_id) {
               return _400(res, "Invalid or missing Ferfar PDF ID");
           }
           await softDeleteFerfarYadiPDF(pdf_id);
           return _200(res, "Ferfar PDF Yadi deleted successfully");
       } catch (error) {
           logger.error("Error deleting ferfar pdf yadi", error);
           return _400(res, "Error deleting ferfar pdf yadi");
       }
   }

   static async addUploadPDFFerfarData(req: Request, res: Response, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            await new Promise<void>((resolve, reject) => {
                upload.single('upload_pdf')(req, res, (err: any) => {
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
            const ferfar_id = Number(req?.body?.ferfar_id);
            const ferfarDetail: any = await getFerFarYadiDetailById(ferfar_id);
            const new_user_id = ferfarDetail.NEWUSER_ID;
            // console.log("ferfarDetail===", ferfarDetail.NEWUSER_ID);
            const uploadData = {
                decoded_user,
                name: req?.body?.name,
                ferfar_id: Number(req?.body?.ferfar_id),
                new_user_id: new_user_id,
                r_path: req?.body?.fileDestination + '/' + req?.body?.newFileName,

            };
            // console.log("uploadData===", uploadData);
            await createUploadFerFarPDFData(uploadData);
            return _201(res, "Upload Data created successfully");
        } catch (error) {
            logger.error("addUploadData Error:: ", error?.message);
            next(error);
            //return _400(res, "Error while uploading file");
        }
    }
    static async getcustomerByAnuId_wardNo(req: Request, res: Response) {
       
        try {
            const details: any = await getCustomerByAnuId_wardNo(req.body);
            return _200(res, "Data fetch successfully", { status: 200, data: details });
        } catch (error) {
            logger.error("Error fetching getcustomerByAnuId_wardNo", error);
            return _400(res, "Error fetching getcustomerByAnuId_wardNo");
        }
    }
}

