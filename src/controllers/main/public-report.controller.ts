import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import {
    countConstructiontax, countTaxationLand, countTaxPayer,
    getConstructionForsarkari8, getConstructionTaxDetails, getConstructionTaxDetailsForNamuna8,
    getEntriesDetails, getEntriesDetailsForNamuna8Sarkari,
    getNewDistinctUserDetails, getNewDistinctUserwithStartEndDetails, getNewUserDetails, getNewUserSevakarDetails,
    getRecordBasedOnStartandEnd, getTaxationLandDetails, getTaxationandMilkat,
    getTaxLandData, getTaxPayerDetails, getTaxPayerDetailsForNamuna8, gettaxationLandDetails,
    getUserDataForAdhikrutGharkul, getUserDataForGharKar, getUserDataForRs3, getYear, getYearByYearId,
} from "../../services/main/customer.service";
import { createReportViewLink, getReportViewLinkByToken, reportScopeKey } from "../../services/main/report-link.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

// Per-newuser reports need a newuser_id; ward/range reports need report_params.
const NEWUSER_REPORTS = ['namuna-8-1', 'namuna-9-1', 'namuna-8-sarkari'];
const PARAM_REPORTS = ['namuna-8-1-single-vard', 'namuna-8-images', 'namuna-8-vard-new', 'namuna-8-sarkari-ward', 'malmatta-darkachi-yadi', 'malmatta-khula-bhukhand', 'malmatta-ghar-kar', 'namuna-9-vard-new'];
const SUPPORTED_REPORTS = [...NEWUSER_REPORTS, ...PARAM_REPORTS];

export class PublicReportController {

    /** Authenticated: create/reuse a public view link for a report.
     *  The user's JWT context is snapshotted into the link params so the
     *  public endpoint can rebuild the report without any login. */
    static async generateLink(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            const { newuser_id, report_key, report_params } = req.body || {};
            if (!SUPPORTED_REPORTS.includes(report_key)) {
                return _400(res, `report_key must be one of: ${SUPPORTED_REPORTS.join(', ')}`);
            }
            if (NEWUSER_REPORTS.includes(report_key) && !newuser_id) {
                return _400(res, "newuser_id is required");
            }
            if (PARAM_REPORTS.includes(report_key) && !report_params) {
                return _400(res, "report_params is required");
            }

            const linkToken = await createReportViewLink({
                user_id: Number(decoded_user.userId),
                newuser_id: newuser_id ? Number(newuser_id) : (report_params?.new_user_id ? Number(report_params.new_user_id) : null),
                report_key,
                scope_key: PARAM_REPORTS.includes(report_key) ? reportScopeKey(report_params) : null,
                params: {
                    user_id: Number(decoded_user.userId),
                    district_id: Number(decoded_user.DISTRICT_ID),
                    taluka_id: Number(decoded_user.TALUKA_ID),
                    panchayat_id: Number(decoded_user.PANCHAYAT_ID),
                    gatgrampanchayat_id: Number(decoded_user.GATGRAMPANCHAYAT_id),
                    report_params: report_params ?? null,
                },
            });
            return _201(res, "Report link generated", { token: linkToken });
        } catch (error: any) {
            logger.error("PublicReport.generateLink :: ", error?.message || error);
            return _400(res, error?.message || "Error generating report link");
        }
    }

    /** Public (no auth): return the report data for a view link. */
    static async getPublicReport(req: Request, res: Response) {
        try {
            const token = req.params.token;
            if (!token) return _400(res, "token is required");
            const link = await getReportViewLinkByToken(token);
            if (!link) return _404(res, "Report link not found or expired");

            if (link.report_key === 'namuna-8-1') {
                const data = await PublicReportController.buildNamuna81Data(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-9-1') {
                const data = await PublicReportController.buildNamuna91Data(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-8-sarkari') {
                const data = await PublicReportController.buildNamuna8SarkariData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-8-1-single-vard') {
                const data = await PublicReportController.buildSingleVardData(link, false);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-8-images') {
                const data = await PublicReportController.buildSingleVardData(link, true);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-8-vard-new') {
                const data = await PublicReportController.buildVardNewData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-8-sarkari-ward') {
                const data = await PublicReportController.buildSarkariWardData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'malmatta-darkachi-yadi') {
                const data = await PublicReportController.buildMalmattaDarkachiData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'malmatta-khula-bhukhand') {
                const data = await PublicReportController.buildKhulaBhukhandData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'malmatta-ghar-kar') {
                const data = await PublicReportController.buildGharKarData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            if (link.report_key === 'namuna-9-vard-new') {
                const data = await PublicReportController.buildNamuna9VardNewData(link);
                return _200(res, "Report fetched", { report_key: link.report_key, data });
            }
            return _400(res, "Unsupported report type");
        } catch (error: any) {
            logger.error("PublicReport.getPublicReport :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching report");
        }
    }

    /** Same data assembly as CustomerController.namuna_8_1, but the user
     *  context comes from the stored link instead of a JWT. */
    private static async buildNamuna81Data(link: any): Promise<any> {
        const ctx = link.params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);
        const new_user_id = Number(link.newuser_id);

        const currentYear = new Date().getFullYear();
        const years = [{
            currentYear,
            previousYear: currentYear - 1,
            nextYear: currentYear + 1,
            year_3: currentYear + 3,
            year_4: currentYear + 4,
        }];

        const newUserDataDB: any = await getNewUserDetails(new_user_id, user_id);
        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const taxationlandDB = await gettaxationLandDetails(user_id, new_user_id);
        const constructionTaxDetailsDB = await getConstructionTaxDetails(user_id, new_user_id);
        const taxPayerDB = await getTaxPayerDetails(user_id, new_user_id);

        return {
            newUserDataDBrs3: newUserDataDB,
            entriesDetailsDBrs2: entriesDetailsDB,
            taxationlandDBrs4: taxationlandDB,
            constructionTaxDetailsDBrs5: constructionTaxDetailsDB,
            taxPayerDBrrs6: taxPayerDB,
            years,
        };
    }

    /** Same data assembly as CustomerController.namuna_9_1, but the user
     *  context comes from the stored link instead of a JWT. */
    private static async buildNamuna91Data(link: any): Promise<any> {
        const ctx = link.params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);
        const new_user_id = Number(link.newuser_id);

        const years_response: any = await getYear();
        const years = [{
            currentYear: Number(years_response[0].yyy),
            previousYear: Number(years_response[0].yyy) - 1,
            previousYear_id: Number(years_response[0].Year_id) - 1,
            nextYear: Number(years_response[0].yyy) + 1,
            year_3: Number(years_response[0].yyy) + 3,
            year_4: Number(years_response[0].yyy) + 4,
        }];

        const newUserDataDB: any = await getNewUserDetails(new_user_id, user_id);
        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });

        const sevakarParam = {
            user_id,
            // Magil records live under the PREVIOUS year (same rule as namuna_9_1).
            previousYear_id: Number(years_response[0].Year_id) - 1,
            vard_number: newUserDataDB[0].VARD_NUMBER,
            newuser_id: newUserDataDB[0].NEWUSER_ID,
        };
        const newUserSevakarDB: any = await getNewUserSevakarDetails(sevakarParam);

        const ls1 = 0;
        const pl1 = 0;
        const etar = 0;
        const notice = 0;
        let bhumiPercentAmtPlus = (newUserSevakarDB[0].bhumi * newUserSevakarDB[0].plus) / 100;
        let bhumiWithPercentplus = newUserSevakarDB[0].bhumi + bhumiPercentAmtPlus;
        let bhumiPercentAmtless = (newUserDataDB[0].BHUMIKAR * newUserSevakarDB[0].less) / 100;
        let bhumiWithPercentless = newUserDataDB[0].BHUMIKAR - bhumiPercentAmtless;

        let divaPercentAmtPlus = (newUserSevakarDB[0].diva * newUserSevakarDB[0].diva_batti_plus_5) / 100;
        let divaWithPercentplus = newUserSevakarDB[0].diva + divaPercentAmtPlus;
        let divaPercentAmtless = (newUserDataDB[0].VIZ_DIVVABATTIKAR * newUserSevakarDB[0].diva_batti_less_5) / 100;
        let divaWithPercentless = newUserDataDB[0].VIZ_DIVVABATTIKAR - divaPercentAmtless;

        let aarogyaPercentAmtPlus = (newUserSevakarDB[0].aarogya * newUserSevakarDB[0].aarogya_plus_5) / 100;
        let aarogyaWithPercentplus = newUserSevakarDB[0].aarogya + aarogyaPercentAmtPlus;
        let aarogyaPercentAmtless = (newUserDataDB[0].AAROGYA_RAKSHAN_KAR * newUserSevakarDB[0].aarogya_less_5) / 100;
        let aarogyaWithPercentless = newUserDataDB[0].AAROGYA_RAKSHAN_KAR - aarogyaPercentAmtless;

        let safaePercentAmtPlus = (newUserSevakarDB[0].safai * newUserSevakarDB[0].safae_plus_5) / 100;
        let safaeWithPercentplus = newUserSevakarDB[0].safai + safaePercentAmtPlus;
        let safaePercentAmtless = (newUserDataDB[0].SAFAI_KAR * newUserSevakarDB[0].safae_less_5) / 100;
        let safaeWithPercentless = newUserDataDB[0].SAFAI_KAR - safaePercentAmtless;

        let samanyaPercentAmtPlus = (newUserSevakarDB[0].samanya * newUserSevakarDB[0].samanya_pani_plus_5) / 100;
        let samanyaWithPercentplus = newUserSevakarDB[0].samanya + samanyaPercentAmtPlus;
        let samanyaPercentAmtless = (newUserDataDB[0].SAMANYA_PANI_KAR * newUserSevakarDB[0].samanya_pani_less_5) / 100;
        let samanyaWithPercentless = newUserDataDB[0].SAMANYA_PANI_KAR - samanyaPercentAmtless;

        let visheshPercentAmtPlus = (newUserSevakarDB[0].vishesh * newUserSevakarDB[0].vishesh_pani_plus_5) / 100;
        let visheshWithPercentplus = newUserSevakarDB[0].vishesh + visheshPercentAmtPlus;
        let visheshPercentAmtless = (newUserDataDB[0].VISHESH_PANI_KAR * newUserSevakarDB[0].vishesh_pani_less_5) / 100;
        let visheshWithPercentless = newUserDataDB[0].VISHESH_PANI_KAR - visheshPercentAmtless;

        const alphabets = {
            "a": Math.round(
                newUserDataDB[0].BHUMIKAR +
                newUserDataDB[0].VIZ_DIVVABATTIKAR +
                newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                newUserDataDB[0].SAFAI_KAR
            ),
            "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
            "d": divaWithPercentplus + divaWithPercentless,
            "e": aarogyaWithPercentplus + aarogyaWithPercentless,
            "f": safaeWithPercentplus + safaeWithPercentless,
            "g": samanyaWithPercentplus + samanyaWithPercentless,
            "h": visheshWithPercentplus + visheshWithPercentless,
            "i": newUserSevakarDB[0].total + newUserDataDB[0].EKUN,
            "n": newUserSevakarDB[0].etar + etar,
            "o": newUserSevakarDB[0].notice + notice,
            "k": Math.round(newUserSevakarDB[0].total),
            "l": Math.round(
                newUserDataDB[0].BHUMIKAR +
                newUserDataDB[0].VIZ_DIVVABATTIKAR +
                newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                newUserDataDB[0].SAFAI_KAR +
                newUserDataDB[0].SAMANYA_PANI_KAR +
                newUserDataDB[0].VISHESH_PANI_KAR
            ),
            'm': Math.round(newUserSevakarDB[0].total) + Math.round(
                newUserDataDB[0].BHUMIKAR +
                newUserDataDB[0].VIZ_DIVVABATTIKAR +
                newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                newUserDataDB[0].SAFAI_KAR +
                newUserDataDB[0].SAMANYA_PANI_KAR +
                newUserDataDB[0].VISHESH_PANI_KAR
            ),
            "s": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai),
            "j": Math.round(newUserSevakarDB[0].bhumi + newUserDataDB[0].BHUMIKAR) + Math.round(newUserSevakarDB[0].diva + newUserDataDB[0].VIZ_DIVVABATTIKAR) +
                Math.round(newUserSevakarDB[0].aarogya + newUserDataDB[0].AAROGYA_RAKSHAN_KAR) + Math.round(newUserSevakarDB[0].safai + newUserDataDB[0].SAFAI_KAR) +
                Math.round(newUserSevakarDB[0].less + ls1) + Math.round(Math.round((newUserSevakarDB[0].bhumi / 100) * newUserSevakarDB[0].plus) + pl1)
        };

        return {
            newUserDataDBrs3: newUserDataDB,
            entriesDetailsDBrs2: entriesDetailsDB,
            newUserSevakarDBrs4: newUserSevakarDB,
            alphabets,
            years,
        };
    }

    /** Same data assembly as CustomerController.namuna_8_sarkari. */
    private static async buildNamuna8SarkariData(link: any): Promise<any> {
        const ctx = link.params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);
        const new_user_id = Number(link.newuser_id);

        const newUserDataDBrs14: any = await getNewDistinctUserDetails(new_user_id, user_id);
        const entriesDetailsRs66 = await getEntriesDetailsForNamuna8Sarkari({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const countTaxationland = await countTaxationLand(new_user_id, user_id);
        const countConstructionTaxRs1 = await countConstructiontax(new_user_id, user_id);
        const taxPayerDB = await countTaxPayer(new_user_id, user_id);
        const all_counts: any = {
            count: countTaxationland[0].count,
            count1: countConstructionTaxRs1[0].count1,
            count2: taxPayerDB[0].count2,
        };
        let a: any;
        if (all_counts.count1 == 0 || all_counts.count2 == 0) {
            a = 1 + all_counts.count1 + all_counts.count2;
        } else {
            a = 3;
        }
        all_counts['a'] = a;
        const taxationLandDetailsDbRs4 = await getTaxationLandDetails(new_user_id, user_id);
        const taxandMilkatDetailsRs10 = await getTaxationandMilkat(new_user_id, user_id);
        const newUserDataDBRs3: any = await getNewUserDetails(new_user_id, user_id);
        const s = newUserDataDBRs3[0].BHUMIKAR + newUserDataDBRs3[0].VIZ_DIVVABATTIKAR + newUserDataDBRs3[0].AAROGYA_RAKSHAN_KAR + newUserDataDBRs3[0].SAFAI_KAR;
        all_counts['s'] = s;
        const getConstructionForsarkari8Rs7 = await getConstructionForsarkari8(new_user_id, user_id);
        const taxPayerDetailsRs6 = await getTaxPayerDetails(user_id, new_user_id);

        return {
            newUserDataDBrs14,
            entriesDetailsRs66,
            all_counts,
            taxationLandDetailsDbRs4,
            taxandMilkatDetailsRs10,
            newUserDataDBRs3,
            getConstructionForsarkari8Rs7,
            taxPayerDetailsRs6,
        };
    }

    /** Same data assembly as Namuna8Controller.get_namuna_8_1_single_vard
     *  (withImages=false) / get_namuna_8_1_single_vard_images (withImages=true). */
    private static async buildSingleVardData(link: any, withImages: boolean): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const ward_number = rp.ward;
        const year = rp.year;
        const start = rp.start;
        const end = rp.end;
        const new_user_id = rp.new_user_id || null;
        const fromYear = rp.from_year;
        const to_year = rp.to_year;

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const rs3Data = await getRecordBasedOnStartandEnd(user_id, ward_number, start, end, new_user_id);
        let yearRS42 = null;
        if (new_user_id != null && rs3Data && rs3Data.length > 0) {
            yearRS42 = await getYearByYearId(rs3Data[0].YEARS_ID);
        } else {
            yearRS42 = await getYearByYearId(year);
        }
        const updatedRs3 = await PublicReportController.mapChunked(rs3Data || [], async (item: any) => {
            const nid = Number(item.NEWUSER_ID);
            const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                gettaxationLandDetails(user_id, nid).then(r => r || []),
                (withImages
                    ? getConstructionTaxDetails(user_id, nid)
                    : getConstructionTaxDetailsForNamuna8(user_id, nid)).then(r => r || []),
                getTaxPayerDetailsForNamuna8(user_id, nid).then(r => r || []),
            ]);
            return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
        });
        const all_data: any = {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs42: yearRS42,
            rs3: updatedRs3,
        };
        if (withImages) {
            all_data.from_to_year = { from_year: fromYear, to_year: to_year };
        }
        return all_data;
    }

    /** Same data assembly as Namuna8Controller.get_namuna_8_vard_new. */
    private static async buildVardNewData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const ward_number = rp.ward;
        const year = rp.year;
        const start = rp.start;
        const end = rp.end;

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const rs3Data = await getUserDataForAdhikrutGharkul(user_id, ward_number, start, end);
        const yearRS42 = await getYearByYearId(year);
        // Per-record detail lookups, but run in bounded-parallel chunks instead
        // of one-at-a-time. Same queries/data — just far faster for big wards
        // (sequential N+1 was timing out and surfacing as an "invalid link").
        const updatedRs3 = await PublicReportController.mapChunked(rs3Data || [], async (item: any) => {
            const nid = Number(item.NEWUSER_ID);
            const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                gettaxationLandDetails(user_id, nid).then(r => r || []),
                getConstructionTaxDetails(user_id, nid).then(r => r || []),
                getTaxPayerDetails(user_id, nid).then(r => r || []),
            ]);
            return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
        });
        return {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs42: yearRS42,
            rs3: updatedRs3,
            // Echo the from/to years so the public template can render the header line.
            from_to_year: { from_year: rp.from_year, to_year: rp.to_year },
        };
    }

    /** Run an async mapper over rows in bounded-parallel chunks (CHUNK at a
     *  time) instead of strictly one-by-one. Same per-row queries and data,
     *  order preserved — just far faster for big wards, so heavy reports no
     *  longer crawl / time out (a timeout surfaced as an "invalid link"). */
    private static async mapChunked<T, R>(rows: T[], fn: (item: T) => Promise<R>, size = 20): Promise<R[]> {
        const out: R[] = [];
        for (let i = 0; i < rows.length; i += size) {
            const built = await Promise.all(rows.slice(i, i + size).map(fn));
            out.push(...built);
        }
        return out;
    }

    /** Same data assembly as Namuna8Controller.namuna_8_sarkari_with_ward. */
    private static async buildSarkariWardData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const newUserDataDBrs14: any = await getNewDistinctUserwithStartEndDetails(user_id, rp.ward, rp.start, rp.end);
        const entriesDetailsRs66 = await getEntriesDetailsForNamuna8Sarkari({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const updatedRs3 = await PublicReportController.mapChunked(newUserDataDBrs14 || [], async (item14: any) => {
            const nid = Number(item14?.new_user_id);
            const [
                countTaxationlandC, countConstructionTaxRs1C1, taxPayerDBC2,
                taxationLandDetailsDbRs4, taxandMilkatDetailsRs101, newUserDataDBRs3,
                getConstructionForsarkari8Rs7, taxPayerDetailsRs6,
            ] = await Promise.all([
                countTaxationLand(nid, user_id),
                countConstructiontax(nid, user_id),
                countTaxPayer(nid, user_id),
                getTaxationLandDetails(nid, user_id),
                getTaxationandMilkat(nid, user_id),
                getNewUserDetails(nid, user_id),
                getConstructionForsarkari8(nid, user_id),
                getTaxPayerDetails(user_id, nid),
            ]);
            const taxandMilkatDetailsRs10 = [{ "MILKAT_VAPAR_NAME": taxandMilkatDetailsRs101[0]?.MILKAT_VAPAR_NAME }];
            return {
                ...item14, countTaxationlandC, countConstructionTaxRs1C1, taxPayerDBC2,
                taxationLandDetailsDbRs4, taxandMilkatDetailsRs10, newUserDataDBRs3,
                getConstructionForsarkari8Rs7, taxPayerDetailsRs6,
            };
        });
        return {
            entriesDetailsRs66,
            rs14: updatedRs3,
        };
    }

    /** Same data assembly as MalamattaGrahakYadiList.get_malmatta_darkachi_yadi_list. */
    private static async buildMalmattaDarkachiData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const yearRS10 = await getYearByYearId(rp.year);
        const rs3Data = await getRecordBasedOnStartandEnd(user_id, rp.ward, rp.start, rp.end, null);
        const updatedRs3 = await PublicReportController.mapChunked(rs3Data || [], async (item: any) => {
            const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                gettaxationLandDetails(user_id, item.NEWUSER_ID).then(r => r || []),
                getConstructionTaxDetails(user_id, item.NEWUSER_ID).then(r => r || []),
                getTaxPayerDetails(user_id, item.NEWUSER_ID).then(r => r || []),
            ]);
            return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
        });
        return {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs10: yearRS10,
            rs3: updatedRs3,
        };
    }

    /** Same data assembly as MalamattaGrahakYadiList.get_malmatta_grahak_yadi_khula_bhukhand. */
    private static async buildKhulaBhukhandData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const yearRS10 = await getYearByYearId(rp.year);
        const taxlandDataRs6 = await getTaxLandData(user_id, rp.ward, rp.start, rp.end);
        const updatedRs6 = await PublicReportController.mapChunked(taxlandDataRs6 || [], async (item: any) => {
            const [newUserDataRs3, taxationLandRS4, constructionTaxRS5, taxPayerRS8] = await Promise.all([
                getUserDataForRs3(user_id, item.newuser_id),
                gettaxationLandDetails(user_id, item.newuser_id).then(r => r || []),
                getConstructionTaxDetails(user_id, item.newuser_id).then(r => r || []),
                getTaxPayerDetails(user_id, item.newuser_id).then(r => r || []),
            ]);
            return { ...item, newUserDataRs3, taxationLandRS4, constructionTaxRS5, taxPayerRS8 };
        });
        return {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs10: yearRS10,
            rs6: updatedRs6,
        };
    }

    /** Same data assembly as MalamattaGrahakYadiList.get_malmatta_grahak_yadi_ghar_kar. */
    private static async buildGharKarData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const yearRS10 = await getYearByYearId(rp.year);
        const newuserDataRs3 = await getUserDataForGharKar(user_id, rp.ward, rp.start, rp.end);
        const updatedRs3 = await PublicReportController.mapChunked(newuserDataRs3 || [], async (item: any) => {
            const [taxationLandRS4, constructionTaxRS5, taxPayerRS6] = await Promise.all([
                gettaxationLandDetails(user_id, item.NEWUSER_ID).then(r => r || []),
                getConstructionTaxDetails(user_id, item.NEWUSER_ID).then(r => r || []),
                getTaxPayerDetails(user_id, item.NEWUSER_ID).then(r => r || []),
            ]);
            return { ...item, taxationLandRS4, constructionTaxRS5, taxPayerRS6 };
        });
        return {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs10: yearRS10,
            rs3: updatedRs3,
        };
    }

    /** Same data assembly as Namuna9Controller.get_namuna_9_vard_new. */
    private static async buildNamuna9VardNewData(link: any): Promise<any> {
        const ctx = link.params || {};
        const rp = ctx.report_params || {};
        const user_id = Number(ctx.user_id ?? link.user_id);

        const entriesDetailsDB: any = await getEntriesDetails({
            district_id: Number(ctx.district_id),
            taluka_id: Number(ctx.taluka_id),
            panchayat_id: Number(ctx.panchayat_id),
            gatgrampanchayat_id: Number(ctx.gatgrampanchayat_id),
            user_id,
        });
        const rs1Data = await getRecordBasedOnStartandEnd(user_id, rp.ward, rp.start, rp.end, null);
        const yearRS42 = await getYearByYearId(rp.year);
        const updatedRs3 = await PublicReportController.mapChunked(rs1Data || [], async (item: any) => {
            let rs4Data: any[] = [];
            const newUserDataRs3 = await getUserDataForRs3(user_id, item.NEWUSER_ID) || [];
                if (newUserDataRs3.length > 0) {
                    for (const data_rs3 of newUserDataRs3) {
                        const sevakarParam = {
                            user_id,
                            previousYear_id: Number(yearRS42[0].YEAR_ID) - 1,
                            vard_number: data_rs3.VARD_NUMBER,
                            newuser_id: data_rs3.NEWUSER_ID,
                        };
                        rs4Data = await getNewUserSevakarDetails(sevakarParam) || [];
                        if (rs4Data.length > 0) {
                            const ls1 = 0;
                            const pl1 = 0;
                            const etar = 0;
                            const notice = 0;
                            for (const rs4_sevakar of rs4Data) {
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

                                const alphabets = {
                                    "b": Math.round(bhumiWithPercentplus + bhumiWithPercentless),
                                    "d": divaWithPercentplus + divaWithPercentless,
                                    "e": aarogyaWithPercentplus + aarogyaWithPercentless,
                                    "f": safaeWithPercentplus + safaeWithPercentless,
                                    "g": samanyaWithPercentplus + samanyaWithPercentless,
                                    "h": visheshWithPercentplus + visheshWithPercentless,
                                    "i": rs4_sevakar.total + data_rs3.EKUN,
                                    "n": rs4_sevakar.etar + etar,
                                    "o": rs4_sevakar.notice + notice,
                                    "k": Math.round(rs4_sevakar.total),
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
                                    "j": Math.round(rs4_sevakar.bhumi + data_rs3.BHUMIKAR) + Math.round(rs4_sevakar.diva + data_rs3.VIZ_DIVVABATTIKAR) +
                                        Math.round(rs4_sevakar.aarogya + data_rs3.AAROGYA_RAKSHAN_KAR) + Math.round(rs4_sevakar.safai + data_rs3.SAFAI_KAR) + Math.round(rs4_sevakar.less + ls1) + Math.round(Math.round((rs4_sevakar.bhumi / 100) * rs4_sevakar.plus) + pl1)
                                };
                                rs4_sevakar['alphabets'] = alphabets;
                            }
                        }
                    }
                }
            return { newUserDataRs3, rs4Data };
        });
        return {
            newUserDataDBRs2: entriesDetailsDB,
            yearRs42: yearRS42,
            rs3: updatedRs3,
        };
    }
}
