
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createOtherTax, getOtherTaxById, getOtherTaxList, getOtherTaxListByDistrict, getTotalOtherTaxCount, softDeleteOtherTax, updateOtherTax } from "../../services/admin/other-tax.service";

export class OtherTax {
    static async addOtherTax(req: Request, res: Response) {
        try {
            await createOtherTax(req.body);
            return _201(res, "Other Tax created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateOtherTaxInfo(req: Request, res: Response) {
        try {
            const { othertax_id } = req.body;
            if (!othertax_id) {
                return _400(res, "Other Tax ID is required");
            }
            let isExists = await getOtherTaxById(othertax_id);
            if (!isExists) {
                return _404(res, "Other Tax details not found.");
            }
            
            const result = await updateOtherTax(req.body);
            return _200(res, "Other Tax updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllOtherTax(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text,panchayat_id } = req.body;

            const result = await getOtherTaxList(Number(page_number - 1), search_text as string,panchayat_id as number);
            if(search_text){
                response['totalRecords'] = await getTotalOtherTaxCount(search_text);
            }else{
                response['totalRecords'] = await getTotalOtherTaxCount();
            }
            
            response['data'] = result;
            return _200(res, "Other Tax list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllOtherTaxListByDistrictWise(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text, district_id } = req.body;

            const result = await getOtherTaxListByDistrict(Number(page_number - 1), search_text as string, district_id as number);
            if(search_text){
                response['totalRecords'] = await getTotalOtherTaxCount(search_text);
            }else{
                response['totalRecords'] = await getTotalOtherTaxCount();
            }
            
            response['data'] = result;
            return _200(res, "Other Tax list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getOtherTax(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Other Tax ID is required");
            }
            const result = await getOtherTaxById(Number(id));
            if (!result) {
                return _404(res, "Other Tax not found");
            }
            response['data'] = result;
            return _200(res,"Other Tax data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteOtherTax = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Other Tax ID is required");
            }
            const result = await getOtherTaxById(Number(id));
            if (!result) {
                return _404(res, "Other Tax not found");
            }
            let response: any = await softDeleteOtherTax(id);
            if (response) {
                return _200(res, "Other Tax deleted successfully");
            } else {
                return _400(res, "Other Tax not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





