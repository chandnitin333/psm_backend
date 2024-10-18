import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { addOpenPlotInfo, getOpenPlotDetailsById, getOpenPlotInfoList, getOpenPlotRecordsCount, softDeleteOpenPlotInfo, updateOpenPlotInfo } from "../../services/admin/openplot.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Utils } from "../../utils/util";

export class OpenPlotController {
    static async createOpenPlotInfo(req: Request, res: Response) {
        const validationError = Utils.validateRequestBody(req.body, ["taluka_id", "panchayat_id", "gatgrampanchayat_id", "prakar_id", "annualcost_name", "levyrate_name", "district_id"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const member: any = await addOpenPlotInfo(req.body);
            return _201(res, "OpenPlot created successfully", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating OpenPlot", error);
            return _400(res, "Error creating OpenPlot");
        }
    }

    static async updateOpenPlotInfo(req: Request, res: Response) {
        const validationError = Utils.validateRequestBody(req.body, ["taluka_id", "panchayat_id", "gatgrampanchayat_id", "prakar_id", "annualcost_name", "levyrate_name", "district_id"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing OpenPlot ID");
            }
            await updateOpenPlotInfo(id, req.body);

            return _200(res, "OpenPlot updated successfully");
        } catch (error) {
            logger.error("Error updating OpenPlot", error);
            return _400(res, "Error updating OpenPlot");
        }
    }

    static async getOpenPlotInfoById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing OpenPlot ID");
            }
            const member: any = await getOpenPlotDetailsById(Number(id));
            if (!member) {
                return _404(res, "OpenPlot not found");
            }
            return _200(res, "OpenPlot details fetched successfully", { status: 200, data: member });
        } catch (error) {
            logger.error("Error fetching OpenPlot details", error);
            return _400(res, "Error fetching OpenPlot details");
        }
    }

    static async getOpenPlotInfoList(req: Request, res: Response) {
        try {
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const members: any = await getOpenPlotInfoList(page_number);
            let totalRecords = await getOpenPlotRecordsCount();
            return _200(res, "OpenPlots fetched successfully", { status: 200, data: members, totalRecords });
        } catch (error) {
            logger.error("Error fetching OpenPlots", error);
            return _400(res, "Error fetching OpenPlots");
        }
    }

    static async getOpenPlotCount(req: Request, res: Response) {
        try {
            const count: number = await getOpenPlotRecordsCount();
            return _200(res, "OpenPlots count fetched successfully", { status: 200, data: { count } });
        } catch (error) {
            logger.error("Error fetching OpenPlots count", error);
            return _400(res, "Error fetching OpenPlots count");
        }
    }

    static async deleteOpenPlotInfo(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing OpenPlot ID");
            }
            await softDeleteOpenPlotInfo(id);

            return _200(res, "OpenPlot deleted successfully");
        } catch (error) {
            logger.error("Error deleting OpenPlot", error);
            return _400(res, "Error deleting OpenPlot");
        }
    }
}
