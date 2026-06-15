import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { getConstructionTaxDetails, getEntriesDetails, getRecordBasedOnStartandEnd, getTaxLandData, getTaxPayerDetails, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails } from "../../services/main/customer.service";
import { get_ward_number } from "../../services/main/ward-wise-adhar-list";

/** Run an async mapper over rows in bounded-parallel chunks instead of
 *  one-by-one. Same per-row queries/data, order preserved — far faster. */
async function mapChunked<T, R>(rows: T[], fn: (item: T) => Promise<R>, size = 20): Promise<R[]> {
    const out: R[] = [];
    for (let i = 0; i < rows.length; i += size) {
        const built = await Promise.all(rows.slice(i, i + size).map(fn));
        out.push(...built);
    }
    return out;
}

export class MalamattaGrahakYadiList {
   static async get_malmatta_darkachi_yadi_list(req: Request, res: Response) {
        try {
            // console.log("request body", req.body);
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            const new_user_id = null;
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
            const rs3Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, new_user_id);
            const uidDK = Number(decoded_user['userId']);
            const updatedRs3 = await mapChunked(rs3Data || [], async (item: any) => {
                const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                    gettaxationLandDetails(uidDK, item.NEWUSER_ID).then(r => r || []),
                    getConstructionTaxDetails(uidDK, item.NEWUSER_ID).then(r => r || []),
                    getTaxPayerDetails(uidDK, item.NEWUSER_ID).then(r => r || []),
                ]);
                return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
            });
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
            const uidKB = Number(decoded_user['userId']);
            const updatedRs6 = await mapChunked(taxlandDataRs6 || [], async (item: any) => {
                const [newUserDataRs3, taxationLandRS4, constructionTaxRS5, taxPayerRS8] = await Promise.all([
                    getUserDataForRs3(uidKB, item.newuser_id),
                    gettaxationLandDetails(uidKB, item.newuser_id).then(r => r || []),
                    getConstructionTaxDetails(uidKB, item.newuser_id).then(r => r || []),
                    getTaxPayerDetails(uidKB, item.newuser_id).then(r => r || []),
                ]);
                return { ...item, newUserDataRs3, taxationLandRS4, constructionTaxRS5, taxPayerRS8 };
            });
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
            const uidGK = Number(decoded_user['userId']);
            const updatedRs3 = await mapChunked(newuserDataRs3 || [], async (item: any) => {
                const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                    gettaxationLandDetails(uidGK, item.NEWUSER_ID).then(r => r || []),
                    getConstructionTaxDetails(uidGK, item.NEWUSER_ID).then(r => r || []),
                    getTaxPayerDetails(uidGK, item.NEWUSER_ID).then(r => r || []),
                ]);
                return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
            });
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
