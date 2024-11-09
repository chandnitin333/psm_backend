
import { logger } from "../../logger/Logger";

import { Request, Response } from "express";
import { createMilkat, getMilkatById, getMilkatList, softDeleteMilkat, updateMilkat } from "../../services/admin/milkat.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

export class Milkat {
    // add milkat , Update milkat, getMilkatList with search by name,get milkat by id
    static async addMilkat(req: Request, res: Response) {
        try {
            await createMilkat(req.body);
            return _201(res, "Milkat created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateMilkatInfo(req: Request, res: Response) {
        try {
            const { mikat_id } = req.body;

            if (!mikat_id) {
                return _400(res, "Milkat ID is required");
            }
            let isExists = await getMilkatById(mikat_id);
            if (!isExists) {
                return _404(res, "Milkat Details not found.");
            }

            const result = await updateMilkat(req.body);
            return _200(res, "Milkat updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllMilkat(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getMilkatList(Number(page_number - 1), search_text as string);
            response['totalRecords'] = result?.total_count ?? 0;
            response['data'] = result?.data;
            return _200(res, "Milkat list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getMilkat(req: Request, res: Response) {
        try {
            let response = []
            const { id } = req.params;
            if (!id) {
                return _400(res, "Milkat ID is required");
            }
            const result = await getMilkatById(Number(id));
            if (!result) {
                return _404(res, "Milkat not found");
            }
            response['data'] = result;
            return _200(res, "Fetch milkat successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteMilkat = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Milkat ID is required");
            }
            const result = await getMilkatById(Number(id));
            if (!result) {
                return _404(res, "Milkat not found");
            }
            let response: any = await softDeleteMilkat(id);
            if (response) {
                return _200(res, "Milkat deleted successfully");
            } else {
                return _400(res, "Milkat not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





