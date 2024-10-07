import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariable } from "../environments/env";
import { logger } from "../logger/Logger";
import {
    getUserDetails,
    getUserBatch,
    checkOtpValidate,
    updateLoginTime,
    updateDeviceId,
    updateSessionData,
    userAppData,
    addLoginAttempt,
    getUserDetailsByType,
    getUserOtpAuth,
    addNewOtpEntry,
    getSignupUser,
    updateNewOtp,
    getAuthenticateDetails,
    isExistUser,
    getAccessTokenOrUpdate,
    updateUserStatus,
    updateUserRegistrationStatus,
    updatePassword,
    addNewPassword,
    updateProfilePhoto,
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


export class UserController {
    /**
     * New user signup process and send verification code to user email.
     * @function UserController/signUp
     * @param {object} req  - http request object.
     * @param {object} res  - http response object.
     * @param {object} next - callback function to handle next request.
     */

    // static async signUp(req, res, next) {
    //     try {

    //         const email = req.body.email;
    //         const username = req.body.username;
    //         const password = req.body.password;
    //         const verificationToken = Utils.genericVerificationToken();
    //         const encryptedPassword = await Utils.encryptPassword(password);

    //         const data = {
    //             email: email,
    //             username: username,
    //             password: encryptedPassword,
    //             verification_token: verificationToken,
    //             verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME

    //         }
    //         console.log(data);
    //         let user = await new User(data).save();
    //         ApiResponse.successResponseWithData(res, "Registration Successfully", user);
    //         // res.send(user);

    //     } catch (e) {
    //         next(e)
    //     }

    // }

    static async login(req, res, next) {
        let password = req?.body?.pass;
        let username = req?.body?.user;
        let fotOtpPass = req?.body?.for_otp_pass;
        let batchDetails: any;
        let emailMobile = req?.body?.email_mobile;
        let loginStatus: number;
        let userOtp = req?.body?.otp;
        let fcmId = req?.body?.$fcm_id;
        let appVersion = req?.body?.app_version;
        let appCode = req?.body?.app_code;
        let ipAddress = req?.body?.ip_address;
        let deviceDtl = req?.body?.device_dtl;
        let userRoleAttempt = "";
        let currentDate = await Utils.getCurrentDate();
        let response = {};
        try {
            let user = await getUserDetails([username, username]);

            if (!user) {
                return res.status(401).send({
                    statusCode: 401,
                    error: "User credential invalid",
                });
            }
            batchDetails = await getUserBatch(user.id);
            if (fotOtpPass == PASS) {
                try {
                    if (user.user_status == USER_STATUS.ACTIVE) {
                        let isMatch = await Utils.comparePassword({
                            plainPassword: password,
                            encryptedPassword: user.password,
                        });

                        if (!isMatch) {
                            loginStatus = 6;
                            res.status(401).send({
                                statusCode: 401,
                                error: "Password does not match",
                                SUCCESS: loginStatus,
                            });
                        } else {
                            loginStatus = 1;
                        }
                    } else if (user.user_status == USER_STATUS.INVITED) {
                        loginStatus = 3;
                    } else if (user.user_status == USER_STATUS.REGISTERED) {
                        loginStatus = 8;
                    }
                } catch (error) {
                    logger.error("isMatch Error", error);
                    loginStatus = 6;
                    return res.status(401).send({
                        statusCode: 401,
                        error: error.message,
                        SUCCESS: loginStatus,
                    });
                }
            } else if (fotOtpPass == EMAIL) {
            } else if (fotOtpPass == OTP) {
                if (
                    user.user_status == USER_STATUS.ACTIVE ||
                    user.user_status == USER_STATUS.INVITED
                ) {
                    const isValidate = await checkOtpValidate(emailMobile, [
                        user.id,
                        userOtp,
                    ]);
                    if (isValidate) {
                        let timestamp = await Utils.getCurrentDate();

                        const isLogin = await updateLoginTime(emailMobile, [
                            1,
                            timestamp,
                            user.id,
                            userOtp,
                        ]);

                        loginStatus = 1;
                        logger.info("Login Success OTP :", isLogin);
                    } else {
                        loginStatus = 7;
                        response["SUCCESS"] = loginStatus;
                        response["MESSAGE"] = "Unauthorized access";
                        return res.status(401).send(response);
                    }
                } else if (user.user_status == USER_STATUS.REGISTERED) {
                    loginStatus = 8;
                    response["SUCCESS"] = loginStatus;
                    response["MESSAGE"] = "User is not invited yet.";
                    res.status(401).send(response);
                }
            }

            if (user.device_id != null && user.device_id != "") {
                await updateDeviceId([req?.body?.device_id, user.id]);
            }

            if (loginStatus == 1 && user.role == USER_ROLE.ROLE_USER_STUDENT) {
                await updateSessionData([currentDate, fcmId, user.id]);
                await userAppData([appVersion, appCode, user.id]);
                userRoleAttempt = "S";
            }
            if (user.role == USER_ROLE.ROLE_USER_TEACHER) {
                userRoleAttempt = "T";
            } else if (user.role == USER_ROLE.ROLE_USER_PARENT) {
                userRoleAttempt = "P";
            }

            await addLoginAttempt([
                user?.id,
                user?.device_id,
                currentDate,
                deviceDtl,
                appVersion,
                appCode,
                userRoleAttempt,
                ipAddress,
            ]);

            user.password = "***********";
            const data = {
                user_id: user?.id,
                email: user?.email,
                mobile: user?.mobile,
            };

            const token = Jwt.sign(data, getEnvironmentVariable().jwt_secret, {
                expiresIn: "120d",
            });

            user.batch_id = batchDetails?.batch_id;
            user.batch_name = batchDetails.batch_name;
            response["USER_ID"] = user?.id;
            response["FIRST_NAME"] = user?.firstname;
            response["LAST_NAME"] = user?.lastname;
            response["EMAIL"] = user?.email;
            response["MOBILE"] = user?.mobile;
            response["USER_STATUS"] = user?.user_status;
            response["ROLE"] = user?.role;
            response["PROFILE_PHOTO"] = user?.profile_photo;
            response["GENDER"] = user?.gender;
            response["CLASS"] = user?.std_id;
            response["CITY"] = user?.city;
            response["ADDRESS"] = user?.address;
            response["COUNTRY_ID"] = user?.country_id;
            response["COUNTRY_NAME"] = user?.country_name;
            response["COUNTRY_CODE"] = user?.country_code;
            response["STATE_ID"] = user?.state_id;
            response["STATE_NAME"] = user?.state_name;
            response["BOARD_ID"] = user?.board_id;
            response["BOARD_NAME"] = user?.board_name;
            response["BATCH_NAME"] = user?.batch_name;
            response["PASSWORD_CHANGED"] = user?.password_changed;
            response["DEVICE_ID"] = user?.device_id;
            response["UNIQUE_ID"] = user?.device_id;
            response["SUCCESS"] = loginStatus;
            response["AUTH_TOKEN"] = token;

            // Utils.sendSMS(9049186803, 'Hello')
            logger.info("Login API Response :: ", response);
            res.status(200).send(response);
        } catch (err) {
            logger.error("User Login Error :: ", err.message);
            next(err);
        }
    }

    static async resentOpt(req, res, next) {
        try {
            let response: object = {};
            let username = req?.body?.user;
            let emailMobile = req?.body?.email_mobile;
            let countryCode = req?.body?.country_code;
            let sendStatus = 0;
            let newOtp = await Utils.genericVerificationToken();
            let msg = `Your eGaneet OTP is ${newOtp} Ref: eBkhf51XYjX`;
            let data = emailMobile == EMAIL ? [username] : [countryCode, username];
            let user = await getUserDetailsByType(emailMobile, data);
            console.log("user Data", user);
            if (user) {
                let userId = user.id;
                let email = user.email;
                let mobile = user.mobile;
                let role = user.role;

                if (role === USER_ROLE.ROLE_USER_STUDENT) {
                    let authDetails = await getUserOtpAuth([userId]);
                    if (authDetails) {
                        await updateNewOtp(emailMobile, [newOtp, userId]);
                    } else {
                        await addNewOtpEntry([userId, newOtp, newOtp]);
                    }
                    let status = ''
                    // let status =
                    //     emailMobile === EMAIL
                    //         ? await Utils.sendMailtoUser(email, msg)
                    //         : await Utils.sendSMS(mobile, msg);
                    logger.info("Send Email/SMS ::", status);
                    sendStatus = 1;
                    response["SUCCESS"] = sendStatus;
                    response["statusCode"] = 200;
                    res.status(200).send(response);
                } else {
                    sendStatus = 2;
                    response["SUCCESS"] = sendStatus;
                    response["statusCode"] = 401;
                    res.status(401).send(response);
                }
            } else {
                let validStatus = 0;
                let result = await getSignupUser(emailMobile, [username]);
                console.log("result ::", result);
                if (result) {
                    validStatus = emailMobile == EMAIL ? 10 : 11;
                }

                response["SUCCESS"] = validStatus == 0 ? 2 : validStatus;
                response["statusCode"] = 401;
                res.status(401).send(response);
            }
        } catch (error) {
            next(error.message);
        }
    }

    static async verifyOtp(req, res, next) {
        try {
            let username = req?.body?.user;
            let emailMobile = req?.body?.email_mobile;
            let otp = req?.body?.otp;
            let countryCode = req?.body?.country_code;
            let forOtpPass = req?.body?.for_otp_pass;
            let loginStatus = 0;
            let response = {};

            let data = emailMobile == EMAIL ? [username] : [countryCode, username];
            let user = await getUserDetailsByType(emailMobile, data);
            if (user) {
                let userId = user?.id;
                let firstName = user?.firstname;
                let lastName = user?.lastname;
                let userStatus = user?.user_status;
                if (forOtpPass === OTP) {
                    if (
                        userStatus == USER_STATUS.INVITED ||
                        userStatus == USER_STATUS.ACTIVE
                    ) {
                        await getAuthenticateDetails([userId]);
                        let validateDetails = await checkOtpValidate(emailMobile, [
                            userId,
                            otp,
                        ]);
                        if (validateDetails) {
                            loginStatus = 1;
                        } else {
                            loginStatus = 7;
                        }
                    } else if (userStatus === USER_STATUS.REGISTERED) {
                        loginStatus = 8;
                    }
                }

                if (loginStatus === 1) {
                    response["USER_ID"] = userId;
                    response["FIRST_NAME"] = firstName;
                    response["LAST_NAME"] = lastName;
                    response["SUCCESS"] = 1;
                    response["statusCode"] = 200;
                    return res.status(200).send(response);
                } else if (loginStatus == 3) {
                    response["SUCCESS"] = 3;
                    response["statusCode"] = 401;
                    return res.status(401).send(response);
                } else if (userStatus == USER_STATUS.INVITED) {
                    response["SUCCESS"] = 4;
                    response["statusCode"] = 401;
                    return res.status(401).send(response);
                }
                response["SUCCESS"] = loginStatus;
                response["statusCode"] = 401;
                return res.status(401).send(response);
            } else {
                response["SUCCESS"] = 0;
                response["statusCode"] = 404;
                response["message"] = "User not found.";
                return res.status(404).send(response);
            }
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        try {
            let userId = req?.body?.user_id;
            let api_key = req?.body?.api_key;
            let forOtpPass = req?.body?.for_otp_pass;
            let oldPass = req?.body?.Oldpass;
            let newPass = req?.body?.newpass;
            let response = {};
            let tokenDetails = await getAccessTokenOrUpdate([userId]);
            let expires = tokenDetails?.expires;
            let expireTimestamp = Math.floor(new Date(expires).getTime());
            let currentTimestamp = Math.floor(new Date().getTime());
            let statusAPI;
            let passStatus = 0;
            let hasPassword = await Utils.encryptPassword(newPass);
            if (!userId) {
                return res.status(401).send({
                    statusCode: 401,
                    SUCCESS: 0,
                    message: "User id ",
                });
            }
            if (currentTimestamp > expireTimestamp) {
                let fields = {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: "password",
                    password: "password",
                    username: userId,
                };
                statusAPI = await httpService.axiosPostCall(TOKEN_API, null, fields);
            }
            if (statusAPI && api_key === API_KEY) {
                let user = await isExistUser([userId]);

                if (user) {
                    let role = user?.role;
                    if (
                        role === USER_ROLE.ROLE_USER_PARENT ||
                        role === USER_ROLE.ROLE_USER_STUDENT ||
                        role === USER_ROLE.ROLE_USER_TEACHER
                    ) {
                        if (forOtpPass == OTP) {
                            passStatus = 1;
                            await updateUserStatus([USER_STATUS.ACTIVE, userId]);
                            await updateUserRegistrationStatus([USER_STATUS.ACTIVE, userId]);

                            let userAuthDetails = await getAuthenticateDetails([userId]);

                            if (userAuthDetails) {
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
                        } else {
                            let userAuth = await getAuthenticateDetails([userId]);
                            let userPassword: any = userAuth?.password;
                            if (userAuth) {
                                let isMatch = await Utils.comparePassword({
                                    plainPassword: oldPass,
                                    encryptedPassword: userPassword,
                                });
                                if (isMatch) {
                                    passStatus = 1;
                                    await updatePassword([hasPassword, 1, userId, userId]);
                                    await updateUserStatus([USER_STATUS.ACTIVE, userId]);
                                    await updateUserRegistrationStatus([
                                        USER_STATUS.ACTIVE,
                                        userId,
                                    ]);
                                } else {
                                    passStatus = 3;
                                }
                            } else {
                                passStatus = 2;
                            }
                        }
                    }
                    if (passStatus != 1) {
                        return res.status(401).send({
                            statusCode: 401,
                            SUCCESS: passStatus,
                        });
                    } else {
                        return res.status(200).send({
                            statusCode: 200,
                            SUCCESS: passStatus,
                        });
                    }
                } else {
                    response["SUCCESS"] = 2;
                    response["message"] = "User not found.";
                    return res.status(404).send(response);
                }
            }
        } catch (err) {
            next(err);
        }
    }

    /**
     * @function updateProfile 
     * @param req 
     * @param res 
     * @param next 
     * @description use for update profile photo
     */
    static async updateProfile(req, res, next) {
        let response = {}
        try {
            let userId = req?.user?.user_id
            let email = req?.user?.email
            let uploadDetails = req?.files[0]
            let sourcePath = uploadDetails?.path
            let filename = uploadDetails?.filename

            let profilePath
            console.log("Req Body ", req.files)

            if (uploadDetails) {
                let userDetails = await getUserDetailsByType(EMAIL, [email]);
                if (userDetails) {
                    let role = userDetails?.role
                    if (role === USER_ROLE.ROLE_USER_STUDENT) {
                        profilePath = sourcePath;
                    } else if (role === USER_ROLE.ROLE_USER_TEACHER) {
                        profilePath = './photo_eganeet/profile_images_teacher/' + filename;
                        Utils.moveFile(sourcePath, profilePath, './photo_eganeet/profile_images_teacher/')
                    } else if (role === USER_ROLE.ROLE_USER_PARENT) {
                        profilePath = './photo_eganeet/profile_images_parent/' + filename;
                        Utils.moveFile(sourcePath, profilePath, './photo_eganeet/profile_images_parent/')
                    }
                    await updateProfilePhoto([profilePath, userId])
                    let userDetailsupdate = await getUserDetailsByType(EMAIL, [email]);
                    response['SUCCESS'] = 1
                    response['code'] = 200
                    response['PROFILE_PHOTO'] = userDetailsupdate?.profile_photo

                } else {
                    response['SUCCESS'] = 0
                    response['code'] = 400
                }
                res.send(response)
            }


        } catch (err) {
            logger.error("updateProfile Error :: ", err)
            response['SUCCESS'] = 0
            response['code'] = 400
            res.send(response)
        }


    }
}
