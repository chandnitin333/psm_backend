
import { logger } from "../../logger/Logger";

import { Request, Response } from "express";
import { addMember, getMember, getMemberCount, getMembersList, getpanchayatUsers, softDeleteMember, updateMember } from "../../services/admin/members.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

// कामकाज कमेटी
export class Memeber {

    static async createMember(req: Request, res: Response) {
        try {
            const member: any = await addMember(req.body);
            return _201(res, "Member created successfully", member);
        } catch (error) {
            logger.error("Error creating member", error);
            return _400(res, "Error creating member");
        }
    }

    static async getMember(req: Request, res: Response) {
        try {
            let response = [];
            const member = await getMember(Number(req.params.id));
            if (!member) {
                return _404(res, "Member not found");
            }
            response['data'] = member;
            return _200(res, "Fetch Member details successfully", response);
        } catch (error) {
            logger.error("Error fetching member", error);
            return _400(res, "Error fetching member");
        }
    }

    static async getMembersList(req: Request, res: Response) {
        try {
            let response: any = {};
            const { page_number, search_text = "", panchayat_id } = req.body as { page_number?: string, search_text?: any, panchayat_id:number };
            const members: any = await getMembersList(Number(page_number) || 1, search_text, panchayat_id);
            response['totalRecords'] = await getMemberCount();
            response['data'] = members;

            return _200(res, "Fetch list retrieved successfully ", response);
        } catch (error) {
            logger.error("Error fetching members list", error);
            return _400(res, "Error fetching members list");
        }
    }

    static async updateMember(req: Request, res: Response) {
        try {
            const updatedMember: any = await updateMember({ id: req.params.id, ...req.body });
            if (!updatedMember) {
                return _404(res, "Member not found");
            }
            return _200(res, "Member updated successfully");
        } catch (error) {
            logger.error("Error updating member", error);
            return _400(res, "Error updating member");
        }
    }

    static async deleteMember(req: Request, res: Response) {
        try {
            const deletedMember: any = await softDeleteMember(Number(req.params.id));
            if (!deletedMember) {
                return _404(res, "Member not found");
            }
            return _200(res, "Member deleted successfully");
        } catch (error) {
            logger.error("Error deleting member", error);
            return _400(res, "Error deleting member");
        }
    }

    static getPanchayatUsers = async (req, res) => {
        try {
            let response = [];
            const result: any = await getpanchayatUsers();
            if (!result) {
                return _404(res, "User not found");
            }
            response['data'] = result;
            return _200(res, "User data fetch successfully", response);
        } catch (error) {
            logger.error("getUserDistrict::", error);
            return _400(res, error.message);
        }

    }

}





