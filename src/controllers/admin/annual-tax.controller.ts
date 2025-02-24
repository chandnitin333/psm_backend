
import { Request, response, Response } from "express";
import { logger } from "../../logger/Logger";
import { createAnnualTax, getAnnualTaxByDistrictWithPagination, getAnnualTaxById, getAnnualTaxList, getDistrictList, getTotalAnnualTaxCount, softDeleteAnnualTax, updateAnnualTax } from "../../services/admin/annual-tax.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

export class AnnualTax {
    static async addAnnualTax(req: Request, res: Response) {
        try {
            await createAnnualTax(req.body);
            return _201(res, "Annual Tax created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateAnnualTaxInfo(req: Request, res: Response) {
        try {
            const { annualtax_id } = req.body;
            if (!annualtax_id) {
                return _400(res, "Annual Tax ID is required");
            }
            let isExists = await getAnnualTaxById(annualtax_id);
            if (!isExists) {
                return _404(res, "Annual Tax details not found.");
            }
            const result = await updateAnnualTax(req.body);
            return _200(res, "Annual Tax updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllAnnualTax(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getAnnualTaxList(Number(page_number - 1), search_text as string);


            if (search_text) {
                response['totalRecords'] = await getTotalAnnualTaxCount(search_text); // need to do later getting inproper counts
            } else {
                response['totalRecords'] = await getTotalAnnualTaxCount();
            }
            response['data'] = result;
            return _200(res, "Annual Tax list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


    static async getAllAnnualTaxByDistrict(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text, district_id } = req.body;

            const result = await getAnnualTaxByDistrictWithPagination(Number(district_id), Number(page_number - 1), search_text as string,);
            response['totalRecords'] = result?.total_count
            response['data'] = result?.data;
            return _200(res, "Annual Tax list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getDistrictData(req: Request, res: Response) {
        try {
            const result = await getDistrictList();
            response['data'] = result;
            return _200(res, "District list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }


    }
    static async getAnnualTax(req: Request, res: Response) {
        try {
             let response = [];
            const { id } = req.params;
            if (!id) {
                return _400(res, "Annual Tax ID is required");
            }
            const result = await getAnnualTaxById(Number(id));
            if (!result) {
                return _404(res, "Annual Tax not found");
            }
            response['data'] = result;
            return _200(res, "Annual Tax data fetch successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteAnnualTax = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Annual Tax ID is required");
            }
            let response1 = [];
            const result = await getAnnualTaxById(Number(id));
            console.log(result)
            if (!result) {
                return _404(res, "Annual Tax not found");
            }
             response1['data'] = result;
            let response: any = await softDeleteAnnualTax(id);
            if (response) {
                return _200(res, "Annual Tax deleted successfully", response1);
            } else {
                return _400(res, "Annual Tax not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





