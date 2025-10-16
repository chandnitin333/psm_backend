import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { fetchAarogya_aarogyaCount, fetchBhumu_bhumiCount, fetchCurrentYear, fetchManora_Count, fetchSafai_SafaiCount, fetchSamanya_Pani_kar_count, fetchVanijya_Count, fetchViseshPaniKar_Count, fetchViz_VizCount, getAarogyaRakshanKar, getAudhogikData, getAudhogik_from_newsevakar, getBhumi_deva_from_newsevakar, getBhumikar_bhumiCountandOther, getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8, getDataByUserIdAndVardNumber, getEntriesDetails, getImlakarAnukramnika, getImlakarNew, getNewUserSevakarDetails, getRecordBasedOnStartandEnd, getSafaeKar, getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, getTotalNewUserSevakar, getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails, searchMagnicheBillData } from "../../services/main/customer.service";
   
export class ImlakarController {
   static async get_imlakar_new(req: Request, res: Response) {
        try{
            console.log("request body", req.body);
            const ward_number = req.body.ward;
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
            const rs3Data = await getImlakarNew(Number(decoded_user['userId']), ward_number, start, end);
            const yearRS42 = await getYearByYearId(year);
            const updatedRs3: any[] = [];
            if (rs3Data) {
                for (const item of rs3Data) {
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const taxPayerRS6 = await getTaxPayerDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    updatedRs3.push({ ...item,taxationLandRS4,constructionTaxRS5,taxPayerRS6 });
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
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            const rs3Data = await getImlakarAnukramnika(Number(decoded_user['userId']), ward_number);
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