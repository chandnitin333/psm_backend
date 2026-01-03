import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { fetchAarogya_aarogyaCount, fetchBhumu_bhumiCount, fetchCurrentYear, fetchManora_Count, fetchSafai_SafaiCount, fetchSamanya_Pani_kar_count, fetchVanijya_Count, fetchViseshPaniKar_Count, fetchViz_VizCount, getAarogyaRakshanKar, getAudhogikData, getAudhogik_from_newsevakar, getBhumi_deva_from_newsevakar, getBhumikar_bhumiCountandOther, getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8, getDataByUserIdAndVardNumber, getEntriesDetails, getNewUserSevakarDetails, getRecordBasedOnStartandEnd, getSafaeKar, getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, getTotalNewUserSevakar, getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails, searchMagnicheBillData } from "../../services/main/customer.service";
   
export class Namuna9Controller {
   static async get_namuna_9_anukramnika(req: Request, res: Response) {
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
            for (const item of rs3Data) {
                item.tot = await getTotalNewUserSevakar(Number(year), Number(item.NEWUSER_ID), Number(decoded_user['userId'])) ;
                item.sevakar_tot = Number(item.tot) + Number(item.EEKUN_KAR_BHARNA);
            }
           
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

    // Namuna 9 dropdown report
    static async get_namuna_9_vard_new(req: Request, res: Response) {
        try{
            const ward_number = req.body.ward;
            const year = req.body.year;
            const start= req.body.start;
            const end = req.body.end;
            // const fromYear= req.body.from_year;
            // const to_year = req.body.to_year;
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
            const rs1Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, new_user_id);
            const yearRS42 = await getYearByYearId(year);
            const updatedRs3: any[] = [];
            let rs4Data: any[] = [];
            if (rs1Data) {
                for (const item of rs1Data) {
                    // console.log("item", item)
                    const newUserDataRs3 = await getUserDataForRs3(Number(decoded_user['userId']),item.NEWUSER_ID) || [];
                    if(newUserDataRs3.length > 0){
                        for(const data_rs3 of newUserDataRs3){
                            const sevakarParam = {
                                'user_id': Number(decoded_user['userId']),
                                "previousYear_id": Number(yearRS42[0].YEAR_ID) - 1,
                                "vard_number": data_rs3.VARD_NUMBER,
                                "newuser_id":data_rs3.NEWUSER_ID,
                            }
                            rs4Data = await getNewUserSevakarDetails(sevakarParam) || [];
                            if(rs4Data.length > 0){
                                let ls1 = 0;
                                let pl1 = 0;
                                let etar = 0;
                                let notice = 0;
                                for(const rs4_sevakar of rs4Data){

                                    let bhumiPercentAmtPlus = (rs4_sevakar.bhumi * rs4_sevakar.plus) / 100;
                                    let bhumiWithPercentplus = rs4_sevakar.bhumi + bhumiPercentAmtPlus;
                                    let bhumiPercentAmtless = (data_rs3.BHUMIKAR * rs4_sevakar.less) / 100;
                                    let bhumiWithPercentless = data_rs3.BHUMIKAR - bhumiPercentAmtless;

                                    let divaPercentAmtPlus = (rs4_sevakar.diva * rs4_sevakar.diva_batti_plus_5) / 100;
                                    let divaWithPercentplus = rs4_sevakar.diva + divaPercentAmtPlus;
                                    let divaPercentAmtless = (data_rs3.VIZ_DIVVABATTIKAR * rs4_sevakar.diva_batti_less_5) / 100;
                                    let divaWithPercentless = data_rs3.VIZ_DIVVABATTIKAR - divaPercentAmtless;

                                    let aarogyaPercentAmtPlus = (rs4_sevakar.aarogya * rs4_sevakar.aarogya_plus_5) / 100;
                                    let aarogyaWithPercentplus = rs4_sevakar.aarogya + aarogyaPercentAmtPlus;
                                    let aarogyaPercentAmtless = (data_rs3.AAROGYA_RAKSHAN_KAR * rs4_sevakar.aarogya_less_5) / 100;
                                    let aarogyaWithPercentless = data_rs3.AAROGYA_RAKSHAN_KAR - aarogyaPercentAmtless;

                                    let safaePercentAmtPlus = (rs4_sevakar.safai * rs4_sevakar.safae_plus_5) / 100;
                                    let safaeWithPercentplus = rs4_sevakar.safai + safaePercentAmtPlus;
                                    let safaePercentAmtless = (data_rs3.SAFAI_KAR * rs4_sevakar.safae_less_5) / 100;
                                    let safaeWithPercentless = data_rs3.SAFAI_KAR - safaePercentAmtless;

                                    let samanyaPercentAmtPlus = (rs4_sevakar.samanya * rs4_sevakar.samanya_pani_plus_5) / 100;
                                    let samanyaWithPercentplus = rs4_sevakar.samanya + samanyaPercentAmtPlus;
                                    let samanyaPercentAmtless = (data_rs3.SAMANYA_PANI_KAR * rs4_sevakar.samanya_pani_less_5) / 100;
                                    let samanyaWithPercentless = data_rs3.SAMANYA_PANI_KAR - samanyaPercentAmtless;

                                    let visheshPercentAmtPlus = (rs4_sevakar.vishesh * rs4_sevakar.vishesh_pani_plus_5) / 100;
                                    let visheshWithPercentplus = rs4_sevakar.vishesh + visheshPercentAmtPlus;
                                    let visheshPercentAmtless = (data_rs3.VISHESH_PANI_KAR * rs4_sevakar.vishesh_pani_less_5) / 100;
                                    let visheshWithPercentless = data_rs3.VISHESH_PANI_KAR - visheshPercentAmtless;

                                    let alphabets = {

                                        "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                        "d": divaWithPercentplus +  divaWithPercentless,
                                        "e": aarogyaWithPercentplus +  aarogyaWithPercentless,
                                        "f": safaeWithPercentplus +  safaeWithPercentless,
                                        "g": samanyaWithPercentplus +  samanyaWithPercentless,
                                        "h": visheshWithPercentplus +  visheshWithPercentless,
                                        "i": rs4_sevakar.total +  data_rs3.EKUN,
                                        "n": rs4_sevakar.etar + etar,
                                        "o": rs4_sevakar.notice + notice,
                                        // "ls": rs4_sevakar.less + ls1,
                                        // "pl": rs4_sevakar.plus + pl1,
                                        // "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        // "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                        "k": Math.round(rs4_sevakar.total),
                                        //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                        "l": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        ),
                                        'm': Math.round(rs4_sevakar.total) + Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        ),
                                        "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR) +Math.round(rs4_sevakar.less + ls1) + Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1)
                                    }
                                rs4_sevakar['alphabets'] = alphabets;
                                }
                            }
                        }
                         
                    }
                    // const taxationLandRS4 = await gettaxationLandDetails(Number(decoded_user['userId']), Number(item.NEWUSER_ID)) || [];
                    
                    // updatedRs3.push({ ...item,newUserDataRs3 });
                    updatedRs3.push({newUserDataRs3, rs4Data });
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

    // namnuna 9 new report
    static async get_namuna9_new(req: Request, res: Response) {
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
            const rs3 = await getDataByUserIdAndVardNumber(Number(decoded_user['userId']),ward_number);
            const rs35 = await getAarogyaRakshanKar(Number(decoded_user['userId']),ward_number);
            const rs36 = await getSafaeKar(Number(decoded_user['userId']),ward_number);
            let condition = 0;
            if(rs35.aarogya > rs36.SAFAI_KAR){
                condition = 1;
            } else {
                condition = 2;
            }
            const rs4 = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_number, start, end, null);
            const updatedRs4: any[] = [];
             let rs5Data: any[] = [];
            if (rs4) {
                for (const item of rs4) {
                    const sevakarParam = {
                        'user_id': Number(decoded_user['userId']),
                        "previousYear_id": Number(yearRS10[0].YEAR_ID) - 1,
                        "vard_number": item.VARD_NUMBER,
                        "newuser_id":item.NEWUSER_ID,
                    }
                    rs5Data = await getNewUserSevakarDetails(sevakarParam) || [];
                    if(rs5Data.length > 0){
                        let ls1 = 0;
                        let pl1 = 0;
                        let etar = 0;
                        let notice = 0;
                        for(const rs4_sevakar of rs5Data){
                            let alphabets = {
                                "b": Math.round(rs4_sevakar.bhumi + item.BHUMIKAR),
                                "d": rs4_sevakar.diva +  item.VIZ_DIVVABATTIKAR,
                                "e": rs4_sevakar.aarogya +  item.AAROGYA_RAKSHAN_KAR,
                                "f": rs4_sevakar.safai +  item.SAFAI_KAR,
                                "g": rs4_sevakar.samanya +  item.SAMANYA_PANI_KAR,
                                "h": rs4_sevakar.vishesh +  item.VISHESH_PANI_KAR,
                                "i": rs4_sevakar.total +  item.EKUN,
                                "n": rs4_sevakar.etar + etar,
                                "o": rs4_sevakar.notice + notice,
                                "ls": rs4_sevakar.less + ls1,
                                "pl": rs4_sevakar.plus + pl1,
                                "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                "k": Math.round(rs4_sevakar.total),
                                //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                "l": Math.round(
                                    item.BHUMIKAR +
                                    item.VIZ_DIVVABATTIKAR +
                                    item.AAROGYA_RAKSHAN_KAR +
                                    item.SAFAI_KAR +
                                    item.SAMANYA_PANI_KAR +
                                    item.VISHESH_PANI_KAR
                                ),
                                'm': Math.round(rs4_sevakar.total) + Math.round(
                                    item.BHUMIKAR +
                                    item.VIZ_DIVVABATTIKAR +
                                    item.AAROGYA_RAKSHAN_KAR +
                                    item.SAFAI_KAR +
                                    item.SAMANYA_PANI_KAR +
                                    item.VISHESH_PANI_KAR
                                ),
                                "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "j": Math.round(rs4_sevakar.bhumi + item.BHUMIKAR) + Math.round(rs4_sevakar.diva +  item.VIZ_DIVVABATTIKAR) +
                                Math.round(rs4_sevakar.aarogya +  item.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  item.SAFAI_KAR) +Math.round(rs4_sevakar.less + ls1) + Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1)
                            }
                            rs4_sevakar['alphabets'] = alphabets;
                        }
                        updatedRs4.push({ ...item, rs5Data});
                    }
                }
            }
            const all_data = {
                newUserDataDBRs2: entriesDetailsDB,
                yearRs10: yearRS10,
                rs3: [{"VARD_NUMBER":rs3?.VARD_NUMBER}],
                rs35 : rs35,
                rs36: rs36,
                rs4: updatedRs4,
                condition: condition
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }
        catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    // namuna 9 ghosvaras
    static async get_namuna_9_ghosvara(req: Request, res: Response) {
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
            const yearRS42 = await fetchCurrentYear();

            const rs3Data = await getBhumikar_bhumiCountandOther(Number(decoded_user['userId']), ward_number);
            const rs4Data = await getBhumi_deva_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS42.yearId);
            const rs5Data = await getAudhogikData(Number(decoded_user['userId']), ward_number ,'औद्योगिक');
            const rd8Data = await getAudhogik_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS42.yearId,'औद्योगिक');
            const rs9Data = await getAudhogikData(Number(decoded_user['userId']), ward_number ,'मनोरा');
            const rs10Data = await getAudhogik_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS42.yearId,'मनोरा');


             const all_data = {
                newUserDataDB: entriesDetailsDB,
                yearRs42: yearRS42,
                rs3 : rs3Data,
                rs4 : rs4Data,
                rs5 : rs5Data,
                rs9 : rs9Data,
                rs10: rs10Data
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }



    // namuna 9 ghosvaras new
    static async get_namuna_9_ghosvara_new(req: Request, res: Response) {
        try{
            const ward_number = req.body.ward;
            const year = req.body.year;
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
            // const yearRS42 = await fetchCurrentYear();
            const yearRS1 = await getYearByYearId(year);
            const rs3Data = await getBhumikar_bhumiCountandOther(Number(decoded_user['userId']), ward_number);
            const rs4Data = await getBhumi_deva_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS1[0].YEAR_ID);
            const rs5Data = await getAudhogikData(Number(decoded_user['userId']), ward_number ,'औद्योगिक');
            const rd8Data = await getAudhogik_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS1[0].YEAR_ID,'औद्योगिक');
            const rs9Data = await getAudhogikData(Number(decoded_user['userId']), ward_number ,'मनोरा');
            const rs10Data = await getAudhogik_from_newsevakar(Number(decoded_user['userId']), ward_number, yearRS1[0].Year_id,'मनोरा');


             const all_data = {
                newUserDataDB: entriesDetailsDB,
                yearRs1: yearRS1,
                rs3 : rs3Data,
                rs4 : rs4Data,
                rs5 : rs5Data,
                rs8 : rd8Data,
                rs9 : rs9Data,
                rs10: rs10Data
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        }catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
}


// 