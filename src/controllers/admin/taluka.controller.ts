
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { addTaluka, deleteTaluka, getTaluka, getTalukaList, updateTaluka } from "../../services/admin/taluka.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";

export class taluka {
    static async addTaluka(req, res, next) {
        let districtId = req?.body?.district_id;
        let talukaName = req?.body?.taluka_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaName];
        addTaluka(params).then((result) => {
            if( result === "exists") {
                console.log('test');
                _409(res, talukaName+' taluka Already Exists')
            } else if( result == null) {
                _400(res, talukaName+' taluka Not Added')
            }else{
                _201(res, talukaName+' taluka Added Successfully')
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

    static async getTalukatList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        getTalukaList({ limit: limit, offset: offset }).then((result) => {
            if (result) {
                response['data'] = result;
                response['page'] = page;
                response['limit'] = limit;
                _200(res, 'Taluka list found successfully', response)
            } else {
                _400(res, 'Taluka list not found')
            }
        }).catch((error) => {

            logger.error("getTalukaList :: ", error);
            _400(res, 'Taluka list not found')
        });
    }

    static async updateTaluka(req, res, next) {
        let talukatId = req?.body?.taluka_id;
        let districtId = req?.body?.district_id;
        let talukaName = req?.body?.taluka_name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaName, talukatId];
        getTaluka([talukatId]).then((result) => {
            if (!result) {
                return _404(res, 'Taluka Not Found');
            }
            updateTaluka(params).then((result) => {
                if( result === "exists") {
                    _409(res, talukaName+' Taluka already exists. Please choose another taluka name')
                } else if( result == null) {
                     _400(res, 'Taluka Not Updated')
                }else{
                    _200(res, talukaName+ ' Taluka Updated Successfully');
                }
            }).catch((err) => {

                logger.error("updateTaluka :: ", err)
                _400(res, 'Taluka Not Updated')
            });
        }).catch((error) => {
            logger.error("updateTaluka :: ", error);
            _404(res, 'Taluka Not Found');
        });
    }

    static async deleteTaluka(req: any, res: any, next: any) {
        let talukatId = req?.params?.id;
        getTaluka([talukatId]).then((result) => {
            if (!result) {
                return _404(res, 'Taluka Not Found');
            }

            deleteTaluka([talukatId]).then((result) => {
                if (result) {
                    _200(res, 'Taluka deleted successfully');
                } else {
                    _400(res, 'Taluka not deleted');
                }
            }).catch((error) => {
                logger.error("deleteTaluka :: ", error);
                _400(res, 'Taluka not deleted');
            });
        }).catch((error) => {
            logger.error("deleteTaluka :: ", error);
            _404(res, 'Taluka not found');
        });
    }
}