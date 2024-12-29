

import { Request, Response } from "express";
import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import { getCounts, signIn } from "../../services/admin/users.service";
import { _200, _400 } from "../../utils/ApiResponse";
import e = require("express");
export class AuthController {


    static async authenticate(req: Request, res: Response) {
        try {
            let response: any = {};

            const { user_type, district_id, taluka_id, panchayat_id, username, password } = req.body;
            if (!username) {
                return _400(res, "User ID is required");
            }
            if (!password) {
                return _400(res, "password is required");
            }

            const result: any = await signIn(user_type as string, Number(district_id), Number(taluka_id), Number(panchayat_id), username, password);

            if (result?.data?.length === 0) {
                return _400(res, "Invalid username or password");
            }

            if (result?.data?.length > 0) {
                let params = {
                    userId: result?.data[0].USER_ID,
                    NAME: result?.data[0]?.NAME,
                    SURNAME: result?.data[0]?.SURNAME,
                    USERNAME: result?.data[0]?.USERNAME,
                    TALUKA_ID: result?.data[0]?.TALUKA_ID,
                    GATGRAMPANCHAYAT_id: result?.data[0]?.GATGRAMPANCHAYAT_id,
                    DISTRICT_ID: result?.data[0]?.DISTRICT_ID,
                    PANCHAYAT_ID: result?.data[0]?.PANCHAYAT_ID,
                    R_PATH: result?.data[0]?.R_PATH,
                    DISTRICT_NAME: result?.data[0]?.DISTRICT_NAME,
                    TALUKA_NAME: result?.data[0]?.TALUKA_NAME,
                    PANCHAYAT_NAME: result?.data[0]?.PANCHAYAT_NAME,
                    GATGRAMPANCHAYAT_NAME: result?.data[0]?.GATGRAMPANCHAYAT_NAME,
                    FILE_NAME: result?.data[0]?.FILE_NAME,

                }
                //encode  param any ecodeded
                


                const token = Jwt.sign(params, getEnvironmentVariable().jwt_secret, {
                    expiresIn: "120d",
                });
                response['data'] = {
                    counts: result?.userCounts ?? 0,
                    token: token
                };


                console.log("data", response);
                return _200(res, "User logged in successfully", response);
            }


        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


    static async getActivityCount(req: Request, res: Response) {
        try {
            let response = [];
            response['data'] = {};
            const{user_id}  = req.body;
            getCounts(user_id).then((result) => {
                response['data'] = result;
                return _200(res, "User list retrieved successfully", response);
            }
            ).catch((error) => {
                logger.error(error);
                return _400(res, error.message);
            });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


}