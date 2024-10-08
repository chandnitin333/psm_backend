
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { getTotalCount } from "../../services/admin/auth.service";
import { addGatGramPanchayat, deleteGatGramPanchayat, getGatGramPanchayat, getGatGramPanchayatList, getGatGrampanchayatByPanchayatId, getGrampanchayatByTalukaId, updateGatGramPanchayat } from "../../services/admin/gatgrampanchayat.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";

export class gatgrampanchayat {
    static async addGatGramPanchayat(req, res, next) {
        let districtId = req?.body?.district_id;
        let talukaid = req?.body?.taluka_id;
        let grampanchayatId = req?.body?.grampanchayat_id;
        let gatgramPanchayatName = req?.body?.name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaid, grampanchayatId, gatgramPanchayatName];
        addGatGramPanchayat(params).then((result) => {
            if( result === "exists") {
                _409(res, gatgramPanchayatName+' GatGramPanchayat Already Exists')
            } else if( result == null) {
                _400(res, gatgramPanchayatName+' GatGramPanchayat Not Added')
            }else{
                _201(res, gatgramPanchayatName+' GatGramPanchayat Added Successfully')
            }
        }
        ).catch((error) => {
            logger.error("addGatGramPanchayat :: ", error)
            _400(res, 'GatGramPanchayat Not Added')
        });
    }

    static async getGatGramPanchayat(req, res, next) {
        let gatgrampanchayatId = req?.params?.id;
        let response = {};
        getGatGramPanchayat([gatgrampanchayatId]).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'GatGramPanchayat Found Successfully', response)
            } else {
                _404(res, 'GatGramPanchayat Not Found')
            }
        }).catch((error) => {
            logger.error("getGatGramPanchayat :: ", error)
            _404(res, 'GatGramPanchayat Not Found')
        });
    }

    static async getGatGramPanchayatList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        let totalCount =  await  getTotalCount(['gatgrampanchayat']);
        getGatGramPanchayatList({ limit: limit, offset: offset }).then((result) => {
            if (result) {
                response['totalRecords'] = totalCount?.total_count;
                response['limit'] = limit;
                response['page'] = page;
                response['data'] = result;
                _200(res, 'GatGramPanchayat list found successfully', response)
            } else {
                _400(res, 'GatGramPanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGatGramPanchayat :: ", error);
            _400(res, 'GatGramPanchayat list not found')
        });
    }

    static async updateGatGramPanchayat(req, res, next) {
        let gatgrampanchayatId = req?.body?.gatgrampanchayat_id;
        let districtId = req?.body?.district_id;
        let talukaId = req?.body?.taluka_id;
        let grampanchayatId = req?.body?.grampanchayat_id;
        let gatgramPanchayatName = req?.body?.name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaId,grampanchayatId, gatgramPanchayatName, gatgrampanchayatId];
        getGatGramPanchayat([gatgrampanchayatId]).then((result) => {
            if (!result) {
                return _404(res, 'GatGrampanchayat Not Found');
            }
            updateGatGramPanchayat(params).then((result) => {
                if( result === "exists") {
                    _409(res, gatgramPanchayatName+' GatGrampanchayat already exists. Please choose another gatgrampanchayat name')
                } else if( result == null) {
                     _400(res, 'GramPanchayat Not Updated')
                }else{
                    _200(res, gatgramPanchayatName+ ' GatGramPanchayat Updated Successfully');
                }
            }).catch((err) => {

                logger.error("updateGatGramPanchayat :: ", err)
                _400(res, 'GatGramPanchayat Not Updated')
            });
        }).catch((error) => {
            logger.error("updateGatGramPanchayat :: ", error);
            _404(res, 'GatGramPanchayat Not Found');
        });
    }

    static async deleteGatGramPanchayat(req: any, res: any, next: any) {
        let gatgrampanchayatId = req?.params?.id;
        getGatGramPanchayat([gatgrampanchayatId]).then((result) => {
            if (!result) {
                return _404(res, 'GatGrampanchayat Not Found');
            }

            deleteGatGramPanchayat([gatgrampanchayatId]).then((result) => {
                if (result) {
                    _200(res, 'GatGrampanchayat deleted successfully');
                } else {
                    _400(res, 'GatGramPanchayat not deleted');
                }
            }).catch((error) => {
                logger.error("deleteGatGrampanchayat :: ", error);
                _400(res, 'GatGramPanchayat not deleted');
            });
        }).catch((error) => {
            logger.error("deleteGatGramPanchayat :: ", error);
            _404(res, 'GatGramPanchayat not found');
        });
    }

    static async getGrampanchayatByTalukaId(req: any, res: any, next: any) {
        let talukaId = req?.body?.id;
        let response = {};
        let params = [talukaId];
        // console.log("Test",params);
        getGrampanchayatByTalukaId(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'Grampanchayat list found successfully', response)
            } else {
                _400(res, 'Grampanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGrampanchayatList :: ", error);
            _400(res, 'Grampanchayat list not found')
        });
    }
    static async getGatGrampanchayatByPanchayatId(req: any, res: any, next: any) {
        let gid = req?.body?.id;
        let response = {};
        let params = [gid];
        // console.log("Test",params);
        getGatGrampanchayatByPanchayatId(params).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'GatGrampanchayat list found successfully', response)
            } else {
                _400(res, 'GatGrampanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGatGrampanchayatList :: ", error);
            _400(res, 'GatGrampanchayat list not found')
        });
    }
}