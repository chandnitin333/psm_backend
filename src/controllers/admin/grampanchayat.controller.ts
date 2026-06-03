
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { addGramPanchayat, BANK_FIELDS, deleteGramPanchayat, getGramPanchayat, getGramPanchayatList, getPanchayatListForDDL, updateGramPanchayat } from "../../services/admin/grampanchayat.service";
import { _200, _201, _400, _404, _409 } from "../../utils/ApiResponse";
import multer = require("multer");
import * as fs from "fs";
import * as path from "path";

const SCANNER_UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(SCANNER_UPLOAD_DIR)) {
    fs.mkdirSync(SCANNER_UPLOAD_DIR, { recursive: true });
}

const scannerStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, SCANNER_UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = (file.mimetype.split("/")[1] || "bin").toLowerCase();
        cb(null, `psm-${file.fieldname}-${Date.now()}.${ext}`);
    },
});
const scannerMulter = multer({
    storage: scannerStorage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.split("/")[1] === "exe") {
            cb(new Error("Not an executable file!"));
            return;
        }
        cb(null, true);
    },
});
const taxScannerUpload = scannerMulter.fields([
    { name: 'ghar_tax_scanner', maxCount: 1 },
    { name: 'pani_tax_scanner', maxCount: 1 },
]);

function pickBankFields(req: any): any {
    const bank: any = {};
    for (const f of BANK_FIELDS) {
        // Frontend sends lowercase keys (e.g. ghar_bank_name).
        const lower = f.toLowerCase();
        if (req?.body && Object.prototype.hasOwnProperty.call(req.body, lower)) {
            bank[f] = req.body[lower];
        }
    }
    return bank;
}

function pickUploadedFilename(req: any, field: string): string | null {
    const filesObj = req?.files;
    if (filesObj && typeof filesObj === 'object' && !Array.isArray(filesObj)) {
        const arr = filesObj[field];
        if (Array.isArray(arr) && arr.length > 0) {
            return arr[0].filename || null;
        }
    } else if (Array.isArray(filesObj)) {
        const file = filesObj.find((f: any) => f?.fieldname === field);
        if (file?.filename) return file.filename;
    }
    return null;
}

export class grampanchayat {
    static async addGramPanchayat(req, res, next) {
        try {
            try {
                await new Promise<void>((resolve, reject) => {
                    taxScannerUpload(req, res, (err: any) => err ? reject(err) : resolve());
                });
            } catch (err: any) {
                logger.error("addGramPanchayat upload error :: ", err?.message || err);
                return _400(res, err?.message || 'File upload failed');
            }

            const districtId = req?.body?.district_id;
            const talukaid = req?.body?.taluka_id;
            const gramPanchayatName = req?.body?.name;
            const gharTaxScanner = pickUploadedFilename(req, 'ghar_tax_scanner');
            const paniTaxScanner = pickUploadedFilename(req, 'pani_tax_scanner');

            if (!districtId || !talukaid || !gramPanchayatName) {
                return _400(res, 'district_id, taluka_id and name are required');
            }

            const params = [districtId, talukaid, gramPanchayatName, gharTaxScanner, paniTaxScanner];
            const result = await addGramPanchayat(params, pickBankFields(req));
            if (result === "exists") {
                return _409(res, gramPanchayatName + ' Gram Panchayat Already Exists');
            }
            if (result == null) {
                return _400(res, gramPanchayatName + ' Gram Panchayat Not Added');
            }
            return _201(res, gramPanchayatName + ' Gram Panchayat Added Successfully');
        } catch (error: any) {
            logger.error("addGramPanchayat :: ", error?.message || error);
            return _400(res, error?.message || 'Gram Panchayat Not Added');
        }
    }

    static async getGramPanchayat(req, res, next) {
        let grampanchayatId = req?.params?.id;
        let response = {};
        getGramPanchayat([grampanchayatId]).then((result) => {
            if (result) {
                response['data'] = result;
                return _200(res, 'GramPanchayat Found Successfully', response)
            } else {
               return _404(res, 'GramPanchayat Not Found')
            }
        }).catch((error) => {
            logger.error("getGramPanchayat :: ", error)
            return _404(res, 'GramPanchayat Not Found')
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
               return _200(res, 'GramPanchayat list found successfully', response)
            } else {
               return _400(res, 'GramPanchayat list not found')
            }
        }).catch((error) => {

            logger.error("getGramPanchayat :: ", error);
           return _400(res, 'GramPanchayat list not found')
        });
    }

    static async updateGramPanchayat(req, res, next) {
        try {
            try {
                await new Promise<void>((resolve, reject) => {
                    taxScannerUpload(req, res, (err: any) => err ? reject(err) : resolve());
                });
            } catch (err: any) {
                logger.error("updateGramPanchayat upload error :: ", err?.message || err);
                return _400(res, err?.message || 'File upload failed');
            }

            const grampanchayatId = req?.body?.grampanchayat_id;
            const districtId = req?.body?.district_id;
            const talukaId = req?.body?.taluka_id;
            const gramPanchayatName = req?.body?.name;
            const gharTaxScanner = pickUploadedFilename(req, 'ghar_tax_scanner');
            const paniTaxScanner = pickUploadedFilename(req, 'pani_tax_scanner');

            if (!grampanchayatId || !districtId || !talukaId || !gramPanchayatName) {
                return _400(res, 'grampanchayat_id, district_id, taluka_id and name are required');
            }

            const existing = await getGramPanchayat([grampanchayatId]);
            if (!existing) {
                return _404(res, 'Grampanchayat Not Found');
            }

            const params = [districtId, talukaId, gramPanchayatName, grampanchayatId, gharTaxScanner, paniTaxScanner];
            const result = await updateGramPanchayat(params, pickBankFields(req));
            if (result === "exists") {
                return _409(res, gramPanchayatName + ' Grampanchayat already exists. Please choose another gram panchayat name');
            }
            if (result == null) {
                return _400(res, 'GramPanchayat Not Updated');
            }
            return _200(res, gramPanchayatName + ' GramPanchayat Updated Successfully');
        } catch (error: any) {
            logger.error("updateGramPanchayat :: ", error?.message || error);
            console.error("updateGramPanchayat error :: ", error);
            return _400(res, error?.message || 'GramPanchayat Not Updated');
        }
    }

    static async deleteGramPanchayat(req: any, res: any, next: any) {
        let grampanchayatId = req?.params?.id;
        getGramPanchayat([grampanchayatId]).then((result) => {
            if (!result) {
                return _404(res, 'Grampanchayat Not Found');
            }

            deleteGramPanchayat([grampanchayatId]).then((result) => {
                if (result) {
                   return _200(res, 'Grampanchayat deleted successfully');
                } else {
                   return _400(res, 'GramPanchayat not deleted');
                }
            }).catch((error) => {
                logger.error("deleteGrampanchayat :: ", error);
                _400(res, 'GramPanchayat not deleted');
            });
        }).catch((error) => {
            logger.error("deleteGramPanchayat :: ", error);
           return _404(res, 'GramPanchayat not found');
        });
    }

    static async getAllgrampanchayatDDL(req: any, res: any, next: any) {
        let response = {};
        let params = [];
        // console.log("Test",params);
        getPanchayatListForDDL(params).then((result) => {
            if (result) {
                response['data'] = result;
               return _200(res, 'Panchayat list found successfully', response)
            } else {
               return _400(res, 'Panchayat list not found')
            }
        }).catch((error) => {

            logger.error("getAllgrampanchayatDDL :: ", error);
           return _400(res, 'Panchayat list not found')
        });
    }
}