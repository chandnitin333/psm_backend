import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export async function addNewCustomerInNodniFormInfo(customer: any): Promise<void> {
    try {
        const query = `
            INSERT INTO newuser (ANNU_KRAMANK, MALMATTA_NUMBER, VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, SURVEY_KRAMANK, HOMEUSER_NAME, BHOGATWARGARACHE_NAME, ADDRESS_NAGAR_SOCIETY, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        customer = Object.values(customer);
        await executeQuery(query, [...customer]);
        logger.info("new customer in malmatta nodni form added successfully");
    } catch (error) {
        logger.error(`Error adding new customer in malmatta nodni form: ${error.message}`);
        throw error;
    }
}

export async function getAnnuKramank(annu_details: any): Promise<any | null> {
    
    try {
        const query = `
           SELECT  MAX(CAST(ANNU_KRAMANK AS UNSIGNED))+1 as ANNU_KRAMANK FROM newuser where VARD_NUMBER = ? AND user_id = ?`;
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

export async function getCustomerDetailsById(customerId: number): Promise<any | null> {
    try {
        const query = `
            SELECT ANNU_KRAMANK, MALMATTA_NUMBER, VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, SURVEY_KRAMANK, HOMEUSER_NAME, BHOGATWARGARACHE_NAME, ADDRESS_NAGAR_SOCIETY FROM newuser
            WHERE NEWUSER_ID = ? AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [customerId]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching open plot details by ID: ${error.message}`);
        throw error;
    }
}

export async function getMalmattaNotdniList(page: number = 1, search: string = "", user_id:Number): Promise<any[]> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let query = `
            SELECT * FROM newuser WHERE user_id = ? AND DELETED_AT IS NULL
        `;
        const values: any[] = [user_id];
        if (search) {
            query += ` AND LOWER(HOMEUSER_NAME) LIKE LOWER(?) OR LOWER(BHOGATWARGARACHE_NAME) LIKE LOWER(?)`;
            values.push(`%${search}%`,`%${search}%`);
        }
        let totalCount = await getMalmattaNotdniRecordCount(query, values);
        query += ` ORDER BY NEWUSER_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        return executeQuery(query, values).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("getMilkatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error(`Error fetching malmatta nodani info list: ${error.message}`);
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
                            plus5 = ?,
                            ANNU_KRAMANK=?
                        WHERE 
                            USER_ID = ? 
                            AND NEWUSER_ID = ? 
                            AND YEAR_ID = ? 
                            AND NEWUSERSAVEKAR_ID = ? 
                            AND vard_number = ?`;
                            // sillakJodaExist[0].NEWUSERSAVEKAR_ID
            await executeQuery(query, [savakar.cmbyear, savakar.cmbyear1, savakar.kar_bhumikar, savakar.divabatti_kar, savakar.aarogya_rakshan_kar, savakar.safai_kar, savakar.samanya_pani_kar, savakar.vishesh_pani_kar, savakar.total, savakar.etar_fees, savakar.notice_fees, savakar.less5, savakar.plus5,savakar.annu_kramank, savakar.user_id, savakar.newuser_id, savakar.years, sillakJodaExist[0].NEWUSERSAVEKAR_ID, savakar.ward_numbers]);
            logger.info("sillak joda updated successfully");
        } else {
            console.log("savakar Kundan", savakar);
            const query = `INSERT INTO newusersavekar (
                USER_ID, NEWUSER_ID, YEAR_ID, YEAR1_ID, HOMEUSER_NAME, vard_number, 
                BHUMI_KAR, DIVA_BATTI_KAR, AAROGYA_RAKSHAN_KAR, SAFAI_KAR, 
                SAMANYA_PANI_KAR, VISHESH_PANI_KAR, ETAR_FEES, NOTICE_FEES, 
                TOTAL, tdate, ttime, RNO, less5, plus5,ANNU_KRAMANK
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?,?
            )`;
            await executeQuery(query, [savakar.user_id, savakar.newuser_id, savakar.cmbyear, savakar.cmbyear1, savakar.homeuser, savakar.ward_numbers, savakar.kar_bhumikar, savakar.divabatti_kar, savakar.aarogya_rakshan_kar, savakar.safai_kar, savakar.samanya_pani_kar, savakar.vishesh_pani_kar, savakar.etar_fees, savakar.notice_fees, savakar.total, savakar.rno, savakar.less5, savakar.plus5,savakar.annu_kramank]);
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

export async function softDeleteMalmattaNodniInfo(id: number): Promise<void> {
    try {
        const query = `UPDATE newuser SET DELETED_AT = NOW() WHERE NEWUSER_ID = ?`;
        await executeQuery(query, [id]);
        logger.info("malmatta nodani deleted successfully");
    }
    catch (error) {
        logger.error(`Error deleting malmatta nodani : ${error.message}`);
        throw error;
    }
}

export async function getNewUserDetails(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
            SELECT * FROM newuser WHERE user_id = ? AND newuser_id = ? AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [user_id, new_user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}

export async function getEntriesDetails(data: any): Promise<any | null> {
    try {
        const query = `
            SELECT A.*, 
                D.DISTRICT_NAME, 
                T.TALUKA_NAME, 
                P.PANCHAYAT_NAME 
            FROM entries A
            JOIN district D ON D.DISTRICT_ID = A.DISTRICT_ID
            JOIN taluka T ON T.TALUKA_ID = A.TALUKA_ID
            JOIN panchayat P ON P.PANCHAYAT_ID = A.PANCHAYAT_ID
            WHERE A.DISTRICT_ID = ? 
            AND A.TALUKA_ID = ? 
            AND A.PANCHAYAT_ID = ? 
            AND A.gatgrampanchayat_id = ? 
            AND A.USER_ID = ?
            AND A.DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [data.district_id, data.taluka_id, data.panchayat_id, data.gatgrampanchayat_id, data.user_id]);
        if (results.length > 0) {
            return results as any;
            //  return (results) ? { 'data': results } : [];
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}

export async function gettaxationLandDetails(user_id: number, new_user_id: number): Promise<any | null> {
    try {
        const query = `
            SELECT A.*, 
                M.MILKAT_VAPAR_NAME, 
                P.PRAKAR_NAME, 
                G.GATGRAMPANCHAYAT_NAME, 
                T.VAPARACHE_PRAKAR 
            FROM taxationland A
            LEFT JOIN milkat_vapar M ON M.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
            LEFT JOIN openplot O ON O.OPENPLOT_ID = A.OPENPLOT_ID
            LEFT JOIN prakar P ON P.PRAKAR_ID = O.PRAKAR_ID
            LEFT JOIN gatgrampanchayat G ON G.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID
            LEFT JOIN taxationland T ON T.TAXATIONLAND_ID = A.TAXATIONLAND_ID
            WHERE A.user_id = ? AND A.newuser_id = ? AND A.DELETED_AT IS NULL
            LIMIT 3
        `;
        const results: any = await executeQuery(query, [user_id, new_user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching transaction land details: ${error.message}`);
        throw error;
    }
}
export async function getConstructionTaxDetails(user_id: number, new_user_id: number): Promise<any | null> {
    try {
        const query = `
                SELECT A.*, 
                    M.MILKAT_VAPAR_NAME, 
                    MAL.DESCRIPTION_NAME, 
                    C.VAPARACHE_PRAKAR, 
                    F.FLOOR_NAME 
                FROM constructiontax A
                LEFT JOIN milkat_vapar M ON M.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
                LEFT JOIN malmatta MAL ON MAL.MALMATTA_ID = A.MALMATTA_ID
                LEFT JOIN constructiontax C ON C.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID
                LEFT JOIN floor F ON F.FLOOR_ID = A.FLOOR_ID
                WHERE A.newuser_id = ? AND A.user_id = ? AND A.DELETED_AT IS NULL
                ORDER BY A.CONSTRUCTIONTAX_ID ASC 
                LIMIT 5;

        `;
        const results: any = await executeQuery(query, [new_user_id,user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching construction tax details: ${error.message}`);
        throw error;
    }
}

export async function getTaxPayerDetails(user_id: number, new_user_id: number): Promise<any | null> {
    try {
        const query = `
            SELECT A.*, 
                M.MILKAT_VAPAR_NAME, 
                MAL.DESCRIPTION_NAME, 
                T.VAPARACHE_PRAKAR, 
                MANO.MANORAMASTER_NAME  
            FROM taxpayers A
            LEFT JOIN milkat_vapar M ON M.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
            LEFT JOIN malmatta MAL ON MAL.MALMATTA_ID = A.MALMATTA_ID
            LEFT JOIN taxpayers T ON T.TAXPAYERS_ID = A.TAXPAYERS_ID
            LEFT JOIN manoramaster MANO ON MANO.MANORAMASTER_ID = A.MANORAMASTER_ID
            WHERE A.newuser_id = ? 
            AND A.user_id = ? AND A.DELETED_AT IS NULL
            ORDER BY A.TAXPAYERS_ID ASC 
            LIMIT 3
        `;
        const results: any = await executeQuery(query, [new_user_id, user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching tax payer details: ${error.message}`);
        throw error;
    }
}