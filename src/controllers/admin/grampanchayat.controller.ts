
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { addGramPanchayat, deleteGramPanchayat, getGramPanchayat, getGramPanchayatList, updateGramPanchayat } from "../../services/admin/grampanchayat.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";

export class grampanchayat {
    static async addGramPanchayat(req, res, next) {
        let districtId = req?.body?.district_id;
        let talukaid = req?.body?.taluka_id;
        let gramPanchayatName = req?.body?.name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaid, gramPanchayatName];
        addGramPanchayat(params).then((result) => {
            if (result === "exists") {
                _409(res, gramPanchayatName + ' Gram Panchayat Already Exists')
            } else if (result == null) {
                _400(res, gramPanchayatName + ' Gram Panchayat Not Added')
            } else {
                _201(res, gramPanchayatName + ' Gram Panchayat Added Successfully')
            }
        }
        ).catch((error) => {
            logger.error("addGramPanchayat :: ", error)
            _400(res, 'Gram Panchayat Not Added')
        });
    }

    static async getGramPanchayat(req, res, next) {
        let grampanchayatId = req?.params?.id;
        let response = {};
        getGramPanchayat([grampanchayatId]).then((result) => {
            if (result) {
                response['data'] = result;
                _200(res, 'GramPanchayat Found Successfully', response)
            } else {
                _404(res, 'GramPanchayat Not Found')
            }
        }).catch((error) => {
            logger.error("getGramPanchayat :: ", error)
            _404(res, 'GramPanchayat Not Found')
        });
    }

    static async getGramPanchayatList(req, res, next) {
        let response = {};
        let page = parseInt(req.body.page_number) || 1;
        let limit = PAGINATION.LIMIT || 10;
        let offset = (page - 1) * limit;
        let searchText = req?.body?.search_text || '';
        getGramPanchayatList({ limit: limit, offset: offset, searchValue: searchText }).then((result) => {
            if (result) {
                response['totalRecords'] = result?.total_count;
                response['limit'] = limit;
                response['page'] = page;
                response['data'] = result?.data;
                _200(res, 'GramPanchayat list found successfully', response)
            } else {
                _400(res, 'GramPanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGramPanchayat :: ", error);
            _400(res, 'GramPanchayat list not found')
        });
    }

    static async updateGramPanchayat(req, res, next) {
        let grampanchayatId = req?.body?.grampanchayat_id;
        let districtId = req?.body?.district_id;
        let talukaId = req?.body?.taluka_id;
        let gramPanchayatName = req?.body?.name;
        let response = {};
        let currentTimestamp = Math.floor(new Date().getTime());
        let params = [districtId, talukaId, gramPanchayatName, grampanchayatId];
        getGramPanchayat([grampanchayatId]).then((result) => {
            if (!result) {
                return _404(res, 'Grampanchayat Not Found');
            }
            updateGramPanchayat(params).then((result) => {
                if (result === "exists") {
                    _409(res, gramPanchayatName + ' Grampanchayat already exists. Please choose another gram panchayat name')
                } else if (result == null) {
                    _400(res, 'GramPanchayat Not Updated')
                } else {
                    _200(res, gramPanchayatName + ' GramPanchayat Updated Successfully');
                }
            }).catch((err) => {

                logger.error("updateGramPanchayat :: ", err)
                _400(res, 'GramPanchayat Not Updated')
            });
        }).catch((error) => {
            logger.error("updateGramPanchayat :: ", error);
            _404(res, 'GramPanchayat Not Found');
        });
    }

    static async deleteGramPanchayat(req: any, res: any, next: any) {
        let grampanchayatId = req?.params?.id;
        getGramPanchayat([grampanchayatId]).then((result) => {
            if (!result) {
                return _404(res, 'Grampanchayat Not Found');
            }

            deleteGramPanchayat([grampanchayatId]).then((result) => {
                if (result) {
                    _200(res, 'Grampanchayat deleted successfully');
                } else {
                    _400(res, 'GramPanchayat not deleted');
                }
            }).catch((error) => {
                logger.error("deleteGrampanchayat :: ", error);
                _400(res, 'GramPanchayat not deleted');
            });
        }).catch((error) => {
            logger.error("deleteGramPanchayat :: ", error);
            _404(res, 'GramPanchayat not found');
        });
    }
}