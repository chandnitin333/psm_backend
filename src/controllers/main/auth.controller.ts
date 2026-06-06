

import { Request, Response } from "express";
import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../../environments/env";
import { logger } from "../../logger/Logger";
import { getAdhikrutCount, getAdhikrutTotal, getAudhogikTotal, getChaluKhatedarCount, getChaluKhatedarTotal, getCounts, getGharKarCount, getGharKarTotal, getImlakarCount, getImlakarTotal, getIndiraAwasCount, getIndiraAwasTotal, getManaoraCounts, getManoraTotal, getMemberList, getodyogikCounts, signIn } from "../../services/admin/users.service";
import { _200, _400, _401 } from "../../utils/ApiResponse";
import e = require("express");
import { Utils } from "../../utils/util";
export class AuthController {

    /**
     * Issues a fresh 30-min token from the current (still-valid) one.
     * The frontend calls this periodically while the user is active, so an
     * actively-working session never expires; 30-min inactivity stops the
     * refresh and the token lapses (idle logout).
     */
    static async refreshToken(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            if (!token) return _401(res, "No token provided");
            const decoded: any = Jwt.verify(token, getEnvironmentVariable().jwt_secret);
            // Drop the old iat/exp before re-signing.
            const { iat, exp, ...payload } = decoded;
            const newToken = Jwt.sign(payload, getEnvironmentVariable().jwt_secret, {
                expiresIn: "30m",
            });
            return _200(res, "Token refreshed", { token: newToken });
        } catch (error: any) {
            logger.error("refreshToken :: ", error?.message || error);
            return _401(res, "Session expired");
        }
    }


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
            const oudogyik =  await getodyogikCounts(Number(user_id));
            const manaora  = await getManaoraCounts(Number(user_id));
            const response = {
                "chalu_khatedar": chalu_khatedar.ANNU_KRAMANK,
                "adhikrut": adhikrut.MILKAR_PRAKAR,
                "indira_awas": indira_Awas.MILKAR_PRAKAR,
                "imlakar": imlakar.MILKAR_PRAKAR,
                "ghar_kar": gharkar.MILKAR_PRAKAR,
                "audyogik": oudogyik.MILKAR_PRAKAR,
                "manora": manaora.MILKAR_PRAKAR
            }
            
            return _200(res, "User list retrieved successfully", response);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }


    static async getMemberDetails(req: Request, res: Response) {
        try {
            let response: any = {};
            const tokenPanchayatId = (req as any)?.user?.PANCHAYAT_ID;
            const panchayat_id = req.body?.panchayat_id || tokenPanchayatId;
            if (!panchayat_id) {
                return _400(res, "panchayat_id not found in request or token");
            }
            getMemberList(Number(panchayat_id)).then((result) => {
                response['data'] = result;
                return _200(res, "Member list retrieved successfully", response);
            }).catch((error) => {
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
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const { user_id } = req.body;
            const chalu_khatedar = await getChaluKhatedarTotal(Number(user_id), page_number);
            
            
            return _200(res, "User list retrieved successfully", chalu_khatedar);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAdhikrutTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getAdhikrutTotal(Number(user_id),page_number);
            return _200(res, "User list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getIndiraAwasTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getIndiraAwasTotal(Number(user_id),page_number);
            return _200(res, "User list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getImlakarTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getImlakarTotal(Number(user_id),page_number);
            return _200(res, "User list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getgharKarTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getGharKarTotal(Number(user_id),page_number);
            return _200(res, "User list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getAudhogikTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getAudhogikTotal(Number(user_id),page_number);
            return _200(res, "list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async getManoraTotal(req: Request, res:Response){
        try {
            const { user_id } = req.body;
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            const data = await getManoraTotal(Number(user_id),page_number);
            return _200(res, "list retrieved successfully", data);
            
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

   
    
}