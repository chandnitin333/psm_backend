import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import {
    getConstructionTaxDetails, getEntriesDetails, getNewUserDetails,
    getNewUserSevakarDetails, getTaxPayerDetails, gettaxationLandDetails, getYear,
} from "../../services/main/customer.service";
import { createReportViewLink, getReportViewLinkByToken } from "../../services/main/report-link.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

const SUPPORTED_REPORTS = ['namuna-8-1', 'namuna-9-1'];

export class PublicReportController {

    /** Authenticated: create/reuse a public view link for a report.
     *  The user's JWT context is snapshotted into the link params so the
     *  public endpoint can rebuild the report without any login. */
    static async generateLink(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7) : null;
            const decoded_user: any = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            const { newuser_id, report_key } = req.body || {};
            if (!newuser_id) return _400(res, "newuser_id is required");
            if (!SUPPORTED_REPORTS.includes(report_key)) {
                return _400(res, `report_key must be one of: ${SUPPORTED_REPORTS.join(', ')}`);
            }

            const linkToken = await createReportViewLink({
                user_id: Number(decoded_user.userId),
                newuser_id: Number(newuser_id),
                report_key,
                params: {
                    user_id: Number(decoded_user.userId),
                    district_id: Number(decoded_user.DISTRICT_ID),
                    taluka_id: Number(decoded_user.TALUKA_ID),
                    panchayat_id: Number(decoded_user.PANCHAYAT_ID),
                    gatgrampanchayat_id: Number(decoded_user.GATGRAMPANCHAYAT_id),
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
}
