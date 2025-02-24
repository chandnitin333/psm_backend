
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { addGatGramPanchayat, deleteGatGramPanchayat, getGatGramPanchayat, getGatGramPanchayatList, getGatGrampanchayatByPanchayatId, getGrampanchayatByTalukaId, updateGatGramPanchayat } from "../../services/admin/gatgrampanchayat.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";

export class gatgrampanchayat {
    static async addGatGramPanchayat(req, res, next) {
        console.log("reqBody",req.body)
        let districtId = req?.body?.district_id;
        let talukaid = req?.body?.taluka_id;
        let grampanchayatId = req?.body?.grampanchayat_id;
        let gatgramPanchayatName = req?.body?.name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaid, grampanchayatId, gatgramPanchayatName];
        const isAnyValueEmpty = params.some(
            (param) => param === null || param === undefined || param === ''
        );

        console.log("=====",isAnyValueEmpty);
        if (isAnyValueEmpty) {
            return _400(res, ' सर्व फील्ड आवश्यक आहेत')
        } 
        addGatGramPanchayat(params).then((result) => {
            if (result === "exists") {
                _409(res, gatgramPanchayatName + ' गटग्रामपंचायत आधीच अस्तित्वात आहे')
            } else if (result == null) {
                _400(res, gatgramPanchayatName + ' गटग्रामपंचायत जोडलेली नाही')
            } else {
                _201(res, gatgramPanchayatName + ' गटग्रामपंचायत यशस्वीरित्या जोडली')
            }
        }
        ).catch((error) => {
            logger.error("addGatGramPanchayat :: ", error)
            _400(res, 'गटग्रामपंचायत जोडलेली नाही')
        });
    }

    static async getGatGramPanchayat(req, res, next) {
        let gatgrampanchayatId = req?.params?.id;
        let response = {};
        getGatGramPanchayat([gatgrampanchayatId]).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'गटग्रामपंचायत यशस्वीरित्या सापडली', response)
            } else {
                _404(res, 'गटग्रामपंचायत सापडली नाही')
            }
        }).catch((error) => {
            logger.error("getGatGramPanchayat :: ", error)
            _404(res, 'गटग्रामपंचायत सापडली नाही')
        });
    }

    static async getGatGramPanchayatList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        let searchText = req?.body?.search_text || '';
        getGatGramPanchayatList({ limit: limit, offset: offset, searchText: searchText }).then((result) => {
            if (result) {

                response['totalRecords'] = result?.total_count ?? 0;
                response['limit'] = limit;
                response['page'] = page;
                response['data'] = result?.data;
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
        let params = [districtId, talukaId, grampanchayatId, gatgramPanchayatName, gatgrampanchayatId];
        getGatGramPanchayat([gatgrampanchayatId]).then((result) => {
            if (!result) {
                return _400(res, 'गटग्रामपंचायत सापडली नाही');
            }
            updateGatGramPanchayat(params).then((result) => {
                if (result === "exists") {
                   return _409(res, `${gatgramPanchayatName} गटग्रामपंचायत आधीच अस्तित्वात आहे. कृपया दुसरे गटग्रामपंचायत नाव निवडा`)
                } else if (result == null) {
                   return _400(res, 'गटग्रामपंचायत सापडली नाही')
                } else {
                    return _200(res, gatgramPanchayatName + ' गटग्रामपंचायत यशस्वीरित्या अद्यतनित केली');
                }
            }).catch((err) => {

                logger.error("updateGatGramPanchayat :: ", err)
                return _400(res, 'गटग्रामपंचायत अद्ययावत नाही')
            });
        }).catch((error) => {
            logger.error("updateGatGramPanchayat :: ", error);
            return _404(res, 'गटग्रामपंचायत सापडली नाही');
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
                   return  _200(res, 'GatGrampanchayat deleted successfully');
                } else {
                   return _400(res, 'GatGramPanchayat not deleted');
                }
            }).catch((error) => {
                logger.error("deleteGatGrampanchayat :: ", error);
                return _400(res, 'GatGramPanchayat not deleted');
            });
        }).catch((error) => {
            logger.error("deleteGatGramPanchayat :: ", error);
           return _404(res, 'GatGramPanchayat not found');
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
               return _200(res, 'Grampanchayat list found successfully', response)
            } else {
               return _400(res, 'Grampanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGrampanchayatList :: ", error);
           return  _400(res, 'Grampanchayat list not found')
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
               return _200(res, 'GatGrampanchayat list found successfully', response)
            } else {
               return _400(res, 'GatGrampanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGatGrampanchayatList :: ", error);
           return _400(res, 'GatGrampanchayat list not found')
        });
    }
}