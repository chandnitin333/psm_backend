
import { PAGINATION } from "../constants/constant";
import { logger } from "../logger/Logger";
import { addTaluka, deleteTaluka, getTaluka, getTalukaList, updateTaluka } from "../services/taluka.service";

export class taluka {
    static async addTaluka(req, res, next) {
        let districtId = req?.body?.district_id;
        let talukaName = req?.body?.taluka_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaName];
        addTaluka(params).then((result) => {
            if (result) {
                response = {
                    "success": 1,
                    "code": 200,
                    "message": talukaName+" Taluka added successfully"
                } 
                // response['SUCCESS'] = 1
                // response['code'] = 200
                // response['message'] = talukaName+" Taluka added successfully"
                res.status(200).send(response)
            } else {
                response = {
                    "success": 0,
                    "code": 400,
                    "message": "Something wrong to insert taluka: "+talukaName
                }
                // response['SUCCESS'] = 0
                // response['code'] = 400
                // response['message'] = "Something wrong to insert taluka: "+talukaName
                res.status(400).send(response)
            }
        }
        ).catch((error) => {
            response = {
                "success": 0,
                "code": 400,
                "message": error
            }
            // response['SUCCESS'] = 0
            // response['code'] = 400
            logger.error("addDistrict :: ", error)
            res.status(400).send(response)
        });
    }

    static async getTaluka(req, res, next) {
    
        let districtId = req?.params?.id;
        console.log("districtId",districtId)
        let response = {};
        getTaluka([districtId]).then((result) => {
            if (result) {

                response['SUCCESS'] = 1
                response['code'] = 200
                response['data'] = result
                res.status(200).send(response)
            } else {
                response['SUCCESS'] = 0
                response['code'] = 400
                res.status(400).send(response)
            }
        }).catch((error) => {
            response['SUCCESS'] = 0
            response['code'] = 400
            logger.error("getDistrict :: ", error)
            res.status(400).send(response)
        });
    }

    static async getTalukaList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        getTalukaList({limit:limit, offset:offset}).then((result) => {
            if (result) {
                response['SUCCESS'] = 1;
                response['code'] = 200;
                response['data'] = result;
                response['page'] = page;
                response['limit'] = limit;
                res.status(200).send(response);
            } else {
                response['SUCCESS'] = 0;
                response['code'] = 400;
                res.status(400).send(response);
            }
        }).catch((error) => {
            response['SUCCESS'] = 0;
            response['code'] = 400;
            logger.error("getDistrictList :: ", error);
            res.status(400).send(response);
        });
    }

    static async updateTaluka(req, res, next) {
        let districtId = req?.body?.district_id;
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        updateTaluka([districtName,districtId]).then((result) => {
            if (result) {
                response['SUCCESS'] = 1
                response['code'] = 200
                res.status(200).send(response)
            } else {
                response['SUCCESS'] = 0
                response['code'] = 400
                res.status(400).send(response)
            }
        }).catch((error) => {
            response['SUCCESS'] = 0
            response['code'] = 400
            logger.error("updateDistrict :: ", error)
            res.status(400).send(response)
        });
    }

    static async deleteTaluka(req, res, next) {
        let districtId = req?.params?.id;
        let response = {};
        deleteTaluka([districtId]).then((result) => {
            if (result) {
                response['SUCCESS'] = 1
                response['code'] = 200
                res.status(200).send(response)
            } else {
                response['SUCCESS'] = 0
                response['code'] = 400
                res.status(400).send(response)
            }
        }).catch((error) => {
            response['SUCCESS'] = 0
            response['code'] = 400
            logger.error("deleteDistrict :: ", error)
            res.status(400).send(response)
        });
    }
}