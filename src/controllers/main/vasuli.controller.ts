import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { _200, _201, _400 } from "../../utils/ApiResponse";

import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { deleteCustomerVasuli, getVasuliCustomerById, saveCustomerVasuli, searchCustomerVasuli, updateVasuliCustomerById } from "../../services/main/vasuli.service";


export class vasuliController {
    static async searchVasuliCustomer(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let user_id: number = Number(decoded_user['userId']);
            // let user_id = 1009; // For testing purposes, replace with actual user ID from decoded token

            const taxData: any = await searchCustomerVasuli(Number(decoded_user['userId']), req.body,page_number);
            return _200(res, "मालमत्ता धारकाची यादी  fetched successfully", taxData);
        } catch (error) {
            logger.error("Error fetching मालमत्ता धारकाची यादी ", error);
            return _400(res, "Error fetching मालमत्ता धारकाची यादी ");
        }
    }

    static savecustonerVasuli = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const details: any = await saveCustomerVasuli(req.body);
            if (details.status === 200){
                return _201(res, details.message);
            }else if( details.status === 400){
                return _400(res, details.message);
            }
        } catch (error) {
            logger.error("Error savecustonerVasuli ::", error);
            return _400(res, "Error savecustonerVasuli");
        }
    }

    static async getCustomerVasuliById( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data: any = await getVasuliCustomerById(id);
            return _200(res, "Customer Vasuli fetch successfully", { data: data });
        } catch (error) {
            logger.error("Error fetching getCustomerVasuliById", error);
            return _400(res, "Error fetching getCustomerVasuliById");
        }
    }
    static async getCustomerVasuliUpdateById( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data: any = await updateVasuliCustomerById(id, req.body);
            if(data.status === 200) {
                return _200(res, data.message);
            }
        } catch (error) {
            logger.error("Error fetching getCustomerVasuliById", error);
            return _400(res, "Error fetching getCustomerVasuliById");
        }
    }

     static async getCustomerVasuliDeleteById( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data: any = await deleteCustomerVasuli(id);
            return _200(res, data.message);
        } catch (error) {
            logger.error("Error fetching getCustomerVasuliById", error);
            return _400(res, "Error fetching getCustomerVasuliById");
        }
    }
}