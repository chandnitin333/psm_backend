import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../environments/env";
import { logger } from "../logger/Logger";
import {
    getAuthenticateDetails,
    isExistUser,
    updatePassword,
    addNewPassword,
} from "../services/userService";
import { Utils } from "../utils/util";
import {
    API_KEY,
    CLIENT_ID,
    CLIENT_SECRET,
    EMAIL,
    OTP,
    PASS,
    TOKEN_API,
    USER_ROLE,
    USER_STATUS,
} from "../constants/constant";
import { httpService } from "../helper/httpService";

export class AuthController {


    static async forgotPassword(req, res, next) {

        let userId = req?.body?.user_id;
        let api_key = req?.body?.api_key;
        let newPass = req?.body?.newpass;
        let forOtpPass = req?.body?.for_otp_pass
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let passStatus = 0;

        if (API_KEY === api_key) {
            let userDetails = isExistUser([userId]);
            if (userDetails) {
                if (forOtpPass == OTP) {
                    passStatus = 1
                    let hasPassword = await Utils.encryptPassword(newPass);
                    let authDetails = getAuthenticateDetails([userId])
                    if (authDetails) {
                        await updatePassword([hasPassword, 1, userId, userId]);
                    } else {
                        await addNewPassword([
                            userId,
                            hasPassword,
                            1,
                            0,
                            currentTimestamp,
                            userId,
                        ]);
                    }

                    response['SUCCESS'] = 1
                    response['code'] = 200
                    res.status(200).send(response)

                }
            } else {

                response['SUCCESS'] = 2
                response['code'] = 400
                res.status(400).send(response)
            }

        } else {
            response['SUCCESS'] = 0
            response['code'] = 400
            res.status(400).send(response)
        }
    }
}
