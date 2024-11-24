
import { Request, response, Response } from "express";
import { logger } from "../../logger/Logger";
import { createNewUser, getUserById, getUserList, getUsersDistrict, softDeleteUser, updateUser } from "../../services/admin/users.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

export class User {
    static async addNewUser(req: Request, res: Response) {
        try {
            await createNewUser(req.body);
            return _201(res, "New user created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateUserInfo(req: Request, res: Response) {
        try {
            const { id, user_type } = req.body;
            if (!id) {
                return _400(res, "User ID is required");
            }
            let isExists = await getUserById(id, user_type);
            if (!isExists) {
                return _404(res, "User details not found.");
            }
            const result = await updateUser(req.body);
            return _200(res, "User updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllUser(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text, user_type, district_id } = req.body;
            const result: any = await getUserList(Number(page_number - 1), search_text as string, user_type as string, Number(district_id));
            response['data'] = result?.data ?? [];
            response['totalRecords'] = result?.totalRecords ?? 0
            return _200(res, "User list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getUser(req: Request, res: Response) {
        try {
            const { id, user_type } = req.body;
            if (!id) {
                return _400(res, "User ID is required");
            }
            const result = await getUserById(Number(id), user_type);
            if (!result) {
                return _404(res, "User not found");
            }
            response['data'] = result;
            return _200(res, "User data fetch successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteUser = async (req, res, next) => {
        try {
            const { id, user_type } = req.body;
            if (!id) {
                return _400(res, "User ID is required");
            }
            const result = await getUserById(Number(id), user_type);
            if (!result) {
                return _404(res, "User not found");
            }
            let response: any = await softDeleteUser(id, user_type);
            if (response) {
                return _200(res, "User deleted successfully");
            } else {
                return _400(res, "User not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static getUserDistrict = async (req, res) => {
        try {
            const result: any = await getUsersDistrict()
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





