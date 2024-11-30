
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createMalmatta, getMalmattaById, getMalmattaListForDDL, getMalmattechaList, getTotalMalmattaCount, softDeleteMalmatta, updateMalmatta } from "../../services/admin/malmatta.service";

export class Malmatta {
    static async addMalmatta(req: Request, res: Response) {
        try {
            await createMalmatta(req.body);
            return _201(res, "Malmatta created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateMalmattaInfo(req: Request, res: Response) {
        try {
            const { id } = req.body;

            if (!id) {
                return _400(res, "Malmatta ID is required");
            }
            let isExists = await getMalmattaById(id);
            if (!isExists) {
                return _404(res, "Malmatta Details not found.");
            }
            const result = await updateMalmatta(req.body);
            return _200(res, "Malmatta updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllMalmatta(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getMalmattechaList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalMalmattaCount(search_text);
            }else{
                response['totalRecords'] = await getTotalMalmattaCount();
            }
            
            response['data'] = result;
            return _200(res, "Malmatta list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getMalmatta(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Malmatta ID is required");
            }
            const result = await getMalmattaById(Number(id));
            if (!result) {
                return _404(res, "Malmatta not found");
            }
            response['data'] = result;
            return _200(res,"Malmatta data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteMalmatta = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Malmatta ID is required");
            }
            const result = await getMalmattaById(Number(id));
            if (!result) {
                return _404(res, "Malmatta not found");
            }
            let response: any = await softDeleteMalmatta(id);
            if (response) {
                return _200(res, "Malmatta deleted successfully");
            } else {
                return _400(res, "Malmatta not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllMalmattaDDL(req: any, res: any, next: any) {
        let response = {};
        let params = [];
        // console.log("Test",params);
        getMalmattaListForDDL(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'Malmatta list found successfully', response)
            } else {
                _400(res, 'Malmatta list not found')
            }
        }).catch((error) => {

            logger.error("getAllMalmattaDDL :: ", error);
            _400(res, 'Malmatta list not found')
        });
    }

}





