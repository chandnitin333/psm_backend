
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createPrakar, getPrakarById, getPrakarList, getTotalPrakarCount, softDeletePrakar, updatePrakar } from "../../services/admin/prakar.service";

export class Prakar {
    static async addPrakar(req: Request, res: Response) {
        try {
            await createPrakar(req.body);
            return _201(res, "Prakar created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updatePrakarInfo(req: Request, res: Response) {
        try {
            const { prakar_id } = req.body;

            if (!prakar_id) {
                return _400(res, "Prakar ID is required");
            }
            let isExists = await getPrakarById(prakar_id);
            if (!isExists) {
                return _404(res, "Prakar Details not found.");
            }
            const result = await updatePrakar(req.body);
            return _200(res, "Prakar updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllPrakar(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getPrakarList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalPrakarCount(search_text);
            }else{
                response['totalRecords'] = await getTotalPrakarCount();
            }
            
            response['data'] = result;
            return _200(res, "Prakar list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getPrakar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Prakar ID is required");
            }
            const result = await getPrakarById(Number(id));
            if (!result) {
                return _404(res, "Prakar not found");
            }
            response['data'] = result;
            return _200(res,"Prakar data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deletePrakar = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Prakar ID is required");
            }
            const result = await getPrakarById(Number(id));
            if (!result) {
                return _404(res, "Prakar not found");
            }
            let response: any = await softDeletePrakar(id);
            if (response) {
                return _200(res, "Prakar deleted successfully");
            } else {
                return _400(res, "Prakar not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





