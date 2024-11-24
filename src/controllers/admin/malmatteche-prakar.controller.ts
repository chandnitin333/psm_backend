
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createMalmattechePrakar, getMalmattechePrakarById, getMalmattechePrakarDDL, getMalmattechePrakarList, getTotalMalmattechePrakarCount, softDeleteMalmattechePrakar, updateMalmattechePrakar } from "../../services/admin/malmatteche-prakar.service";

export class MalmattechePrakar {
    static async addMalmattechePrakar(req: Request, res: Response) {
        try {
            await createMalmattechePrakar(req.body);
            return _201(res, "Malmatteche Prakar created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateMalmattechePrakarInfo(req: Request, res: Response) {
        try {
            const { prakar_id } = req.body;

            if (!prakar_id) {
                return _400(res, "Malmatteche Prakar ID is required");
            }
            let isExists = await getMalmattechePrakarById(prakar_id);
            if (!isExists) {
                return _404(res, "Malmatteche Prakar Details not found.");
            }
            const result = await updateMalmattechePrakar(req.body);
            return _200(res, "Malmatteche Prakar updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllMalmattechePrakar(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getMalmattechePrakarList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalMalmattechePrakarCount(search_text);
            }else{
                response['totalRecords'] = await getTotalMalmattechePrakarCount();
            }
            
            response['data'] = result;
            return _200(res, "Malmatteche Prakar list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getMalmattechePrakar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Malmatteche Prakar ID is required");
            }
            const result = await getMalmattechePrakarById(Number(id));
            if (!result) {
                return _404(res, "Malmatteche Prakar not found");
            }
            response['data'] = result;
            return _200(res,"Malmatteche Prakar data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteMalmattechePrakar = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Malmatteche Prakar ID is required");
            }
            const result = await getMalmattechePrakarById(Number(id));
            if (!result) {
                return _404(res, "Malmatteche Prakar not found");
            }
            let response: any = await softDeleteMalmattechePrakar(id);
            if (response) {
                return _200(res, "Malmatteche Prakar deleted successfully");
            } else {
                return _400(res, "Malmatteche Prakar not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getAllMalmattechePrakarDDL(req: any, res: any, next: any) {
        let response = {};
        let params = [];
        // console.log("Test",params);
        getMalmattechePrakarDDL(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'Malmatta Prakar list found successfully', response)
            } else {
                _400(res, 'Malmatta Prakar list not found')
            }
        }).catch((error) => {

            logger.error("getMalmattechePrakarDDL :: ", error);
            _400(res, 'Malmatta Prakar list not found')
        });
    }

}





