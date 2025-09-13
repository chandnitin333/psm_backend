import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { getConstructionTaxDetails, getEntriesDetails, getRecordBasedOnStartandEnd, getTaxLandData, getTaxPayerDetails, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails } from "../../services/main/customer.service";
import { get_ward_number } from "../../services/main/ward-wise-adhar-list";
   
export class MalamattaGrahakYadiList {
   static async get_malmatta_darkachi_yadi_list(req: Request, res: Response) {
        try {
            // console.log("request body", req.body);
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
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
            const yearRS10 = await getYearByYearId(year);
            const rs3Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end);
            const updatedRs3: any[] = [];
            if (rs3Data) {
                for (const item of rs3Data) {
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const taxPayerRS6 = await getTaxPayerDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    updatedRs3.push({ ...item,taxationLandRS4,constructionTaxRS5,taxPayerRS6 });
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs10: yearRS10,
                rs3: updatedRs3
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async get_malmatta_grahak_yadi_khula_bhukhand(req: Request, res: Response) {
        try{
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
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
            const yearRS10 = await getYearByYearId(year);
            const taxlandDataRs6 = await getTaxLandData(Number(decoded_user['userId']), ward_number, start, end);
            const updatedRs6: any[] = [];
            if (taxlandDataRs6) {
                for (const item of taxlandDataRs6) {
                    const newUserDataRs3 = await getUserDataForRs3(Number(decoded_user['userId']),item.newuser_id)
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), item.newuser_id) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), item.newuser_id) || [];
                    const taxPayerRS8 = await getTaxPayerDetails(Number(decoded_user['userId']), item.newuser_id) || [];
                    updatedRs6.push({ ...item,newUserDataRs3,taxationLandRS4,constructionTaxRS5,taxPayerRS8 });
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs10: yearRS10,
                rs6: updatedRs6
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async get_malmatta_grahak_yadi_ghar_kar(req: Request, res: Response) {
        try{
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
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
            const yearRS10 = await getYearByYearId(year);
            const newuserDataRs3 = await getUserDataForGharKar(Number(decoded_user['userId']), ward_number, start, end);
            const updatedRs3: any[] = [];
            if (newuserDataRs3) {
                for (const item of newuserDataRs3) {
                    // const newUserDataRs3 = await getUserDataForRs3(Number(decoded_user['userId']),item.NEWUSER_ID)
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const taxPayerRS6 = await getTaxPayerDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    updatedRs3.push({ ...item,taxationLandRS4,constructionTaxRS5,taxPayerRS6 });
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs10: yearRS10,
                rs3: updatedRs3
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}
