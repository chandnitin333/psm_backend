import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createGhasaraDar, getGhasaraDarById, getGhasaraDarList, getTotalGhasaraDarCount, softDeleteGhasaraDar, updateGhasaraDar } from "../../services/admin/ghasara-dar.service";
import { createBharankDar, getBharankDarById, getBharankDarList, getTotalBharankDarCount, softDeleteBharankDar, updateBharankDar } from "../../services/admin/bharank-dar.service";

export class BharankDar {
    static async addBharankDar(req: Request, res: Response) {
        try {
            await createBharankDar(req.body);
            return _201(res, "Bharank Dar created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateBharankDarInfo(req: Request, res: Response) {
        try {
            const { bharank_id } = req.body;
            if (!bharank_id) {
                return _400(res, "Bharank Dar ID is required");
            }
            let isExists = await getBharankDarById(bharank_id);
            if (!isExists) {
                return _404(res, "Bharank Dar Details not found.");
            }
            const result = await updateBharankDar(req.body);
            return _200(res, "Bharank Dar updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getAllBharankDar(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;
            const result = await getBharankDarList(Number(page_number - 1), search_text as string);
             if(search_text){
                response['totalRecords'] = await getTotalBharankDarCount(search_text);
            }else{
                response['totalRecords'] = await getTotalBharankDarCount();
            }
            response['data'] = result;
            return _200(res, "Bharank Dar list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getBharankDar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Bharank Dar ID is required");
            }
            const result = await getBharankDarById(Number(id));
            if (!result) {
                return _404(res, "Bharank Dar not found");
            }
            response['data'] = result;
            return _200(res,"Fetch Bharank Dar, result",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteBharankDar = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Bharank Dar ID is required");
            }
            const result = await getBharankDarById(Number(id));
            if (!result) {
                return _404(res, "Bharank Dar not found");
            }
            let response: any = await softDeleteBharankDar(id);
            if (response) {
                return _200(res, "Bharank Dar deleted successfully");
            } else {
                return _400(res, "Bharank Dar not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
}





