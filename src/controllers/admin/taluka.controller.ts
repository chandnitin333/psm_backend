
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import {
    addDistrict,
    deleteDistrict,
    getDistrict,
    getDistrictList,
    updateDistrict,
} from "../../services/admin/district.service";
import { addTaluka, getTaluka } from "../../services/admin/taluka.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";

export class taluka {
    static async addTaluka(req, res, next) {
        let districtId = req?.body?.district_id;
        let talukaName = req?.body?.district_id;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaName];
        addTaluka(params).then((result) => {
            if (result) {
                _201(res, talukaName+' taluka Added Successfully')
            } else {
                _400(res, talukaName+' taluka Not Added')
            }
        }
        ).catch((error) => {
            logger.error("addTaluka :: ", error)
            _400(res, 'Taluka Not Added')
        });
    }

    static async getTaluka(req, res, next) {
        let talukaId = req?.params?.id;
        let response = {};
        getTaluka([talukaId]).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'Taluka Found Successfully', response)
            } else {
                _404(res, 'Taluka Not Found')
            }
        }).catch((error) => {
            logger.error("getTaluka :: ", error)
            _404(res, 'Taluka Not Found')
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