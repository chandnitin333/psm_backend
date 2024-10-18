import * as Bcrypt from "bcrypt";
import { configData } from '../environments/env';
import { httpService } from "../helper/httpService";
import { logger } from "../logger/Logger";
let dateTime = require('node-datetime');
const sendmail = require('sendmail')();

const fs = require('fs')
export class Utils {

    /**
     * @function selectQuery use for generate Select query
     * @param params 
     * @param conditions 
     * @param tableName 
     * @param selectFields 
     */
    static async selectQuery(params: any, conditions: any, tableName: string, selectFields: any = ['*']) {
        let sel = `SELECT ${selectFields.join()}  WHERE `

    }
    static async insertQuery(params: any, tableName: string) {

    }

    static async updateQuery(params: any, conditions: any, tableName: string) {

    }
    static async deleteQuery(params: any, conditions: any, tableName: string) {

    }





    static async genericVerificationToken(size = 4) {
        let digit = "0123456789";

        let otp: number = Math.floor(1000 + Math.random() * 9000);

        return (otp);
    }


    static async encryptPassword(password) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (async (err, hash) => {

                if (err) {
                    reject(err);
                } else {
                    hash = hash.replace('$2b$', '$2y$');
                    resolve(hash);
                }

            }));


        });
    }


    static async comparePassword(password: { plainPassword: string, encryptedPassword: string }): Promise<any> {
        try {


            return new Promise((resolve, reject) => {
                let encryptedPassword = password.encryptedPassword.replace('$2y$', '$2b$');
                Bcrypt.compare(password.plainPassword, encryptedPassword, ((err, isSame) => {
                    if (err) {
                        reject(err)
                    } else if (!isSame) {
                        reject(new Error("User and Password does not match"));
                    } else {
                        resolve(true);
                    }
                }));
            })
        } catch (error) {
            console.log("comparPassword Error ::", error)
        }
    }

    static async getCurrentDate(formate: string = 'Y-m-d H:M:S') {
        return new Promise((resolve, reject) => {
            try {
                var dt = dateTime.create();
                var formatted = dt.format(formate);
                resolve(formatted)
            } catch (error) {
                reject(error)
            }

        })

    }



    static async sendMailtoUser(userEmail, htmlBody) {
        try {
            sendmail({
                from: 'info@eganeet.net',
                to: userEmail,
                subject: 'test sendmail',
                html: htmlBody,
                replyTo: 'info@eganeet.net'
            }, function (err, reply) {
                console.log(err && err.stack);
                console.log("sendMailtoUser", reply);
                if (!err) {
                    logger.info("sendMailtoUser Response ", reply)
                    return reply;
                }
                logger.error("sendMailtoUser Error", reply)

            });
        } catch (error) {
            throw new Error(error.message)
        }

    }


    static async sendSMS(mobile: number, message: string) {
        try {
            let baseUrl = configData().sms.url
            let userid = configData().sms.userid
            let password = configData().sms.password
            let sender = configData().sms.sender
            let peid = configData().sms.peid
            let tpid = configData().sms.tpid
            let apiUrl = `${baseUrl}?userid=${userid}&password=${password}&sender=${sender}&mobileno=${mobile}&msg=${message}&msgtype=0&peid=${peid}&tpid=${tpid}`;
            let status = await httpService.axiosGetCall(apiUrl)
            console.info("sendSMS Status::", status)
            logger.info("sendSMS Status::", status)
            return status
        } catch (err) {
            logger.error("sendSMS Error", err)
            throw new Error(err.message)
        }

    }

    static async moveFile(sourcePath: string, destinationPath: string, subdirectory: string): Promise<void> {
        await fs.promises.mkdir(subdirectory, { recursive: true })
        return new Promise((resolve, reject) => {

            fs.rename(sourcePath, destinationPath, (err) => {
                if (err) {
                    reject(err);
                } else {

                    resolve();
                }
            });
        });
    }

    static async deleteFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static async getCurrentDateTime() {
        return new Date(Date.now()).toISOString().replace('T', ' ').split('.')[0];
    }

    static validateRequestBody = (body: any, requiredFields: string[]): string | null => {
        for (const field of requiredFields) {
            if (!body[field]) {
                return `Field ${field} is required`;
            }
        }
        return null;
    };

}


