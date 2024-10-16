
import { logger } from "../../logger/Logger";

import { Request, response, Response } from "express";

import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createMilkatVapar, getMilkatVaparById, getMilkatVaparList, getTotalMilkatVaparCount, softDeleteMilkatVapar, updateMilkatVapar } from "../../services/admin/milkat-vapar.service";

export class MilkatVapar {
    // add milkat , Update milkat, getMilkatList with search by name,get milkat by id
    static async addMilkatVapar(req: Request, res: Response) {
        try {
            await createMilkatVapar(req.body);
            return _201(res, "Milkat Vapar created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateMilkatVaparInfo(req: Request, res: Response) {
        try {
            const { vapar_id } = req.body;

            if (!vapar_id) {
                return _400(res, "Milkat Vapar ID is required");
            }
            let isExists = await getMilkatVaparById(vapar_id);
            if (!isExists) {
                return _404(res, "Milkat Vapar Details not found.");
            }

            const result = await updateMilkatVapar(req.body);
            return _200(res, "Milkat Vapar updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllMilkatVaper(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getMilkatVaparList(Number(page_number - 1), search_text as string);
            response['totalRecords'] = await getTotalMilkatVaparCount();
            response['data'] = result;
            return _200(res, "Milkat Vapar list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getMilkatVapar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Milkat Vapar ID is required");
            }
            const result = await getMilkatVaparById(Number(id));
            if (!result) {
                return _404(res, "Milkat Vapar not found");
            }
            response['data'] = result;
            return _200(res,"Fetch milkat vapar, result",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteMilkatVapar = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Milkat Vapar ID is required");
            }
            const result = await getMilkatVaparById(Number(id));
            if (!result) {
                return _404(res, "Milkat Vapar not found");
            }
            let response: any = await softDeleteMilkatVapar(id);
            if (response) {
                return _200(res, "Milkat Vapar deleted successfully");
            } else {
                return _400(res, "Milkat Vapar not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





