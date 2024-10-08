
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { getTotalCount } from "../../services/admin/auth.service";
import {
    addDistrict,
    deleteDistrict,
    getDistrict,
    getDistrictList,
    getDistrictListForDDL,
    updateDistrict,
} from "../../services/admin/district.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";

export class district {
    static async addDistrict(req, res, next) {
        let districtName = req?.body?.district_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtName];
        addDistrict(params).then((result) => {
            if( result === "exists") {
                _409(res, districtName+' District Already Exists')
            } else if( result == null) {
                _400(res, 'District Not Added')
            }else{
                _201(res, districtName+' District Added Successfully')
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
        let totalCount =  await  getTotalCount(['district']);
        getDistrictList({ limit: limit, offset: offset }).then((result) => {
            if (result) {
                response['totalRecords'] = totalCount?.total_count;
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
                if( result === "exists") {
                    _409(res, districtName+' District Already Exists. Please choose another district name')
                } else if( result == null) {
                     _400(res, 'District Not Updated')
                }else{
                    _200(res, districtName+ ' District Updated Successfully');
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

    static async getAllDistrictDDL(req: any, res: any, next: any) {
        let response = {};
        let params = [];
        // console.log("Test",params);
        getDistrictListForDDL(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'District list found successfully', response)
            } else {
                _400(res, 'District list not found')
            }
        }).catch((error) => {

            logger.error("getDistrictList :: ", error);
            _400(res, 'District list not found')
        });
    }
}