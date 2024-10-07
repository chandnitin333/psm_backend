
import { PAGINATION } from "../constants/constant";
import { logger } from "../logger/Logger";
import {
    addDistrict,
    deleteDistrict,
    getDistrict,
    getDistrictList,
    updateDistrict,
} from "../services/district.service";




export class district {


    static async addDistrict(req, res, next) {
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());


        addDistrict([districtName, currentTimestamp]).then((result) => {
            if (result) {
                response['SUCCESS'] = 1
                response['code'] = 200
                res.status(200).send(response)
            } else {
                response['SUCCESS'] = 0
                response['code'] = 400
                res.status(400).send(response)
            }
        }
        ).catch((error) => {
            response['SUCCESS'] = 0
            response['code'] = 400
            logger.error("addDistrict :: ", error)
            res.status(400).send(response)
        });
    }

    static async getSingleDistrict(req, res, next) {
    
        let districtId = req?.params?.id;
        console.log("districtId",districtId)
        let response = {};
        getDistrict([districtId]).then((result) => {
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


    static async getAllDistrictList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        getDistrictList({limit:limit, offset:offset}).then((result) => {
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

    static async updateDistrict(req, res, next) {
        let districtId = req?.body?.district_id;
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        updateDistrict([districtName,districtId]).then((result) => {
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

    static async deleteDistrict(req, res, next) {
        let districtId = req?.params?.id;
        let response = {};
        deleteDistrict([districtId]).then((result) => {
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