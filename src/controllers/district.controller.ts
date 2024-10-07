
import { PAGINATION } from "../constants/constant";
import { logger } from "../logger/Logger";
import {
    addDistrict,
    deleteDistrict,
    getDistrict,
    getDistrictList,
    updateDistrict,
} from "../services/district.service";
import { _200, _201, _400, _404 } from "../utils/ApiResponse";




export class district {


    static async addDistrict(req, res, next) {
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());


        addDistrict([districtName, currentTimestamp]).then((result) => {
            if (result) {

                _201(res, 'District Added Successfully')
            } else {

                _400(res, 'District Not Added')
            }
        }
        ).catch((error) => {

            logger.error("addDistrict :: ", error)
            _400(res, 'District Not Added')
        });
    }

    static async getDistrict(req, res, next) {

        let districtId = req?.params?.id;
        let response = {};
        getDistrict([districtId]).then((result) => {
            if (result) {

                response['data'] = result;
                _200(res, 'District Found Successfully', response)
            } else {
                _404(res, 'District Not Found')
            }
        }).catch((error) => {

            logger.error("getDistrict :: ", error)
            _404(res, 'District Not Found')

        });
    }


    static async getDistrictList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        getDistrictList({ limit: limit, offset: offset }).then((result) => {
            if (result) {


                response['data'] = result;
                response['page'] = page;
                response['limit'] = limit;
                _200(res, 'District List Found Successfully', response)
            } else {
                _400(res, 'District List Not Found')
            }
        }).catch((error) => {

            logger.error("getDistrictList :: ", error);
            _400(res, 'District List Not Found')
        });
    }

    static async updateDistrict(req, res, next) {
        let districtId = req?.body?.district_id;
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        getDistrict([districtId]).then((result) => {
            if (!result) {
                return _404(res, 'District Not Found');
            }
            updateDistrict([districtName, districtId]).then((result) => {
                if (result) {
                    _200(res, 'District Updated Successfully');
                } else {
                    _400(res, 'District Not Updated')
                }
            }).catch((err) => {

                logger.error("updateDistrict :: ", err)
                _400(res, 'District Not Updated')
            });
        }).catch((error) => {
            logger.error("updateDistrict :: ", error);
            _404(res, 'District Not Found');
        });
    }

    static async deleteDistrict(req: any, res: any, next: any) {
        let districtId = req?.params?.id;
        getDistrict([districtId]).then((result) => {
            if (!result) {
                return _404(res, 'District Not Found');
            }

            deleteDistrict([districtId]).then((result) => {
                if (result) {
                    _200(res, 'District Deleted Successfully');
                } else {
                    _400(res, 'District Not Deleted');
                }
            }).catch((error) => {
                logger.error("deleteDistrict :: ", error);
                _400(res, 'District Not Deleted');
            });
        }).catch((error) => {
            logger.error("deleteDistrict :: ", error);
            _404(res, 'District Not Found');
        });
    }



}