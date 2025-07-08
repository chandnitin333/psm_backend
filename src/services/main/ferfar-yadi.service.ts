import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
import { Utils } from "../../utils/util";





export async function getFerFarYadiDetailById(ferfar_id: number): Promise<any | null> {
    try {
        const query = `
            select * from ferfar where FERFAR_ID = ? AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [ferfar_id]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching ferfar details by ferfar id: ${error.message}`);
        throw error;
    }
}

export async function geFerFarYadiList(page: number = 1, search: string = "", user_id:Number): Promise<any[]> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let query = `
            SELECT A.*, (SELECT X.YEAR_NAME FROM year X WHERE X.YEAR_ID=A.YEAR_ID) AS YEAR_NAME
            FROM ferfar A
            WHERE user_id = ? AND DELETED_AT IS NULL
        `;
        const values: any[] = [user_id];
        if (search) {
            query += ` AND LOWER(HOMEUSER_NAME) LIKE LOWER(?) OR LOWER(BHOGATWARGARACHE_NAME) LIKE LOWER(?)`;
            values.push(`%${search}%`,`%${search}%`);
        }
        let totalCount = await getMalmattaNotdniRecordCount(query, values);
        query += ` ORDER BY FERFAR_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        return executeQuery(query, values).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("geFerFarYadiList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error(`Error fetching ferfar yadi info list: ${error.message}`);
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

export async function insertUpdateSillakJoda(savakar: any): Promise<void> {
    try {
        let selectParamValue = {'year_id': savakar.years, 'user_id': savakar.user_id, "newuser_id": savakar.newuser_id, "ward_no": savakar.ward_numbers};
        let sillakJodaExist = await checkSillakJodaExist(selectParamValue);
        console.log("if part", sillakJodaExist);

        if((sillakJodaExist as any[]).length > 0) {
            const query = `UPDATE newusersavekar 
                        SET 
                            YEAR_ID = ?,
                            YEAR1_ID = ?,
                            BHUMI_KAR = ?,
                            DIVA_BATTI_KAR = ?,
                            AAROGYA_RAKSHAN_KAR = ?,
                            SAFAI_KAR = ?,
                            SAMANYA_PANI_KAR = ?,
                            VISHESH_PANI_KAR = ?,
                            TOTAL = ?,
                            ETAR_FEES = ?,
                            NOTICE_FEES = ?,
                            less5 = ?,
                            plus5 = ?
                        WHERE 
                            USER_ID = ? 
                            AND NEWUSER_ID = ? 
                            AND YEAR_ID = ? 
                            AND NEWUSERSAVEKAR_ID = ? 
                            AND vard_number = ?`;
                            // sillakJodaExist[0].NEWUSERSAVEKAR_ID
            await executeQuery(query, [savakar.cmbyear, savakar.cmbyear1, savakar.kar_bhumikar, savakar.divabatti_kar, savakar.aarogya_rakshan_kar, savakar.safai_kar, savakar.samanya_pani_kar, savakar.vishesh_pani_kar, savakar.total, savakar.etar_fees, savakar.notice_fees, savakar.less5, savakar.plus5, savakar.user_id, savakar.newuser_id, savakar.years, sillakJodaExist[0].NEWUSERSAVEKAR_ID, savakar.ward_numbers]);
            logger.info("sillak joda updated successfully");
        } else {
            console.log("savakar Kundan", savakar);
            const query = `INSERT INTO NEWUSERSAVEKAR (
                USER_ID, NEWUSER_ID, YEAR_ID, YEAR1_ID, HOMEUSER_NAME, vard_number, 
                BHUMI_KAR, DIVA_BATTI_KAR, AAROGYA_RAKSHAN_KAR, SAFAI_KAR, 
                SAMANYA_PANI_KAR, VISHESH_PANI_KAR, ETAR_FEES, NOTICE_FEES, 
                TOTAL, tdate, ttime, RNO, less5, plus5
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?
            )`;
            await executeQuery(query, [savakar.user_id, savakar.newuser_id, savakar.cmbyear, savakar.cmbyear1, savakar.homeuser, savakar.ward_numbers, savakar.kar_bhumikar, savakar.divabatti_kar, savakar.aarogya_rakshan_kar, savakar.safai_kar, savakar.samanya_pani_kar, savakar.vishesh_pani_kar, savakar.etar_fees, savakar.notice_fees, savakar.total, savakar.rno, savakar.less5, savakar.plus5]);
            //  await executeQuery(query, [...savakar]);
            logger.info("sillak joda added successfully");
        }
    } catch (error) {
        logger.error(`Error adding new customer in malmatta nodni form: ${error.message}`);
        throw error;
    }
}

let checkSillakJodaExist = async (selectParamValue: any) => {
    try {
        const query = `SELECT YEAR_ID, NEWUSERSAVEKAR_ID FROM newusersavekar WHERE YEAR_ID = ? AND USER_ID = ? AND NEWUSER_ID = ? AND vard_number = ?`;
        const result = await executeQuery(query, Object.values(selectParamValue));
        return result;
    } catch (err) {
        logger.error('Error fetching sillak joda by year_id, user_id, newuser_id and ward_no', err);
        throw err;
    }
}

export async function updateMalmattaNodniInfo( data: any): Promise<void> {
    try {
        // console.log("data", data);
        const query = `UPDATE newuser SET
            ANNU_KRAMANK = ?,
            MALMATTA_NUMBER = ?,
            VARD_NUMBER = ?,
            PLOT_NO = ?,
            KHASARA_KRAMANK = ?,
            SURVEY_KRAMANK = ?,
            HOMEUSER_NAME = ?,
            BHOGATWARGARACHE_NAME = ?,
            ADDRESS_NAGAR_SOCIETY = ?
        WHERE user_id = ? AND NEWUSER_ID = ?`;
           
        // await executeQuery(query, data);
        data = Object.values(data);
        await executeQuery(query, [...data]);
        logger.info("malmatta nodani updated successfully");
    } catch (error) {
        logger.error(`Error updating malmatta nodani : ${error.message}`);
        throw error;
    }
}

export async function softDeleteFerfarYadi(id: number): Promise<void> {
    try {
        const query = `UPDATE ferfar SET DELETED_AT = NOW() WHERE FERFAR_ID = ?`;
        await executeQuery(query, [id]);
        logger.info("Ferfar yadi deleted successfully");
    }
    catch (error) {
        logger.error(`Error deleting ferfar yadi : ${error.message}`);
        throw error;
    }
}




export async function getYearList(): Promise<any[]> {
    try {
        const query = `
            SELECT YEAR_ID, YEAR_NAME FROM year WHERE DELETED_AT IS NULL    
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching from year list: ${error.message}`);
        throw error;
    }
}

export async function getAnnuKramank(annu_details: any): Promise<any | null> {
    
    try {
        const query = `
           SELECT  MAX(CAST(ANNU_KRAMANK AS UNSIGNED))+1 as ANNU_KRAMANK FROM ferfar where VARD_NUMBER = ? AND USER_ID = ? `;
        annu_details = Object.values(annu_details);
        const results: any = await executeQuery(query, [...annu_details]);
        if (results.length > 0) {
             console.log("console", results[0]['ANNU_KRAMANK'])
            if(results[0]['ANNU_KRAMANK'] == null) {
                return {"ANNU_KRAMANK":1};
            }
            return results[0] as any;
        }
        return 1;
    } catch (error) {
        logger.error(`Error fetching annu kramank: ${error.message}`);
        throw error;
    }
}

export async function addNewFerfarYadiFormInfo(data: any, user_id: number): Promise<void> {
    try {
        const query = `
            INSERT INTO ferfar (FERFARNAMUNAYADI_ID, PANCHAYAT_ID, YEAR_ID, YEAR1_ID, NEWUSER_ID, ANNU_KRAMANK, MALMATTA_NUMBER, VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, SURVEY_KRAMANK,MASIKSABHA,THARAV,DATE, JUNEKHATEDAR_NAME, NAVINKHATEDAR_NAME,SACHIV,SARPANCH,UPSARPANCH,TIP,USER_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

        data = Object.values(data);
        await executeQuery(query, [...data,user_id]);
        logger.info("new customer in ferfar yadi form added successfully");
    } catch (error) {
        logger.error(`Error adding new ferfar form: ${error.message}`);
        throw error;
    }
}

export async function searchFerFarYadi(user_id: number, data: any, page:number): Promise<any | null> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let sql = `
             SELECT DISTINCT
        (SELECT a.FERFARNAMUNAYADI_NAME FROM ferfarnamunayadi a WHERE a.FERFARNAMUNAYADI_ID=A.FERFARNAMUNAYADI_ID) AS FERFARNAMUNAYADI_NAME,
        (SELECT b.PANCHAYAT_NAME FROM panchayat b WHERE b.PANCHAYAT_ID=A.PANCHAYAT_ID) AS PANCHAYAT_NAME,
        (SELECT c.YEAR_NAME FROM year c WHERE c.YEAR_ID=A.YEAR_ID) AS YEAR_NAME,
        (SELECT d.YEAR_NAME FROM year d WHERE d.YEAR_ID=A.YEAR1_ID) AS YEAR_NAME2,
        (SELECT e.ANNU_KRAMANK FROM ferfar e WHERE e.FERFAR_ID=A.FERFAR_ID) AS ANNU_KRAMANK,
        (SELECT f.MALMATTA_NUMBER FROM ferfar f WHERE f.FERFAR_ID=A.FERFAR_ID) AS MALMATTA_NUMBER,
        (SELECT g.VARD_NUMBER FROM ferfar g WHERE g.FERFAR_ID=A.FERFAR_ID) AS VARD_NUMBER,
        (SELECT h.PLOT_NO FROM ferfar h WHERE h.FERFAR_ID=A.FERFAR_ID) AS PLOT_NO,
        (SELECT i.KHASARA_KRAMANK FROM ferfar i WHERE i.FERFAR_ID=A.FERFAR_ID) AS KHASARA_KRAMANK,
        (SELECT j.SURVEY_KRAMANK FROM ferfar j WHERE j.FERFAR_ID=A.FERFAR_ID) AS SURVEY_KRAMANK,
        (SELECT k.MASIKSABHA FROM ferfar k WHERE k.FERFAR_ID=A.FERFAR_ID) AS MASIKSABHA,
        (SELECT l.THARAV FROM ferfar l WHERE l.FERFAR_ID=A.FERFAR_ID) AS THARAV,
        (SELECT m.DATE FROM ferfar m WHERE m.FERFAR_ID=A.FERFAR_ID) AS DATE,
        (SELECT o.JUNEKHATEDAR_NAME FROM ferfar o WHERE o.FERFAR_ID=A.FERFAR_ID) AS JUNEKHATEDAR_NAME,
        (SELECT p.NAVINKHATEDAR_NAME FROM ferfar p WHERE p.FERFAR_ID=A.FERFAR_ID) AS NAVINKHATEDAR_NAME,
        (SELECT q.SACHIV FROM ferfar q WHERE q.FERFAR_ID=A.FERFAR_ID) AS SACHIV,
        (SELECT r.SARPANCH FROM ferfar r WHERE r.FERFAR_ID=A.FERFAR_ID) AS SARPANCH,
        (SELECT s.UPSARPANCH FROM ferfar s WHERE s.FERFAR_ID=A.FERFAR_ID) AS UPSARPANCH,
        (SELECT t.TIP FROM ferfar t WHERE t.FERFAR_ID=A.FERFAR_ID) AS TIP,
        A.*
      FROM ferfar A
      WHERE A.DELETED_AT IS NULL AND A.USER_ID = ?
        `;
        const params: (number | string)[] = [user_id];

        if (data.cmbyear) {
            sql += ' AND A.YEAR_ID LIKE ?';
            params.push(`%${data.cmbyear}%`);
        }
        if (data.cmbyear1) {
            sql += ' AND A.YEAR1_ID LIKE ?';
            params.push(`%${data.cmbyear1}%`);
        }
        if (data.txtnumber) {
            sql += ' AND A.ANNU_KRAMANK LIKE ?';
            params.push(`%${data.txtnumber}%`);
        }
        if (data.txt_malmatta_number) {
            sql += ' AND A.MALMATTA_NUMBER LIKE ?';
            params.push(`%${data.txt_malmatta_number}%`);
        }
        if (data.txt_vard_number) {
            sql += ' AND A.VARD_NUMBER LIKE ?';
            params.push(`%${data.txt_vard_number}%`);
        }
        if (data.txt_plot_number) {
            sql += ' AND A.PLOT_NO LIKE ?';
            params.push(`%${data.txt_plot_number}%`);
        }
        if (data.txt_khasara_number) {
            sql += ' AND A.KHASARA_KRAMANK LIKE ?';
            params.push(`%${data.txt_khasara_number}%`);
        }
        if (data.txt_survey_number) {
            sql += ' AND A.SURVEY_KRAMANK LIKE ?';
            params.push(`%${data.txt_survey_number}%`);
        }
        if (data.txt_khatedarache_name) {
            sql += ' AND A.JUNEKHATEDAR_NAME LIKE ?';
            params.push(`%${data.txt_khatedarache_name}%`);
        }
        if (data.txt_bhogatwarache_name) {
            sql += ' AND A.NAVINKHATEDAR_NAME LIKE ?';
            params.push(`%${data.txt_bhogatwarache_name}%`);
        }
        let totalCount = await getMalmattaNotdniRecordCount(sql, params);
        sql += ` ORDER BY A.FERFAR_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        console.log("sql", sql);
        return executeQuery(sql, params).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("geFerFarYadiList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error(`Error searching customer: ${error.message}`);
        throw error;
    }
}
export async function updateFerfarYadi(ferfar_id: number, data: any, user_id: number): Promise<any | null> {
    try {
        const query = `
            UPDATE ferfar
            SET FERFARNAMUNAYADI_ID = ?, PANCHAYAT_ID = ?, YEAR_ID = ?, YEAR1_ID = ?,NEWUSER_ID = ?, ANNU_KRAMANK = ?, MALMATTA_NUMBER = ?, VARD_NUMBER = ?, PLOT_NO = ?, KHASARA_KRAMANK = ?, SURVEY_KRAMANK = ?, MASIKSABHA = ?, THARAV = ?, DATE = ?, JUNEKHATEDAR_NAME = ?, NAVINKHATEDAR_NAME = ?, SACHIV = ?, SARPANCH = ?, UPSARPANCH = ?, TIP = ?
            WHERE FERFAR_ID = ? AND USER_ID = ?
        `;
        
        data = Object.values(data);
        await executeQuery(query, [...data,ferfar_id,user_id]);
        logger.info("Ferfar Yadi updated successfully");
    } catch (error) {
        logger.error(`Error updating Ferfar Yadi: ${error.message}`);
        throw error;
    }
}   

export async function getFerfarNamunaYadiDDL(): Promise<any[]> {
    try {
        const query = `
            SELECT FERFARNAMUNAYADI_ID, FERFARNAMUNAYADI_NAME FROM ferfarnamunayadi WHERE DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching Ferfar Namuna Yadi DDL: ${error.message}`);
        throw error;
    }
}

export async function getPanchayatIdById(panchayat_id: number): Promise<any | null> {
    try {
        const query = `
            SELECT PANCHAYAT_ID, PANCHAYAT_NAME FROM panchayat WHERE PANCHAYAT_ID = ? AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, [panchayat_id]);
        if (results.length > 0) {
            return results[0];
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching Panchayat by ID: ${error.message}`);
        throw error;
    }
}
export async function softDeleteFerfarYadiPDF(pdf_id: number): Promise<void> {
    try {
        const query = `UPDATE uploadpdf SET DELETED_AT = NOW() WHERE UPLOADPDF_ID = ?`;
        await executeQuery(query, [pdf_id]);
        logger.info("Ferfar yadi PDF deleted successfully");
    } catch (error) {
        logger.error(`Error deleting Ferfar yadi PDF: ${error.message}`);
        throw error;
    }
}

export async function createUploadFerFarPDFData(pdfData: any): Promise<void> {
    try {
        console.log("pdfData", pdfData);
        const dateNow = await Utils.getCurrentDateTime();
        const query = `
            INSERT INTO uploadpdf (TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_ID, FERFAR_ID, FILE_NAME, R_PATH, USER_ID, TDATE, TTIME, DISTRICT_ID, newuser_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [pdfData.decoded_user.TALUKA_ID, pdfData.decoded_user.PANCHAYAT_ID, pdfData.decoded_user.GATGRAMPANCHAYAT_id, pdfData.ferfar_id, pdfData.name, pdfData.r_path, pdfData.decoded_user.userId, dateNow, dateNow, pdfData.decoded_user.DISTRICT_ID, pdfData.decoded_user.newuser_id];
        await executeQuery(query, values);
        logger.info("Ferfar yadi PDF data created successfully");
    } catch (error) {
        logger.error(`Error creating Ferfar yadi PDF data: ${error.message}`);
        throw error;
    }
}

export async function getPDFFerfarYadi(page_number,ferfar_id, user_id): Promise<any | null> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page_number - 1) * limit;
        let query = `
            SELECT * FROM uploadpdf WHERE FERFAR_ID = ? AND user_id = ? AND DELETED_AT IS NULL
        `;
        let params: (number | string)[] = [ferfar_id, user_id, limit, offset];
        let totalCount = await getMalmattaNotdniRecordCount(query, params);
        query += ` ORDER BY FERFAR_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        const results: any[] = await executeQuery(query, params);
        return executeQuery(query, params).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("geFerFarYadiList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error(`Error fetching Ferfar Yadi PDF: ${error.message}`);
        throw error;
    }
}