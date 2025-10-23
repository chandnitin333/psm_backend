

import { Request, Response } from "express";
import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import { getAdhikrutCount, getAdhikrutTotal, getChaluKhatedarCount, getChaluKhatedarTotal, getCounts, getGharKarCount, getGharKarTotal, getImlakarCount, getImlakarTotal, getIndiraAwasCount, getIndiraAwasTotal, getMemberList, signIn } from "../../services/admin/users.service";
import { _200, _400 } from "../../utils/ApiResponse";
import e = require("express");
import { Utils } from "../../utils/util";
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
                    RNO: result?.data[0]?.RNO,
                    RANDOM_NUMBER: result?.data[0]?.RandomNumber,
                    TOKENS: result?.data[0]?.Tokens,


                }
                //encode  param any ecodeded



                const token = Jwt.sign(params, getEnvironmentVariable().jwt_secret, {
                    expiresIn: "30m",
                });
                response['data'] = {
                    counts: result?.userCounts ?? 0,
                    token: token,
                    RNO: await Utils.generateRNO(),
                    RandomNumber: await Utils.generateRandomNumber(),
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
            // let response = [];
            // response['data'] = {};
            const { user_id } = req.body;
            const chalu_khatedar = await getChaluKhatedarCount(Number(user_id));
            const adhikrut = await getAdhikrutCount(Number(user_id));
            const indira_Awas = await getIndiraAwasCount(Number(user_id));
            const imlakar = await getImlakarCount(Number(user_id));
            const gharkar = await getGharKarCount(Number(user_id));
            const response = {
                "chalu_khatedar": chalu_khatedar.ANNU_KRAMANK,
                "adhikrut": adhikrut.MILKAR_PRAKAR,
                "indira_awas": indira_Awas.MILKAR_PRAKAR,
                "imlakar": imlakar.MILKAR_PRAKAR,
                "ghar_kar": gharkar.MILKAR_PRAKAR
            }
            
            return _200(res, "User list retrieved successfully", response);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


    static async getMemberDetails(req: Request, res: Response) {
        try {
            let response = [];
            response['data'] = {};
            const { panchayat_id } = req.body;
            getMemberList(panchayat_id).then((result) => {
                response['data'] = result;
                return _200(res, "Member list retrieved successfully", response);
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

    static async getChaluKhatedarTotal(req: Request, res:Response){
        try {
            // let response = [];
            // response['data'] = {};
            const { user_id } = req.body;
            const chalu_khatedar = await getChaluKhatedarTotal(Number(user_id));
            
            
            return _200(res, "User list retrieved successfully", { status: 200, data: chalu_khatedar });
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAdhikrutTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            const data = await getAdhikrutTotal(Number(user_id));
            return _200(res, "User list retrieved successfully", { status: 200, data: data });
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getIndiraAwasTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            const data = await getIndiraAwasTotal(Number(user_id));
            return _200(res, "User list retrieved successfully", { status: 200, data: data });
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getImlakarTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            const data = await getImlakarTotal(Number(user_id));
            return _200(res, "User list retrieved successfully", { status: 200, data: data });
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getgharKarTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            const data = await getGharKarTotal(Number(user_id));
            return _200(res, "User list retrieved successfully", { status: 200, data: data });
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    
}