import exp = require("constants");
import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export async function searchCustomerVasuli(user_id: number, data: any, page:number): Promise<any | null> {
    try {
            let limit: number = PAGINATION.LIMIT;
            const offset = (page - 1) * limit;
            let sql = `
                SELECT 
                    y1.YEAR_NAME AS YEAR_NAME,
                    y2.YEAR_NAME AS YEAR_NAME1,
                    v.ANNU_KRAMANK,
                    v.MALMATTA_NUMBER,
                    v.VARD_NUMBER,
                    v.PLOT_NO,
                    v.KHASARA_KRAMANK,
                    v.SURVEY_KRAMANK,
                    v.HOMEUSER_NAME,
                    v.BHOGATWARGARACHE_NAME,
                    a.*
                FROM vasuli a
                LEFT JOIN year y1 ON y1.YEAR_ID = a.YEAR_ID
                LEFT JOIN year y2 ON y2.YEAR_ID = a.YEAR_ID1
                LEFT JOIN vasuli v ON v.VASULI_ID = a.VASULI_ID
                WHERE 1=1 AND a.user_id = ? AND a.DELETED_AT IS null `;
            const params: (number | string)[] = [user_id];

            if (data.cmbyear) {
        sql += " AND a.year_id LIKE ?";
        params.push(`%${data.cmbyear}%`);
        }
        if (data.cmbyear1) {
        sql += " AND a.year_id1 LIKE ?";
        params.push(`%${data.cmbyear1}%`);
        }
        if (data.txtnumber) {
        sql += " AND a.ANNU_KRAMANK LIKE ?";
        params.push(`%${data.txtnumber}%`);
        }
        if (data.txt_malmatta_number) {
        sql += " AND a.MALMATTA_NUMBER LIKE ?";
        params.push(`%${data.txt_malmatta_number}%`);
        }
        if (data.txt_vard_number) {
        sql += " AND a.VARD_NUMBER LIKE ?";
        params.push(`%${data.txt_vard_number}%`);
        }
        if (data.txt_plot_number) {
        sql += " AND a.PLOT_NO LIKE ?";
        params.push(`%$data.{txt_plot_number}%`);
        }
        if (data.txt_khasara_number) {
        sql += " AND a.KHASARA_KRAMANK LIKE ?";
        params.push(`%${data.txt_khasara_number}%`);
        }
        if (data.txt_survey_number) {
        sql += " AND a.SURVEY_KRAMANK LIKE ?";
        params.push(`%${data.txt_survey_number}%`);
        }
        if (data.txt_khatedarache_name) {
        sql += " AND a.HOMEUSER_NAME LIKE ?";
        params.push(`%${data.txt_khatedarache_name}%`);
        }
        if (data.txt_bhogatwarache_name) {
        sql += " AND a.BHOGATWARGARACHE_NAME LIKE ?";
        params.push(`%${data.txt_bhogatwarache_name}%`);
        }

        let totalCount = await getMalmattaNotdniRecordCount(sql, params);
        sql += ` ORDER BY a.VASULI_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        const results: any = await executeQuery(sql, params);
        // if (results.length > 0) {
        //     return results as any;
        // }
        // return [];
        return executeQuery(sql, params).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("searchCustomer fetch data error: ", error);
            return [];
        });
    } catch (error) {
        logger.error(`Error searching customer: ${error.message}`);
        throw error;
    }
}

let getMalmattaNotdniRecordCount = async (query: string, param: any) => {
    try {
        const result = await executeQuery(query, param);
        return Object.keys(result).length;
    } catch (err) {
        logger.error('Error fetching getMalmattaNotdniRecordCount', err);
        throw err;
    }
};

export const saveCustomerVasuli = async (data: any) => {
    try {

        const checkSql = `SELECT COUNT(*) as count FROM vasuli WHERE ANNU_KRAMANK = ? AND VARD_NUMBER = ? AND user_id = ? AND DELETED_AT IS null`;
        const checkParams = [data.anu_kramank, data.vard_number, data.user_id];
        const checkResult = await executeQuery(checkSql, checkParams);

        if (checkResult[0].count > 0) {
            return { status: 400, message: "ANNU_KRAMANK already exists." };
        }
        


        let sql = `INSERT INTO vasuli (
                user_id, NEWUSER_ID, YEAR_ID, YEAR_ID1, ANNU_KRAMANK, MALMATTA_NUMBER,
                VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, SURVEY_KRAMANK, HOMEUSER_NAME,
                BHOGATWARGARACHE_NAME, ADDRESS, GHRUH_BHUMIKAR_MAGIL_KAR, 
                GHRUH_BHUMIKAR_CHALU_KAR, GHRUH_BHUMIKAR_JAMMA_KELELI_RAKKAM,
                GHRUH_BHUMIKAR_SHILLAK_RAKKAM, VIZ_DIVABATTI_MAGIL_KAR, 
                VIZ_DIVABATTI_CHALU_KAR, VIZ_DIVABATTI_JAMMA_KELELI_RAKKAM,
                VIZ_DIVABATTI_SHILLAK_RAKKAM, AAROGYA_RAKSHAN_MAGIL_KAR,
                AAROGYA_RAKSHAN_CHALU_KAR, AAROGYA_RAKSHAN_JAMMA_KELELI_RAKKAM,
                AAROGYA_RAKSHAN_SHILLAK_RAKKAM, SAFAI_MAGIL_KAR, SAFAI_CHALU_KAR,
                SAFAI_JAMMA_KELELI_RAKKAM, SAFAI_SHILLAK_RAKKAM, GHRUH_BHUMIKAR_DATE,
                SAMNAYA_PANI_MAGIL_KAR, SAMNAYA_PANI_CHALU_KAR,
                SAMNAYA_PANI_JAMMA_KELELI_RAKKAM, SAMNAYA_PANI_SHILLAK_RAKKAM,
                VISHESH_PANI_MAGIL_KAR, VISHESH_PANI_CHALU_KAR,
                VISHESH_PANI_JAMMA_KELELI_RAKKAM, VISHESH_PANI_SHILLAK_RAKKAM,
                PAVTI_DATE_PANI_KRAMANK, NOTICE_FEE_MAGIL_KAR, NOTICE_FEE_CHALU_KAR,
                NOTICE_FEE_JAMMA_KELELI_RAKKAM, NOTICE_FEE_SHILLAK_RAKKAM,
                ETAR_FEE_MAGIL_KAR, ETAR_FEE_CHALU_KAR, ETAR_FEE_JAMMA_KELELI_RAKKAM,
                ETAR_FEE_SHILLAK_RAKKAM, EKUN_MAGIL_KAR, EKUN_CHALU_KAR,
                EKUN_JAMMA_KELELI_RAKKAM, EKUN_SHILLAK_RAKKAM, ttime, tdate
                ) VALUES (
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?
                )`;


    const params = [
            data.user_id,
            data.newuser_id,
            data.year_id,
            data.year_id1,
            data.anu_kramank,
            data.malmatta_number,
            data.vard_number,
            data.plot_no,
            data.khasara_kramank,
            data.survey_kramank,
            data.homeuser_name,
            data.bhogatwar_name,
            data.address,
            data.ghruh_magil_kar,
            data.ghruh_chalu_kar,
            data.ghruh_jamma_rakkam,
            data.ghruh_shillak_rakkam,
            data.viz_magil_kar,
            data.viz_chalu_kar,
            data.viz_jamma_rakkam,
            data.viz_shillak_rakkam,
            data.aarogya_magil_kar,
            data.aarogya_chalu_kar,
            data.aarogya_jamma_rakkam,
            data.aarogya_shillak_rakkam,
            data.safai_magil_kar,
            data.safai_chalu_kar,
            data.safai_jamma_rakkam,
            data.safai_shillak_rakkam,
            data.ghruh_date ? new Date(data.ghruh_date).toLocaleDateString('en-GB').replace(/\//g, '-')  : null,
            data.samanya_pani_magil_kar,
            data.samanya_pani_chalu_kar,
            data.samanya_pani_jamma_rakkam,
            data.samanya_pani_shillak_rakkam,
            data.vishesh_pani_magil_kar,
            data.vishesh_pani_chalu_kar,
            data.vishesh_pani_jamma_rakkam,
            data.vishesh_pani_shillak_rakkam,
            data.pavti_date? new Date(data.pavti_date).toLocaleDateString('en-GB').replace(/\//g, '-')  : null,
            data.notice_magil_kar,
            data.notice_chalu_kar,
            data.notice_jamma_rakkam,
            data.notice_shillak_rakkam,
            data.etar_magil_kar,
            data.etar_chalu_kar,
            data.etar_jamma_rakkam,
            data.etar_shillak_rakkam,
            data.ekun_magil_kar,
            data.ekun_chalu_kar,
            data.ekun_jamma_rakkam,
            data.ekun_shillak_rakkam,
            new Date().toISOString().slice(0, 19).replace('T', ' '),  // ttime
            new Date().toISOString().slice(0, 19).replace('T', ' ')   // tdate
            ];



        console.log("params", params);
        const result = await executeQuery(sql, params);
        console.log("result", sql);
        if (result) {
            return { status: 200, message: "ग्राहक वसुली added Successfully." , data: result };
        }
        else {
            return { status: 400, message: "ग्राहक वसुली Insertion Failed" };
        }
    } catch (err) {
        logger.error('Error ::saveCustomerVasuli :', err);
        throw err;
    }
}

export async function getVasuliCustomerById(id:number): Promise<any[]> {
    try {
        const query = `
            SELECT * 
            FROM vasuli 
            WHERE VASULI_ID = ? AND DELETED_AT IS null
        `;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching Customer Vasuli: ${error.message}`);
        throw error;
    }
}

export async function updateVasuliCustomerById(id: number, data: any): Promise<any> {
    try {
        const query = `
            UPDATE vasuli 
            SET 
                YEAR_ID = ?, 
                YEAR_ID1 = ?, 
                ANNU_KRAMANK = ?, 
                MALMATTA_NUMBER = ?, 
                VARD_NUMBER = ?, 
                PLOT_NO = ?, 
                KHASARA_KRAMANK = ?, 
                SURVEY_KRAMANK = ?, 
                HOMEUSER_NAME = ?, 
                BHOGATWARGARACHE_NAME = ?, 
                ADDRESS = ?, 
                GHRUH_BHUMIKAR_MAGIL_KAR = ?, 
                GHRUH_BHUMIKAR_CHALU_KAR = ?, 
                GHRUH_BHUMIKAR_JAMMA_KELELI_RAKKAM = ?, 
                GHRUH_BHUMIKAR_SHILLAK_RAKKAM = ?, 
                VIZ_DIVABATTI_MAGIL_KAR = ?, 
                VIZ_DIVABATTI_CHALU_KAR = ?, 
                VIZ_DIVABATTI_JAMMA_KELELI_RAKKAM = ?, 
                VIZ_DIVABATTI_SHILLAK_RAKKAM = ?, 
                AAROGYA_RAKSHAN_MAGIL_KAR = ?, 
                AAROGYA_RAKSHAN_CHALU_KAR = ?, 
                AAROGYA_RAKSHAN_JAMMA_KELELI_RAKKAM = ?, 
                AAROGYA_RAKSHAN_SHILLAK_RAKKAM = ?, 
                SAFAI_MAGIL_KAR = ?, 
                SAFAI_CHALU_KAR = ?, 
                SAFAI_JAMMA_KELELI_RAKKAM = ?, 
                SAFAI_SHILLAK_RAKKAM = ?, 
                GHRUH_BHUMIKAR_DATE = ?, 
                SAMNAYA_PANI_MAGIL_KAR = ?, 
                SAMNAYA_PANI_CHALU_KAR = ?, 
                SAMNAYA_PANI_JAMMA_KELELI_RAKKAM = ?, 
                SAMNAYA_PANI_SHILLAK_RAKKAM = ?, 
                VISHESH_PANI_MAGIL_KAR = ?, 
                VISHESH_PANI_CHALU_KAR = ?, 
                VISHESH_PANI_JAMMA_KELELI_RAKKAM = ?, 
                VISHESH_PANI_SHILLAK_RAKKAM = ?,
                PAVTI_DATE_PANI_KRAMANK = ?,
                NOTICE_FEE_MAGIL_KAR = ?,
                NOTICE_FEE_CHALU_KAR = ?,
                NOTICE_FEE_JAMMA_KELELI_RAKKAM = ?,
                NOTICE_FEE_SHILLAK_RAKKAM = ?,
                ETAR_FEE_MAGIL_KAR = ?,
                ETAR_FEE_CHALU_KAR = ?,
                ETAR_FEE_JAMMA_KELELI_RAKKAM = ?,
                ETAR_FEE_SHILLAK_RAKKAM = ?,
                EKUN_MAGIL_KAR = ?,
                EKUN_CHALU_KAR = ?,
                EKUN_JAMMA_KELELI_RAKKAM = ?,
                EKUN_SHILLAK_RAKKAM = ?,
                ttime = ?,
                tdate = ?
            WHERE VASULI_ID = ? AND DELETED_AT IS null
        `;
        const params = [
            data.year_id,
            data.year_id1,
            data.anu_kramank,
            data.malmatta_number,
            data.vard_number,
            data.plot_no,
            data.khasara_kramank,
            data.survey_kramank,
            data.homeuser_name,
            data.bhogatwar_name,
            data.address,
            data.ghruh_magil_kar,
            data.ghruh_chalu_kar,
            data.ghruh_jamma_rakkam,
            data.ghruh_shillak_rakkam,
            data.viz_magil_kar,
            data.viz_chalu_kar,
            data.viz_jamma_rakkam,
            data.viz_shillak_rakkam,
            data.aarogya_magil_kar,
            data.aarogya_chalu_kar,
            data.aarogya_jamma_rakkam,
            data.aarogya_shillak_rakkam,
            data.safai_magil_kar,
            data.safai_chalu_kar,
            data.safai_jamma_rakkam,
            data.safai_shillak_rakkam,
            data.ghruh_date ? new Date(data.ghruh_date).toLocaleDateString('en-GB').replace(/\//g, '-') : null,
            data.samanya_pani_magil_kar,
            data.samanya_pani_chalu_kar,
            data.samanya_pani_jamma_rakkam,
            data.samanya_pani_shillak_rakkam,
            data.vishesh_pani_magil_kar,
            data.vishesh_pani_chalu_kar,
            data.vishesh_pani_jamma_rakkam,
            data.vishesh_pani_shillak_rakkam,
            data.pavti_date? new Date(data.pavti_date).toLocaleDateString('en-GB').replace(/\//g, '-')  : null,
            data.notice_magil_kar,
            data.notice_chalu_kar,
            data.notice_jamma_rakkam,
            data.notice_shillak_rakkam,
            data.etar_magil_kar,
            data.etar_chalu_kar,
            data.etar_jamma_rakkam,
            data.etar_shillak_rakkam,
            data.ekun_magil_kar,
            data.ekun_chalu_kar,
            data.ekun_jamma_rakkam,
            data.ekun_shillak_rakkam,
            new Date().toISOString().slice(0, 19).replace('T', ' '),  // ttime
            new Date().toISOString().slice(0, 19).replace('T', ' '),  // tdate
            id
        ];
        const result = await executeQuery(query, params) as { affectedRows: number };
        if (result.affectedRows > 0) {
            return { status: 200, message: "Customer Vasuli updated successfully." };
        } else {
            return { status: 400, message: "No changes made or record not found." };
        }
    }catch (error) {
        logger.error(`Error updating Customer Vasuli: ${error.message}`);
        throw error;
    }   
}

export async function deleteCustomerVasuli(id: number): Promise<any> {
    try {
        const query = `
            UPDATE vasuli 
            SET DELETED_AT = NOW() 
            WHERE VASULI_ID = ? AND DELETED_AT IS null
        `;
        const result = await executeQuery(query, [id]) as { affectedRows: number };
        if (result.affectedRows > 0) {
            return { status: 200, message: "Customer Vasuli deleted successfully." };
        } else {
            return { status: 400, message: "Record not found or already deleted." };
        }
    } catch (error) {
        logger.error(`Error deleting Customer Vasuli: ${error.message}`);
        throw error;
    }
}
export async function getChaluKarData(details: any): Promise<any | null> {
    
    try {
        const query = `
           SELECT * FROM newusersavekar where RNO = ? AND vard_number = ? AND NEWUSER_ID = ? AND YEAR_ID = ? AND USER_ID = ? AND DELETED_AT IS NULL`;
        details = Object.values(details);
        const results: any = await executeQuery(query, [...details]);
        let response = {
                BHUMI_KAR : 0,
                DIVA_BATTI_KAR : 0,
                AAROGYA_RAKSHAN_KAR : 0,
                SAFAI_KAR : 0,
                SAMANYA_PANI_KAR : 0,
                VISHESH_PANI_KAR : 0,
                ETAR_FEES : 0,
                NOTICE_FEES : 0,
                TOTAL : 0,
            }
        if (results.length > 0) {            
            results.forEach(element => { // Assuming 'results' is the array to iterate over
                response.BHUMI_KAR += Number(element.BHUMI_KAR);
                response.DIVA_BATTI_KAR += Number(element.DIVA_BATTI_KAR);
                response.AAROGYA_RAKSHAN_KAR += Number(element.AAROGYA_RAKSHAN_KAR);
                response.SAFAI_KAR += Number(element.SAFAI_KAR);
                response.SAMANYA_PANI_KAR += Number(element.SAMANYA_PANI_KAR);
                response.VISHESH_PANI_KAR += Number(element.VISHESH_PANI_KAR);
                response.ETAR_FEES += Number(element.ETAR_FEES);
                response.NOTICE_FEES += Number(element.NOTICE_FEES);
                response.TOTAL += Number(element.TOTAL);
            });
        }
        return [response] as any;
    } catch (error) {
        logger.error(`Error fetching getChaluKarData: ${error.message}`);
        throw error;
    }
}
export async function getMagilKarData(details: any): Promise<any | null> {
    
    try {
        const query = `
           SELECT * FROM newusersavekar where RNO = ? AND vard_number = ? AND NEWUSER_ID = ? AND YEAR_ID < ? AND USER_ID = ? AND DELETED_AT IS NULL`;
        details = Object.values(details);
        const results: any = await executeQuery(query, [...details]);
        let response = {
                BHUMI_KAR : 0,
                DIVA_BATTI_KAR : 0,
                AAROGYA_RAKSHAN_KAR : 0,
                SAFAI_KAR : 0,
                SAMANYA_PANI_KAR : 0,
                VISHESH_PANI_KAR : 0,
                ETAR_FEES : 0,
                NOTICE_FEES : 0,
                TOTAL : 0,
            }
        if (results.length > 0) {            
            results.forEach(element => { // Assuming 'results' is the array to iterate over
                response.BHUMI_KAR += Number(element.BHUMI_KAR);
                response.DIVA_BATTI_KAR += Number(element.DIVA_BATTI_KAR);
                response.AAROGYA_RAKSHAN_KAR += Number(element.AAROGYA_RAKSHAN_KAR);
                response.SAFAI_KAR += Number(element.SAFAI_KAR);
                response.SAMANYA_PANI_KAR += Number(element.SAMANYA_PANI_KAR);
                response.VISHESH_PANI_KAR += Number(element.VISHESH_PANI_KAR);
                response.ETAR_FEES += Number(element.ETAR_FEES);
                response.NOTICE_FEES += Number(element.NOTICE_FEES);
                response.TOTAL += Number(element.TOTAL);
            });
        }
        return [response] as any;
    } catch (error) {
        logger.error(`Error fetching getMagilKarData: ${error.message}`);
        throw error;
    }
}
