import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { _200, _201, _400 } from "../../utils/ApiResponse";

import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { getTaxGenerationData } from "../../services/admin/tax-generation-main-app.service";


export class taxGenerationController {
    static async getTaxGeneration(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let ward_no: string = req.body.ward_no ? req.body.ward_no : "";
            let from_year: string = req.body.from_year ? req.body.from_year : "";
            let to_year: string = req.body.to_year ? req.body.to_year : "";
            let user_id: number = Number(decoded_user['userId']);

            const taxData: any = await getTaxGenerationData(page_number,ward_no,from_year,to_year,user_id);
            return _200(res, "Tax generation data fetched successfully", taxData);
        } catch (error) {
            logger.error("Error fetching tax generation data", error);
            return _400(res, "Error fetching tax generation data");
        }
    }
}