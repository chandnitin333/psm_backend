
import { validationResult } from "express-validator";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../environments/env";

import multer = require('multer');

export class GlobalMiddleware {
    static checkError(req, res, next) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            next(new Error(error.array()[0].msg))

        } else {
            next();
        }
    }

    static async authenticate(req, res, next) {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        try {

            req.errorStatus = 401;
            jwt.verify(token, getEnvironmentVariable().jwt_secret, ((err, decoded) => {
                if (err) {
                    next(err);
                } else if (!decoded) {
                    next(new Error('User Not Authorized'));
                } else {
                    req.user = decoded;
                    next();
                }
            }))
            next(); // just for this time

        } catch (error) {

            next(error);
        }
    }



    static async uploadFiles(req, res, next) {
        try {
            const multerStorage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, "uploads/");
                },
                filename: (req, file, cb) => {
                    const ext = file.mimetype.split("/")[1];
                    cb(null, `/rd_ad-${file.fieldname}-${Date.now()}.${ext}`);
                },
            });

            const multerFilter = (req, file, cb) => {
                if (file.mimetype.split("/")[1] != "pdf") {
                    cb(null, true);
                } else {
                    cb(new Error("Not a PDF File!!"), false);
                }
            };

            const upload = multer({
                storage: multerStorage,
                fileFilter: multerFilter,
            });

            const uploadFiless = upload.single("mediafile");
            console.log("gettttt", uploadFiless);
            if (uploadFiless) {
                next();
            }
        } catch (ex) {
            next(ex);
        }
    }


}