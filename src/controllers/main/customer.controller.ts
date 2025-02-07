import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Utils } from "../../utils/util";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { addNewCustomerInNodniFormInfo, getAnnuKramank, getCustomerDetailsById, getMalmattaNotdniList, insertUpdateSillakJoda, softDeleteMalmattaNodniInfo, updateMalmattaNodniInfo } from "../../services/main/customer.service";


// मालमत्ता धारकाची यादी (Customer List) Module API
export class CustomerController {
    static async createCustomerInfo(req: Request, res: Response) {
        const validationError = Utils.validateRequestBody(req.body, ["annu_kramank","malmatta_no","ward_no","khate_dharkache_name","address"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const member: any = await addNewCustomerInNodniFormInfo(req.body);
            return _201(res, "Successfully added new customer in malmatta nodni form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta nodni form", error);
            return _400(res, "Error creating new customer in malmatta nodni form");
        }
    }

    static async getAnnuKramank(req: Request, res: Response) {
        //  console.log("console", req.body)
        const validationError = Utils.validateRequestBody(req.body, ["ward_no","user_id"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const anu_details: any = await getAnnuKramank(req.body);
            return _201(res, "Annu Kramank fetch successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }

    static async getCustomerById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing User ID");
            }
            const customers: any = await getCustomerDetailsById(Number(id));
            if (!customers) {
                return _404(res, "customer details not found");
            }
            return _200(res, "Customer details fetched successfully", { status: 200, data: customers });
        } catch (error) {
            logger.error("Error fetching customer details", error);
            return _400(res, "Error fetching customer details");
        }
    }

    static async getMalmattaNodniInfoList(req: Request, res: Response) {
        try {
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let search: string = req.body.search_text ? req.body.search_text : "";
            let user_id: number = req.body.user_id ? Number(req.body.user_id) : 0;
            if(user_id == 0) {
                return _400(res, "Invalid or missing User ID");
            }
            const data: any = await getMalmattaNotdniList(page_number, search, user_id);
            return _200(res, "Malmatta nodni list fetched successfully", { status: 200, data: data.data, total_count: data.total_count });
        } catch (error) {
            logger.error("Error fetching getMalmattaNodniInfoList", error);
            return _400(res, "Error fetching malmatta nodni list");
        }
    }

    static async createUpdateSillakJoda(req: Request, res: Response) {
        try {
            const member: any = await insertUpdateSillakJoda(req.body);
            console.log("console", member)
            return _201(res, "Successfully added new customer in malmatta nodni form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta nodni form", error);
            return _400(res, "Error creating new customer in malmatta nodni form");
        }
    }

    static async updateMalmattaNodniInfo(req: Request, res: Response) {
        try {
            const id = Number(req.body.new_user_id);
            if (!id) {
                return _400(res, "Invalid or missing NEW USER ID");
            }
            await updateMalmattaNodniInfo(req.body);

            return _200(res, "मालमत्ता धारकाची यादी updated successfully");
        } catch (error) {
            logger.error("Error updating मालमत्ता धारकाची यादी", error);
            return _400(res, "Error updating मालमत्ता धारकाची यादी");
        }
    }

    static async deleteMalmattaNodniInfo(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing मालमत्ता धारकाची यादी ID");
            }
            await softDeleteMalmattaNodniInfo(id);

            return _200(res, "मालमत्ता धारकाची यादी deleted successfully");
        } catch (error) {
            logger.error("Error deleting मालमत्ता धारकाची यादी", error);
            return _400(res, "Error deleting मालमत्ता धारकाची यादी");
        }
    }
}

