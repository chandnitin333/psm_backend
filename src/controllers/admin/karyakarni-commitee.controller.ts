
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createKaryaKarniCommitee, getDesignationListForDDL, getKaryaKarniCommiteeById, getKaryaKarniCommiteeList, getTotalKaryaKarniCommiteeCount, softDeleteKaryaKarniCommitee, updateKaryaKarniCommitee } from "../../services/admin/karyakarni-commitee.service";

export class KaryaKarniCommitee {
    static async addKaryaKarniCommitee(req: Request, res: Response) {
        try {
            await createKaryaKarniCommitee(req.body);
            return _201(res, "Karyakarni Committee created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateKaryaKarniCommiteeInfo(req: Request, res: Response) {
        try {
            const { id } = req.body;

            if (!id) {
                return _400(res, "Karyakarni Committee ID is required");
            }
            let isExists = await getKaryaKarniCommiteeById(id);
            if (!isExists) {
                return _404(res, "Karyakarni Committee Details not found.");
            }
            const result = await updateKaryaKarniCommitee(req.body);
            return _200(res, "Karyakarni Committee updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllKaryaKarniCommitee(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getKaryaKarniCommiteeList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalKaryaKarniCommiteeCount(search_text);
            }else{
                response['totalRecords'] = await getTotalKaryaKarniCommiteeCount();
            }
            
            response['data'] = result;
            return _200(res, "Karyakarni Committee list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getKaryaKarniCommitee(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Karyakarni Committee ID is required");
            }
            const result = await getKaryaKarniCommiteeById(Number(id));
            if (!result) {
                return _404(res, "Karyakarni Committee not found");
            }
            response['data'] = result;
            return _200(res,"Karyakarni Committee data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteKaryaKarniCommitee = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Karyakarni Committee ID is required");
            }
            const result = await getKaryaKarniCommiteeById(Number(id));
            if (!result) {
                return _404(res, "Karyakarni Committee not found");
            }
            let response: any = await softDeleteKaryaKarniCommitee(id);
            if (response) {
                return _200(res, "Karyakarni Committee deleted successfully");
            } else {
                return _400(res, "Karyakarni Committee not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllDesignationDDL(req: any, res: any, next: any) {
        let response = {};
        let params = [];
        // console.log("Test",params);
        getDesignationListForDDL(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'Designation list found successfully', response)
            } else {
                _400(res, 'Designation list not found')
            }
        }).catch((error) => {

            logger.error("getAllDesignationDDL :: ", error);
            _400(res, 'Designation list not found')
        });
    }

}





