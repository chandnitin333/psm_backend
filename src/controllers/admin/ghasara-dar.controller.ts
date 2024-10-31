import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createMilkatVapar, getMilkatVaparById, getMilkatVaparList, getTotalMilkatVaparCount, softDeleteMilkatVapar, updateMilkatVapar } from "../../services/admin/milkat-vapar.service";
import { createGhasaraDar, getGhasaraDarById, getGhasaraDarList, getTotalGhasaraDarCount, softDeleteGhasaraDar, updateGhasaraDar } from "../../services/admin/ghasara-dar.service";

export class GhasaraDar {
    // add milkat , Update milkat, getMilkatList with search by name,get milkat by id
    static async addGhasaraDar(req: Request, res: Response) {
        try {
            await createGhasaraDar(req.body);
            return _201(res, "Ghasara Dar created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateGhasaraDarInfo(req: Request, res: Response) {
        try {
            const { vapar_id } = req.body;

            if (!vapar_id) {
                return _400(res, "Ghasara Dar ID is required");
            }
            let isExists = await getGhasaraDarById(ghasara_id);
            if (!isExists) {
                return _404(res, "Ghasara Dar Details not found.");
            }
            const result = await updateGhasaraDar(req.body);
            return _200(res, "Ghasara Dar updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getAllGhasaraDar(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;
            const result = await getGhasaraDarList(Number(page_number - 1), search_text as string);
            response['totalRecords'] = await getTotalGhasaraDarCount();
            response['data'] = result;
            return _200(res, "Ghasara Dar list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getGhasaraDar(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Ghasara Dar ID is required");
            }
            const result = await getGhasaraDarById(Number(id));
            if (!result) {
                return _404(res, "Ghasara Dar not found");
            }
            response['data'] = result;
            return _200(res,"Fetch Ghasara Dar, result",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteGhasaraDar = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Ghasara Dar ID is required");
            }
            const result = await getGhasaraDarById(Number(id));
            if (!result) {
                return _404(res, "Ghasara Dar not found");
            }
            let response: any = await softDeleteGhasaraDar(id);
            if (response) {
                return _200(res, "Ghasara Dar deleted successfully");
            } else {
                return _400(res, "Ghasara Dar not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
}





