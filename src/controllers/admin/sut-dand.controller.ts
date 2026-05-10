import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import {
    createDandSut, getDandSutById, getDandSutByPanchayat, listDandSut,
    softDeleteDandSut, updateDandSut,
} from "../../services/admin/sut-dand.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

export class SutDand {
    static async create(req: Request, res: Response) {
        try {
            const { district_id, taluka_id, grampanchayat_id, kar_type } = req.body || {};
            if (!district_id || !taluka_id || !grampanchayat_id || !kar_type) {
                return _400(res, "district_id, taluka_id, grampanchayat_id and kar_type are required");
            }
            if (kar_type !== 'chalu' && kar_type !== 'magil') {
                return _400(res, "kar_type must be either 'chalu' or 'magil'");
            }
            await createDandSut(req.body);
            return _201(res, "Sut Dand record created successfully");
        } catch (error: any) {
            logger.error("SutDand.create :: ", error?.message || error);
            console.error("SutDand.create error :: ", error);
            return _400(res, error?.message || "Error creating Sut Dand record");
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) return _400(res, "id is required");

            const { district_id, taluka_id, grampanchayat_id, kar_type } = req.body || {};
            if (!district_id || !taluka_id || !grampanchayat_id || !kar_type) {
                return _400(res, "district_id, taluka_id, grampanchayat_id and kar_type are required");
            }
            if (kar_type !== 'chalu' && kar_type !== 'magil') {
                return _400(res, "kar_type must be either 'chalu' or 'magil'");
            }

            const existing = await getDandSutById(id);
            if (!existing) return _404(res, "Sut Dand record not found");

            await updateDandSut(id, req.body);
            return _200(res, "Sut Dand record updated successfully");
        } catch (error: any) {
            logger.error("SutDand.update :: ", error?.message || error);
            console.error("SutDand.update error :: ", error);
            return _400(res, error?.message || "Error updating Sut Dand record");
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) return _400(res, "id is required");
            const row = await getDandSutById(id);
            if (!row) return _404(res, "Sut Dand record not found");
            return _200(res, "Sut Dand record fetched successfully", { data: row });
        } catch (error: any) {
            logger.error("SutDand.getById :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching Sut Dand record");
        }
    }

    static async list(req: Request, res: Response) {
        try {
            const { page_number, search_text, district_id, taluka_id, grampanchayat_id, kar_type } = req.body || {};
            const result = await listDandSut({
                page: Number(page_number) || 1,
                searchValue: search_text || '',
                district_id, taluka_id, grampanchayat_id, kar_type,
            });
            return _200(res, "Sut Dand list fetched successfully", {
                data: result.data,
                totalRecords: result.totalRecords,
            });
        } catch (error: any) {
            logger.error("SutDand.list :: ", error?.message || error);
            console.error("SutDand.list error :: ", error);
            return _400(res, error?.message || "Error fetching Sut Dand list");
        }
    }

    static async softDelete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) return _400(res, "id is required");
            const existing = await getDandSutById(id);
            if (!existing) return _404(res, "Sut Dand record not found");
            await softDeleteDandSut(id);
            return _200(res, "Sut Dand record deleted successfully");
        } catch (error: any) {
            logger.error("SutDand.softDelete :: ", error?.message || error);
            return _400(res, error?.message || "Error deleting Sut Dand record");
        }
    }

    static async getByPanchayat(req: Request, res: Response) {
        try {
            const panchayat_id = Number(req.body?.panchayat_id);
            const kar_type = req.body?.kar_type;
            if (!panchayat_id) return _400(res, "panchayat_id is required");
            if (kar_type !== 'chalu' && kar_type !== 'magil') {
                return _400(res, "kar_type must be either 'chalu' or 'magil'");
            }
            const row = await getDandSutByPanchayat(panchayat_id, kar_type);
            return _200(res, "Sut Dand fetched", { data: row });
        } catch (error: any) {
            logger.error("SutDand.getByPanchayat :: ", error?.message || error);
            return _400(res, error?.message || "Error fetching Sut Dand by panchayat");
        }
    }
}
