import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import { getConstructionTaxDetails, getEntriesDetails, getImlakarAnukramnika, getImlakarNewDistinct, getTaxPayerDetails, getUserDataForRs3, getYearByYearId, gettaxationLandDetails } from "../../services/main/customer.service";
import { _200, _400 } from "../../utils/ApiResponse";
   
export class ImlakarController {
   static async get_imlakar_new(req: Request, res: Response) {
        try{
            
            const ward_number = req.body.ward_no;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            const fromYear= req.body.from_year;
            const to_year = req.body.to_year;
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
            const rs3Data = await getImlakarNewDistinct(Number(decoded_user['userId']), ward_number, start, end);
            // console.log("-----",rs3Data);
            const yearRS42 = await getYearByYearId(year);
            const updatedRs3: any[] = [];
            if (rs3Data) {
                for (const item of rs3Data) {
                    // console.log('Processing item NEWUSER_ID:', item.NEWUSER_ID);
                    const rs3Details = await getUserDataForRs3(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || {};
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const taxPayerRS6 = await getTaxPayerDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    updatedRs3.push({ ...item,rs3Details,taxationLandRS4,constructionTaxRS5,taxPayerRS6 });
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs42: yearRS42,
                rs3: updatedRs3,
                from_to_year: {from_year: fromYear, to_year: to_year}
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async get_imlakar_anukramnika(req: Request, res: Response) {
        try{
            const ward_number = req.body.ward;
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
            // console.log("body ward------", req.body);
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            const rs3Data = await getImlakarAnukramnika(Number(decoded_user['userId']), Number(ward_number));
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                rs3: rs3Data
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}


// 