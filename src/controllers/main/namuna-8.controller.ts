import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8, getEntriesDetails, getRecordBasedOnStartandEnd, getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails } from "../../services/main/customer.service";
import { get_ward_number } from "../../services/main/ward-wise-adhar-list";
   
export class Namuna8Controller {
   static async get_namuna_8_anukramnika(req: Request, res: Response) {
        try {
            // console.log("request body", req.body);
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            const new_user_id = null
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
            const rs3Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, new_user_id);
           
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                rs3: rs3Data
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async get_namuna_8_vard_new(req: Request, res: Response) {
        try{
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
            const rs3Data = await getUserDataForAdhikrutGharkul(Number(decoded_user['userId']), ward_number, start, end);
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
                rs3: updatedRs3
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
            const taxlandDataRs3 = await getUserDataForGharKar(Number(decoded_user['userId']), ward_number, start, end);
            const updatedRs3: any[] = [];
            if (taxlandDataRs3) {
                for (const item of taxlandDataRs3) {
                    // const newUserDataRs3 = await getUserDataForRs3(Number(decoded_user['userId']),item.NEWUSER_ID)
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    const taxPayerRS8 = await getTaxPayerDetails(Number(decoded_user['userId']), item.NEWUSER_ID) || [];
                    updatedRs3.push({ ...item,taxationLandRS4,constructionTaxRS5,taxPayerRS8 });
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

    static async get_namuna_8_1_single_vard(req: Request, res: Response) {
        try{
            console.log("request body", req.body);
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            const new_user_id = req.body.new_user_id || null;
            // const fromYear= req.body.from_year;
            // const to_year = req.body.to_year;
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
            const rs3Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, new_user_id);
            let yearRS42 = null;
            if(new_user_id != null || new_user_id != undefined){
                yearRS42 = await getYearByYearId(rs3Data[0].YEARS_ID);
            }else{
                yearRS42 = await getYearByYearId(year);
            }
            const updatedRs3: any[] = [];
            if (rs3Data) {
                for (const item of rs3Data) {
                    const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const constructionTaxRS5 = await getConstructionTaxDetailsForNamuna8(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    const taxPayerRS6 = await getTaxPayerDetailsForNamuna8(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    updatedRs3.push({ ...item,taxationLandRS4,constructionTaxRS5,taxPayerRS6 });
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs42: yearRS42,
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
