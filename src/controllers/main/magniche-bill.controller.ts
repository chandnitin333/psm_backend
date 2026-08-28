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
            const data = await searchMagnicheBillData(Number(decoded_user['userId']), req.body,page_number);
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
            const ctx = {
                district_id: Number(decoded_user['DISTRICT_ID']),
                taluka_id: Number(decoded_user['TALUKA_ID']),
                panchayat_id: Number(decoded_user['PANCHAYAT_ID']),
                gatgrampanchayat_id: Number(decoded_user['GATGRAMPANCHAYAT_id']),
                user_id: Number(decoded_user['userId']),
            };
            const params = {
                new_user_id: req.body.new_user_id,
                ward_no: req.body.ward_no,
                start: req.body.start,
                end: req.body.end,
                year: req.body.year,
            };
            const all_data = await MagnicheBillController.buildMagnicheBill129_1Data(ctx, params);
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }

    /** Core 129-1 data assembly, reusable from both the authenticated controller
     *  (ctx from JWT) and the public report endpoint (ctx from the stored link). */
    static async buildMagnicheBill129_1Data(
        ctx: { district_id: number; taluka_id: number; panchayat_id: number; gatgrampanchayat_id: number; user_id: number; },
        params: { new_user_id?: any; ward_no?: any; start?: any; end?: any; year?: any; },
    ): Promise<any> {
            const entriesParam = {
                'district_id': ctx.district_id,
                'taluka_id': ctx.taluka_id,
                'panchayat_id': ctx.panchayat_id,
                'gatgrampanchayat_id': ctx.gatgrampanchayat_id,
                'user_id': ctx.user_id
            }
            const new_user_id = params.new_user_id;
            const ward_no = params.ward_no;
            const start= params.start;
            const end = params.end;
            const year = params.year;
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            let yearRS42 = null;
            let rs3Data = null;
            let rs1Data = null;
            if(new_user_id){
                yearRS42 = await fetchCurrentYear();
                rs3Data = await getUserDataForRs3(ctx.user_id, new_user_id);
            } else {
                yearRS42 = await getYearByYearId(year);
                rs1Data = await getRecordBasedOnStartandEnd(ctx.user_id, ward_no, start, end, new_user_id);
            }
            
            // console.log("yearRS42--", yearRS42[0].YEAR_ID)

            let rs3Updated: any[] = [];
            let rs4Data: any[] = [];
            if (rs3Data && new_user_id) {
                for (const data_rs3 of rs3Data) {
                    const sevakarParam = {
                        'user_id': ctx.user_id,
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
                                "a": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR
                                ),
                                "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                "d": divaWithPercentplus +  divaWithPercentless,
                                "e": aarogyaWithPercentplus +  aarogyaWithPercentless,
                                "f": safaeWithPercentplus +  safaeWithPercentless,
                                "g": samanyaWithPercentplus +  samanyaWithPercentless,
                                "h": visheshWithPercentplus +  visheshWithPercentless,
                                "i": rs4_sevakar.total +  data_rs3.EKUN,
                                "n_etar": rs4_sevakar.etar + etar,
                                "o_notice": rs4_sevakar.notice + notice,
                                // "ls": rs4_sevakar.less + ls1,
                                // "pl": rs4_sevakar.plus + pl1,
                                // "magilnewpl": Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus),
                                // "totalnewpl": Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1), // pl1 should be declared
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
                    rs3Data = await getUserDataForRs3(ctx.user_id,item.NEWUSER_ID) || [];
                    if(rs3Data.length > 0){
                        for(const data_rs3 of rs3Data){
                            const sevakarParam = {
                                'user_id': ctx.user_id,
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
                                    // ५% दंड (plus) थकबाकी (magil) वर आणि ५% सूट (less) चालू करावर —
                                    // same rule as the single-user branch above.
                                    let bhumiWithPercentplus = rs4_sevakar.bhumi + (rs4_sevakar.bhumi * rs4_sevakar.plus) / 100;
                                    let bhumiWithPercentless = data_rs3.BHUMIKAR - (data_rs3.BHUMIKAR * rs4_sevakar.less) / 100;

                                    let divaWithPercentplus = rs4_sevakar.diva + (rs4_sevakar.diva * rs4_sevakar.diva_batti_plus_5) / 100;
                                    let divaWithPercentless = data_rs3.VIZ_DIVVABATTIKAR - (data_rs3.VIZ_DIVVABATTIKAR * rs4_sevakar.diva_batti_less_5) / 100;

                                    let aarogyaWithPercentplus = rs4_sevakar.aarogya + (rs4_sevakar.aarogya * rs4_sevakar.aarogya_plus_5) / 100;
                                    let aarogyaWithPercentless = data_rs3.AAROGYA_RAKSHAN_KAR - (data_rs3.AAROGYA_RAKSHAN_KAR * rs4_sevakar.aarogya_less_5) / 100;

                                    let safaeWithPercentplus = rs4_sevakar.safai + (rs4_sevakar.safai * rs4_sevakar.safae_plus_5) / 100;
                                    let safaeWithPercentless = data_rs3.SAFAI_KAR - (data_rs3.SAFAI_KAR * rs4_sevakar.safae_less_5) / 100;

                                    let samanyaWithPercentplus = rs4_sevakar.samanya + (rs4_sevakar.samanya * rs4_sevakar.samanya_pani_plus_5) / 100;
                                    let samanyaWithPercentless = data_rs3.SAMANYA_PANI_KAR - (data_rs3.SAMANYA_PANI_KAR * rs4_sevakar.samanya_pani_less_5) / 100;

                                    let visheshWithPercentplus = rs4_sevakar.vishesh + (rs4_sevakar.vishesh * rs4_sevakar.vishesh_pani_plus_5) / 100;
                                    let visheshWithPercentless = data_rs3.VISHESH_PANI_KAR - (data_rs3.VISHESH_PANI_KAR * rs4_sevakar.vishesh_pani_less_5) / 100;

                                    let alphabets = {
                                        "a": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR
                                        ),
                                        "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                        "d": divaWithPercentplus + divaWithPercentless,
                                        "e": aarogyaWithPercentplus + aarogyaWithPercentless,
                                        "f": safaeWithPercentplus + safaeWithPercentless,
                                        "g": samanyaWithPercentplus + samanyaWithPercentless,
                                        "h": visheshWithPercentplus + visheshWithPercentless,
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
            return all_data;
    }


    static async getMagnicheBill_129_2_details(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const ctx = {
                district_id: Number(decoded_user['DISTRICT_ID']),
                taluka_id: Number(decoded_user['TALUKA_ID']),
                panchayat_id: Number(decoded_user['PANCHAYAT_ID']),
                gatgrampanchayat_id: Number(decoded_user['GATGRAMPANCHAYAT_id']),
                user_id: Number(decoded_user['userId']),
            };
            const params = {
                new_user_id: req.body.new_user_id,
                ward_no: req.body.ward_no,
                start: req.body.start,
                end: req.body.end,
                year: req.body.year,
            };
            const all_data = await MagnicheBillController.buildMagnicheBill129_2Data(ctx, params);
            return _200(res, "Data fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            console.error('Error in search:', error);
            return _400(res, error.message);
        }
    }

    /** Core 129-2 data assembly, reusable from both the authenticated controller
     *  (ctx from JWT) and the public report endpoint (ctx from the stored link). */
    static async buildMagnicheBill129_2Data(
        ctx: { district_id: number; taluka_id: number; panchayat_id: number; gatgrampanchayat_id: number; user_id: number; },
        params: { new_user_id?: any; ward_no?: any; start?: any; end?: any; year?: any; },
    ): Promise<any> {
            const entriesParam = {
                'district_id': ctx.district_id,
                'taluka_id': ctx.taluka_id,
                'panchayat_id': ctx.panchayat_id,
                'gatgrampanchayat_id': ctx.gatgrampanchayat_id,
                'user_id': ctx.user_id
            }
            const new_user_id = params.new_user_id;
            const ward_no = params.ward_no;
            const start= params.start;
            const end = params.end;
            const year = params.year;
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
            let yearRS42 = null;
            let rs3Data = null;
            let rs1Data = null;
            if(new_user_id){
                yearRS42 = await fetchCurrentYear();
                rs3Data = await getUserDataForRs3(ctx.user_id, new_user_id);
            } else {
                yearRS42 = await getYearByYearId(year);
                rs1Data = await getRecordBasedOnStartandEnd(ctx.user_id, ward_no, start, end, new_user_id);
            }
            
            // console.log("yearRS42--", yearRS42[0].YEAR_ID)

            let rs3Updated: any[] = [];
            let rs4Data: any[] = [];
            if (rs3Data && new_user_id) {
                for (const data_rs3 of rs3Data) {
                    const sevakarParam = {
                        'user_id': ctx.user_id,
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
                                "a": Math.round(
                                    data_rs3.BHUMIKAR +
                                    data_rs3.VIZ_DIVVABATTIKAR +
                                    data_rs3.AAROGYA_RAKSHAN_KAR +
                                    data_rs3.SAFAI_KAR
                                ),
                                "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                "d": divaWithPercentplus +  divaWithPercentless,
                                "e": aarogyaWithPercentplus +  aarogyaWithPercentless,
                                "f": safaeWithPercentplus +  safaeWithPercentless,
                                "g": samanyaWithPercentplus +  samanyaWithPercentless,
                                "h": visheshWithPercentplus +  visheshWithPercentless,
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
                    rs3Data = await getUserDataForRs3(ctx.user_id,item.NEWUSER_ID) || [];
                    if(rs3Data.length > 0){
                        for(const data_rs3 of rs3Data){
                            const sevakarParam = {
                                'user_id': ctx.user_id,
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
                                    // ५% दंड (plus) थकबाकी (magil) वर आणि ५% सूट (less) चालू करावर —
                                    // same rule as the single-user branch above.
                                    let bhumiWithPercentplus = rs4_sevakar.bhumi + (rs4_sevakar.bhumi * rs4_sevakar.plus) / 100;
                                    let bhumiWithPercentless = data_rs3.BHUMIKAR - (data_rs3.BHUMIKAR * rs4_sevakar.less) / 100;

                                    let divaWithPercentplus = rs4_sevakar.diva + (rs4_sevakar.diva * rs4_sevakar.diva_batti_plus_5) / 100;
                                    let divaWithPercentless = data_rs3.VIZ_DIVVABATTIKAR - (data_rs3.VIZ_DIVVABATTIKAR * rs4_sevakar.diva_batti_less_5) / 100;

                                    let aarogyaWithPercentplus = rs4_sevakar.aarogya + (rs4_sevakar.aarogya * rs4_sevakar.aarogya_plus_5) / 100;
                                    let aarogyaWithPercentless = data_rs3.AAROGYA_RAKSHAN_KAR - (data_rs3.AAROGYA_RAKSHAN_KAR * rs4_sevakar.aarogya_less_5) / 100;

                                    let safaeWithPercentplus = rs4_sevakar.safai + (rs4_sevakar.safai * rs4_sevakar.safae_plus_5) / 100;
                                    let safaeWithPercentless = data_rs3.SAFAI_KAR - (data_rs3.SAFAI_KAR * rs4_sevakar.safae_less_5) / 100;

                                    let samanyaWithPercentplus = rs4_sevakar.samanya + (rs4_sevakar.samanya * rs4_sevakar.samanya_pani_plus_5) / 100;
                                    let samanyaWithPercentless = data_rs3.SAMANYA_PANI_KAR - (data_rs3.SAMANYA_PANI_KAR * rs4_sevakar.samanya_pani_less_5) / 100;

                                    let visheshWithPercentplus = rs4_sevakar.vishesh + (rs4_sevakar.vishesh * rs4_sevakar.vishesh_pani_plus_5) / 100;
                                    let visheshWithPercentless = data_rs3.VISHESH_PANI_KAR - (data_rs3.VISHESH_PANI_KAR * rs4_sevakar.vishesh_pani_less_5) / 100;

                                    let alphabets = {
                                        "a": Math.round(
                                            data_rs3.BHUMIKAR +
                                            data_rs3.VIZ_DIVVABATTIKAR +
                                            data_rs3.AAROGYA_RAKSHAN_KAR +
                                            data_rs3.SAFAI_KAR
                                        ),
                                        "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                        "d": divaWithPercentplus + divaWithPercentless,
                                        "e": aarogyaWithPercentplus + aarogyaWithPercentless,
                                        "f": safaeWithPercentplus + safaeWithPercentless,
                                        "g": samanyaWithPercentplus + samanyaWithPercentless,
                                        "h": visheshWithPercentplus + visheshWithPercentless,
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
            return all_data;
    }

}


// 