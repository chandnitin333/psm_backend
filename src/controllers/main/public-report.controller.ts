import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import {
    getConstructionTaxDetails, getEntriesDetails, getNewUserDetails,
    getTaxPayerDetails, gettaxationLandDetails,
} from "../../services/main/customer.service";
import { createReportViewLink, getReportViewLinkByToken } from "../../services/main/report-link.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

const SUPPORTED_REPORTS = ['namuna-8-1'];

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
}
