import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { fetchAarogya_aarogyaCount, fetchBhumu_bhumiCount, fetchCurrentYear, fetchManora_Count, fetchSafai_SafaiCount, fetchSamanya_Pani_kar_count, fetchVanijya_Count, fetchViseshPaniKar_Count, fetchViz_VizCount, getAarogyaRakshanKar, getAudhogikData, getAudhogik_from_newsevakar, getBhumi_deva_from_newsevakar, getBhumikar_bhumiCountandOther, getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8, getDataByUserIdAndVardNumber, getEntriesDetails, getNewUserSevakarDetails, getRecordBasedOnStartandEnd, getSafaeKar, getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, getTotalNewUserSevakar, getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYearByYearId, gettaxationLandDetails, searchMagnicheBillData } from "../../services/main/customer.service";
   
export class MagnicheBillController {
   

    // =============================== Magniche Bill Module ===============================//

    static async searchMagnicheBill(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await searchMagnicheBillData(1008, req.body,page_number);
            return _200(res, "Magniche Bill details fetched successfully", data);
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }

    static async getMagnicheBill_129_1_details(req: Request, res: Response) {
        try {
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
            const new_user_id = req.body.new_user_id;
            const ward_no = req.body.ward_no;
            const start= req.body.start;
            const end = req.body.end;
            const year = req.body.year;
            console.log(req.body)
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            let yearRS42 = null;
            let rs3Data = null;
            let rs1Data = null;
            if(new_user_id){
                yearRS42 = await fetchCurrentYear();
                rs3Data = await getUserDataForRs3(Number(decoded_user['userId']), new_user_id);
            } else {
                yearRS42 = await getYearByYearId(year);
                rs1Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_no, start, end, new_user_id);
            }
            
            // console.log("yearRS42--", yearRS42[0].YEAR_ID)

            let rs3Updated: any[] = [];
            let rs4Data: any[] = [];
            if (rs3Data && new_user_id) {
                for (const data_rs3 of rs3Data) {
                    const sevakarParam = {
                        'user_id': Number(decoded_user['userId']),
                        "previousYear_id": Number(yearRS42.yearId_negative_1),
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
                            let alphabets = {
                                "a": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR
                                ),
                                "b": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR),
                                "d": rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR,
                                "e": rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR,
                                "f": rs4_sevakar.safai +  data_rs3.SAFAI_KAR,
                                "g": rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR,
                                "h": rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR,
                                "i": rs4_sevakar.total +  data_rs3.EKUN,
                                "n_etar": rs4_sevakar.etar + etar,
                                "o_notice": rs4_sevakar.notice + notice,
                                "ls": rs4_sevakar.less + ls1,
                                "pl": rs4_sevakar.plus + pl1,
                                "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                // "k": Math.round(rs4_sevakar.total),
                                //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                "k": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.samanya + rs4_sevakar.vishesh + rs4_sevakar.etar + rs4_sevakar.notice,
                                "s": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai,

                                "l": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR +
                                    data_rs3.SAMANYA_PANI_KAR +
                                    data_rs3.VISHESH_PANI_KAR
                                ),
                                'm': Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR ) + Math.round(rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR) + Math.round(rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR),
                                // "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR),
                                "p": Math.round(rs4_sevakar.total),
                                "q": 0,
                                "r": 0,
                                "u": Math.round(rs4_sevakar.total) + Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR +
                                    data_rs3.SAMANYA_PANI_KAR +
                                    data_rs3.VISHESH_PANI_KAR
                                )
                                // "s" : rs4_sevakar.etar + etar

                            }
                        rs4_sevakar['alphabets'] = alphabets;
                        }
                    }

                    rs3Updated.push({ ...data_rs3,rs4Data });
                }
            } else if(rs1Data && !new_user_id){
                for (const item of rs1Data) {
                    rs3Data = await getUserDataForRs3(Number(decoded_user['userId']),item.NEWUSER_ID) || [];
                    if(rs3Data.length > 0){
                        for(const data_rs3 of rs3Data){
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
                                    let alphabets = {
                                        "a": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR
                                        ),
                                        "b": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR),
                                        "d": rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR,
                                        "e": rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR,
                                        "f": rs4_sevakar.safai +  data_rs3.SAFAI_KAR,
                                        "g": rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR,
                                        "h": rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR,
                                        "i": rs4_sevakar.total +  data_rs3.EKUN,
                                        "n_etar": rs4_sevakar.etar + etar,
                                        "o_notice": rs4_sevakar.notice + notice,
                                        "ls": rs4_sevakar.less + ls1,
                                        "pl": rs4_sevakar.plus + pl1,
                                        "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                        // "k": Math.round(rs4_sevakar.total),
                                        //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                        "k": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.samanya + rs4_sevakar.vishesh + rs4_sevakar.etar + rs4_sevakar.notice,
                                        "s": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai,

                                        "l": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        ),
                                        'm': Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR ) + Math.round(rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR) + Math.round(rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR),
                                        // "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR),
                                        "p": Math.round(rs4_sevakar.total),
                                        "q": 0,
                                        "r": 0,
                                        "u": Math.round(rs4_sevakar.total) + Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        )
                                        // "s" : rs4_sevakar.etar + etar

                                    }
                                rs4_sevakar['alphabets'] = alphabets;
                                }
                            }
                        }

                    }
                    rs3Updated.push({ ...item,rs4Data });
                }
            }

            const all_data = {
                newUserDataDB: entriesDetailsDB,
                yearRS42: yearRS42,
                // rs3 : rs3Data,
                // rs4 : rs4Data
                rs3 : rs3Updated
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }
    

    static async getMagnicheBill_129_2_details(req: Request, res: Response) {
        try {
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
            const new_user_id = req.body.new_user_id;
            const ward_no = req.body.ward_no;
            const start= req.body.start;
            const end = req.body.end;
            const year = req.body.year;
            // console.log(req.body)
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            let yearRS42 = null;
            let rs3Data = null;
            let rs1Data = null;
            if(new_user_id){
                yearRS42 = await fetchCurrentYear();
                rs3Data = await getUserDataForRs3(Number(decoded_user['userId']), new_user_id);
            } else {
                yearRS42 = await getYearByYearId(year);
                rs1Data = await getRecordBasedOnStartandEnd(Number(decoded_user['userId']), ward_no, start, end, new_user_id);
            }
            
            // console.log("yearRS42--", yearRS42[0].YEAR_ID)

            let rs3Updated: any[] = [];
            let rs4Data: any[] = [];
            if (rs3Data && new_user_id) {
                for (const data_rs3 of rs3Data) {
                    const sevakarParam = {
                        'user_id': Number(decoded_user['userId']),
                        "previousYear_id": Number(yearRS42.yearId_negative_1),
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
                            let alphabets = {
                                "a": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR
                                ),
                                "b": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR),
                                "d": rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR,
                                "e": rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR,
                                "f": rs4_sevakar.safai +  data_rs3.SAFAI_KAR,
                                "g": rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR,
                                "h": rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR,
                                "i": rs4_sevakar.total +  data_rs3.EKUN,
                                "n_etar": rs4_sevakar.etar + etar,
                                "o_notice": rs4_sevakar.notice + notice,
                                "ls": rs4_sevakar.less + ls1,
                                "pl": rs4_sevakar.plus + pl1,
                                "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                // "k": Math.round(rs4_sevakar.total),
                                //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                "k": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.samanya + rs4_sevakar.vishesh + rs4_sevakar.etar + rs4_sevakar.notice,
                                "s": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai,

                                "l": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR +
                                    data_rs3.SAMANYA_PANI_KAR +
                                    data_rs3.VISHESH_PANI_KAR
                                ),
                                'm': Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR ) + Math.round(rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR) + Math.round(rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR),
                                // "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR),
                                "p": Math.round(rs4_sevakar.total),
                                "q": 0,
                                "r": 0,
                                "u": Math.round(rs4_sevakar.total) + Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR +
                                    data_rs3.SAMANYA_PANI_KAR +
                                    data_rs3.VISHESH_PANI_KAR
                                )
                                // "s" : rs4_sevakar.etar + etar

                            }
                        rs4_sevakar['alphabets'] = alphabets;
                        }
                    }

                    rs3Updated.push({ ...data_rs3,rs4Data });
                }
            } else if(rs1Data && !new_user_id){
                for (const item of rs1Data) {
                    rs3Data = await getUserDataForRs3(Number(decoded_user['userId']),item.NEWUSER_ID) || [];
                    if(rs3Data.length > 0){
                        for(const data_rs3 of rs3Data){
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
                                    let alphabets = {
                                        "a": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR
                                        ),
                                        "b": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR),
                                        "d": rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR,
                                        "e": rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR,
                                        "f": rs4_sevakar.safai +  data_rs3.SAFAI_KAR,
                                        "g": rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR,
                                        "h": rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR,
                                        "i": rs4_sevakar.total +  data_rs3.EKUN,
                                        "n_etar": rs4_sevakar.etar + etar,
                                        "o_notice": rs4_sevakar.notice + notice,
                                        "ls": rs4_sevakar.less + ls1,
                                        "pl": rs4_sevakar.plus + pl1,
                                        "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
                                        // "k": Math.round(rs4_sevakar.total),
                                        //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
                                        "k": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.samanya + rs4_sevakar.vishesh + rs4_sevakar.etar + rs4_sevakar.notice,
                                        "s": rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai,

                                        "l": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        ),
                                        'm': Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR ) + Math.round(rs4_sevakar.samanya +  data_rs3.SAMANYA_PANI_KAR) + Math.round(rs4_sevakar.vishesh +  data_rs3.VISHESH_PANI_KAR),
                                        // "s": Math.round(rs4_sevakar.bhumi + rs4_sevakar.diva + rs4_sevakar.aarogya + rs4_sevakar.safai + rs4_sevakar.less) + Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                        "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva +  data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya +  data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai +  data_rs3.SAFAI_KAR),
                                        "p": Math.round(rs4_sevakar.total),
                                        "q": 0,
                                        "r": 0,
                                        "u": Math.round(rs4_sevakar.total) + Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR +
                                            data_rs3.SAMANYA_PANI_KAR +
                                            data_rs3.VISHESH_PANI_KAR
                                        )
                                        // "s" : rs4_sevakar.etar + etar

                                    }
                                rs4_sevakar['alphabets'] = alphabets;
                                }
                            }
                        }

                    }
                    rs3Updated.push({ ...item,rs4Data });
                }
            }

            const all_data = {
                newUserDataDB: entriesDetailsDB,
                yearRS42: yearRS42,
                // rs3 : rs3Data,
                // rs4 : rs4Data
                rs3 : rs3Updated
            }
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }

}


// 