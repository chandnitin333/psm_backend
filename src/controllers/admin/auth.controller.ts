

import * as Jwt from "jsonwebtoken";
import { ADMIN_EMAIL } from "../../constants/constant";
import { getEnvironmentVariable } from "../../environments/env";
import { isUserExists } from "../../services/admin/auth.service";
import { _200, _400, _401, _404 } from "../../utils/ApiResponse";

export class AuthController {


    static async authenticate(req: any, res: any, next: any) {
        try {
            let userId = req?.body?.user_id;
            let password = req?.body?.password;
            if (!userId) {
                return _404(res, 'User Id is required');
            }
            if (!password) {
                return _404(res, 'password is required');
            }
            let userDetails = await isUserExists([userId]);

            if (password !== userDetails?.pwd) {
                return _401(res, 'Authentication Failed1');
            }
            if (userDetails) {
                let params = {
                    userId: userDetails.user_id,
                    emailId: userDetails?.email_id || ADMIN_EMAIL,
                }
                const token = Jwt.sign(params, getEnvironmentVariable().jwt_secret, {
                    expiresIn: "120d",
                });
                let response: any = {};
                response['data'] = { token: token, username: userDetails.user_id };
                return _200(res, 'Authentication Successfully', response);
            } else {
                return _401(res, 'Authentication Failed')
            }
        } catch (err) {
            return _400(res, 'Authentication Failed');
        }

    }





}