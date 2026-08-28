import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { batchConstructionTaxDetails, batchConstructionTaxDetailsForNamuna8, batchTaxPayerDetails, batchTaxPayerDetailsForNamuna8, batchTaxationLandDetails, countConstructiontax, countTaxPayer, countTaxationLand, fetchAarogya_aarogyaCount, fetchBhumu_bhumiCount, fetchCurrentYear, fetchManora_Count, fetchSafai_SafaiCount, fetchSamanya_Pani_kar_count, fetchVanijya_Count, fetchViseshPaniKar_Count, fetchViz_VizCount, getConstructionForsarkari8, getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8, getEntriesDetails, getEntriesDetailsForNamuna8Sarkari, getNewDistinctUserDetails, getNewDistinctUserwithStartEndDetails, getNewUserDetails, getRecordBasedOnStartandEnd, getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, getTaxationLandDetails, getTaxationandMilkat, getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails } from "../../services/main/customer.service";

/** Run an async mapper over rows in bounded-parallel chunks (default 20 at a
 *  time) instead of one-by-one. Same per-row queries/data, order preserved —
 *  just far faster for big wards (sequential N+1 made these reports crawl). */
async function mapChunked<T, R>(rows: T[], fn: (item: T) => Promise<R>, size = 20): Promise<R[]> {
    const out: R[] = [];
    for (let i = 0; i < rows.length; i += size) {
        const built = await Promise.all(rows.slice(i, i + size).map(fn));
        out.push(...built);
    }
    return out;
}

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
            // BATCH: 3 detail sets for every record in 3 queries (was N+1). Same output.
            const uid = Number(decoded_user['userId']);
            const idsVN = (rs3Data || []).map((r: any) => Number(r.NEWUSER_ID));
            const [tlVN, ctVN, tpVN] = await Promise.all([
                batchTaxationLandDetails(uid, idsVN),
                batchConstructionTaxDetails(uid, idsVN),
                batchTaxPayerDetails(uid, idsVN),
            ]);
            const updatedRs3: any[] = (rs3Data || []).map((item: any) => {
                const key = String(item.NEWUSER_ID);
                return {
                    ...item,
                    taxationLandRS4: tlVN.get(key) || [],
                    constructionTaxRS5: ctVN.get(key) || [],
                    taxPayerRS6: tpVN.get(key) || [],
                };
            });
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
            // BATCH: 3 detail sets in 3 queries (was N+1). Same output.
            const uidGK = Number(decoded_user['userId']);
            const idsGK = (taxlandDataRs3 || []).map((r: any) => Number(r.NEWUSER_ID));
            const [tlGK, ctGK, tpGK] = await Promise.all([
                batchTaxationLandDetails(uidGK, idsGK),
                batchConstructionTaxDetails(uidGK, idsGK),
                batchTaxPayerDetails(uidGK, idsGK),
            ]);
            const updatedRs3 = (taxlandDataRs3 || []).map((item: any) => {
                const key = String(item.NEWUSER_ID);
                return {
                    ...item,
                    taxationLandRS4: tlGK.get(key) || [],
                    constructionTaxRS5: ctGK.get(key) || [],
                    taxPayerRS8: tpGK.get(key) || [],
                };
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
            // BATCH: 3 detail sets in 3 queries (was N+1). Same output.
            const uidSV = Number(decoded_user['userId']);
            const idsSV = (rs3Data || []).map((r: any) => Number(r.NEWUSER_ID));
            const [tlSV, ctSV, tpSV] = await Promise.all([
                batchTaxationLandDetails(uidSV, idsSV),
                batchConstructionTaxDetailsForNamuna8(uidSV, idsSV),
                batchTaxPayerDetailsForNamuna8(uidSV, idsSV),
            ]);
            const updatedRs3 = (rs3Data || []).map((item: any) => {
                const key = String(item.NEWUSER_ID);
                return {
                    ...item,
                    taxationLandRS4: tlSV.get(key) || [],
                    constructionTaxRS5: ctSV.get(key) || [],
                    taxPayerRS6: tpSV.get(key) || [],
                };
            });
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

    static async get_namuna_8_1_single_vard_images(req: Request, res: Response) {
        try{
            console.log("request body", req.body);
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            const new_user_id = req.body.new_user_id || null;
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
            const rs3Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, new_user_id);
            let yearRS42 = null;
            if(new_user_id != null || new_user_id != undefined){
                yearRS42 = await getYearByYearId(rs3Data[0].YEARS_ID);
            }else{
                yearRS42 = await getYearByYearId(year);
            }
            // BATCH: all 3 detail sets for every record in 3 queries total
            // (was 3 queries per record → ~1000+ round-trips for a full ward).
            // Same columns / per-record caps → identical output, far faster.
            const uidIMG = Number(decoded_user['userId']);
            const idsIMG = (rs3Data || []).map((r: any) => Number(r.NEWUSER_ID));
            const [tlMap, ctMap, tpMap] = await Promise.all([
                batchTaxationLandDetails(uidIMG, idsIMG),
                batchConstructionTaxDetails(uidIMG, idsIMG),
                batchTaxPayerDetailsForNamuna8(uidIMG, idsIMG),
            ]);
            const updatedRs3 = (rs3Data || []).map((item: any) => {
                const key = String(item.NEWUSER_ID);
                return {
                    ...item,
                    taxationLandRS4: tlMap.get(key) || [],
                    constructionTaxRS5: ctMap.get(key) || [],
                    taxPayerRS6: tpMap.get(key) || [],
                };
            });
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


    static async get_namuna_8_ghosvara(req: Request, res: Response) {
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
            //  decoded_user['userId'] = 1013;
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            const yearRS42 = await fetchCurrentYear();
            const rs2Data = await fetchBhumu_bhumiCount(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            const rs3Data = await fetchViz_VizCount(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            const rs4Data = await fetchAarogya_aarogyaCount(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            const rs5Data = await fetchSafai_SafaiCount(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            const rs6Data = await fetchSamanya_Pani_kar_count(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            const rs7Data = await fetchViseshPaniKar_Count(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            let rs8Data = await fetchVanijya_Count(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);
            let rs9Data =await fetchManora_Count(Number(decoded_user['userId']), ward_number,yearRS42.previousYear, yearRS42.year_4);

            if(rs8Data[0]?.vani == ''){
                rs8Data[0].vani = 0;
            }
            if(rs9Data[0]?.mano == ''){
                rs9Data[0].mano = 0;
            }
            let totalRight = Number(rs2Data[0]?.bhumi || 0) + Number(rs3Data[0]?.VIZ || 0) + Number(rs4Data[0]?.aarogya || 0) + Number(rs5Data[0]?.safai || 0) + Number(rs6Data[0]?.pani || 0) + Number(rs7Data[0]?.vishesh || 0) + Number(rs8Data[0]?.vani || 0) + Number(rs9Data[0]?.mano || 0);

            let totalLeft = Number(rs2Data[0]?.bhumicount || 0);

             const all_data = {
                newUserDataDB: entriesDetailsDB,
                yearRs42: yearRS42,
                rs2: rs2Data,
                rs3 : rs3Data,
                rs4 : rs4Data,
                rs5 : rs5Data,
                rs6 : rs6Data,
                rs7 : rs7Data,
                rs8 : rs8Data,
                rs9 : rs9Data,
                totalLeft: totalLeft,
                totalRight: totalRight
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async namuna_8_sarkari_with_ward(req: Request, res: Response) {
        try {
            // const new_user_id = Number(req.params.new_user_id);
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            // console.log(decoded_user['userId']);

            const newUserDataDBrs14: any = await getNewDistinctUserwithStartEndDetails(Number(decoded_user['userId']), req.body.ward, req.body.start, req.body.end);
            
            
            const entriesParam = {
                'district_id': Number(decoded_user['DISTRICT_ID']),
                'taluka_id': Number(decoded_user['TALUKA_ID']),
                'panchayat_id': Number(decoded_user['PANCHAYAT_ID']),
                'gatgrampanchayat_id': Number(decoded_user['GATGRAMPANCHAYAT_id']),
                'user_id': Number(decoded_user['userId'])
            }
            const entriesDetailsRs66 = await getEntriesDetailsForNamuna8Sarkari(entriesParam);
            const updatedRs3: any[] = [];
            if(newUserDataDBrs14.length > 0){
                for(let item14 of newUserDataDBrs14){
                    const countTaxationlandC = await countTaxationLand(Number(item14?.new_user_id),Number(decoded_user['userId']));
                    const countConstructionTaxRs1C1 = await countConstructiontax(Number(item14?.new_user_id),Number(decoded_user['userId']));
                    const taxPayerDBC2 = await countTaxPayer(Number(item14?.new_user_id),Number(decoded_user['userId']));
                    const taxationLandDetailsDbRs4 = await getTaxationLandDetails(Number(item14?.new_user_id),Number(decoded_user['userId']))
                    const taxandMilkatDetailsRs101 = await getTaxationandMilkat(Number(item14?.new_user_id),Number(decoded_user['userId']))
                    const taxandMilkatDetailsRs10 = [{"MILKAT_VAPAR_NAME": taxandMilkatDetailsRs101[0]?.MILKAT_VAPAR_NAME}]
                    const newUserDataDBRs3: any = await getNewUserDetails(Number(item14?.new_user_id),Number(decoded_user['userId']));
                    const getConstructionForsarkari8Rs7 = await getConstructionForsarkari8(Number(item14?.new_user_id),Number(decoded_user['userId']));
                    const taxPayerDetailsRs6 =  await getTaxPayerDetails(Number(decoded_user['userId']), Number(item14?.new_user_id));

                    updatedRs3.push({ ...item14,countTaxationlandC,countConstructionTaxRs1C1,taxPayerDBC2,taxationLandDetailsDbRs4, taxandMilkatDetailsRs10,newUserDataDBRs3, getConstructionForsarkari8Rs7,  taxPayerDetailsRs6});
                }
            }
            // 
            // 
            // const all_counts = {
            //     "count": countTaxationland[0].count,
            //     "count1": countConstructionTaxRs1[0].count1,
            //     "count2": taxPayerDB[0].count2
            // }
            // let a: any;
            // if(all_counts.count1 == 0 || all_counts.count2 == 0){
            //     a = 1 + all_counts.count1 + all_counts.count2;
            // }else{
            //     a = 3
            // }
            // all_counts['a'] = a;
            // 
            // 
            // 
            // const s = newUserDataDBRs3[0].BHUMIKAR + newUserDataDBRs3[0].VIZ_DIVVABATTIKAR + newUserDataDBRs3[0].AAROGYA_RAKSHAN_KAR + newUserDataDBRs3[0].SAFAI_KAR;
            // all_counts['s'] = s;
            // 
            // 
            const all_data = {
                entriesDetailsRs66: entriesDetailsRs66,
                rs14: updatedRs3
            }
            return _200(res, "Customer details fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }

    }

}


// 