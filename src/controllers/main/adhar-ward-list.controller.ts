import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { getEntriesDetails } from "../../services/main/customer.service";
import { getAdharNoWardWise, get_ward_number } from "../../services/main/ward-wise-adhar-list";

// फेरफार यादी (Ferfar Yadi) Module API     
export class AdharWardList {
   static async get_adhar_list(req: Request, res: Response) {
        try {
            const ward_number = Number(req.params.ward_no);
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const entriesParam = {
                'district_id': Number(decoded_user['DISTRICT_ID']),
                'taluka_id': Number(decoded_user['TALUKA_ID']),
                'panchayat_id': Number(decoded_user['PANCHAYAT_ID']),
                'gatgrampanchayat_id': Number(decoded_user['GATGRAMPANCHAYAT_id']),
                'user_id': Number(decoded_user['userId'])
            }
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            const adharList: any = await getAdharNoWardWise(Number(ward_number), Number(decoded_user['userId']));
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                adharListRs3: adharList
            }
            return _200(res, "Ward number wise adhar list fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async get_ward_number_by_user_id(req: Request, res: Response) {
        try{
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const ward_list: any = await get_ward_number(Number(decoded_user['userId']));

            const all_data = {
                ward_number_list: ward_list
            }
            return _200(res, "Ward list fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}
