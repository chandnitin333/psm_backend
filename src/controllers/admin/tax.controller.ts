
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createTax, getTaxById, getTaxList, getTotalTaxCount, softDeleteTax, updateTax } from "../../services/admin/tax.service";

export class Tax {
    static async addTax(req: Request, res: Response) {
        try {
            await createTax(req.body);
            return _201(res, "Tax created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateTaxInfo(req: Request, res: Response) {
        try {
            const { tax_id } = req.body;
            if (!tax_id) {
                return _400(res, "Tax ID is required");
            }
            let isExists = await getTaxById(tax_id);
            if (!isExists) {
                return _404(res, "Tax details not found.");
            }
            const result = await updateTax(req.body);
            return _200(res, "Tax updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllTax(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getTaxList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalTaxCount(search_text);
            }else{
                response['totalRecords'] = await getTotalTaxCount();
            }
            
            response['data'] = result;
            return _200(res, "Tax list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getTax(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Tax ID is required");
            }
            const result = await getTaxById(Number(id));
            if (!result) {
                return _404(res, "Tax not found");
            }
            response['data'] = result;
            return _200(res,"Tax data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteTax = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Tax ID is required");
            }
            const result = await getTaxById(Number(id));
            if (!result) {
                return _404(res, "Tax not found");
            }
            let response: any = await softDeleteTax(id);
            if (response) {
                return _200(res, "Tax deleted successfully");
            } else {
                return _400(res, "Tax not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





