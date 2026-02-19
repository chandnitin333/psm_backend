import exp = require("constants");
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
            //  console.log("console", results[0]['ANNU_KRAMANK'])
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
            SELECT * FROM newuser
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
export async function getTaxationBynew_userid(customerId: number): Promise<any | null> {
    try {
        const query = `
            SELECT t.*,(SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = t.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
                (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = t.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME1,
                (SELECT X.PRAKAR_NAME FROM prakar X WHERE X.PRAKAR_ID IN (SELECT Y.PRAKAR_ID FROM openplot Y WHERE Y.OPENPLOT_ID = t.OPENPLOT_ID)) AS PRAKAR_NAME,
                (SELECT X.GATGRAMPANCHAYAT_NAME FROM gatgrampanchayat X WHERE X.GATGRAMPANCHAYAT_ID = t.GATGRAMPANCHAYAT_ID) AS GATGRAMPANCHAYAT_NAME
                 FROM taxationland t
            WHERE t.newuser_id = ? AND t.DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [customerId]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching getTaxationBynew_userid: ${error.message}`);
        throw error;
    }
}
export async function getConstructionBynew_userid(customerId: number): Promise<any | null> {
    try {
        const query = `
            SELECT c.*,(SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = c.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
            (SELECT X.DESCRIPTION_NAME FROM malmatta X WHERE X.MALMATTA_ID = c.MALMATTA_ID) AS DESCRIPTION_NAME,
            (SELECT X.FLOOR_NAME FROM floor X WHERE X.FLOOR_ID = c.FLOOR_ID) AS FLOOR_NAME
             FROM constructiontax c
            LEFT JOIN floor f ON f.FLOOR_ID = c.FLOOR_ID
            LEFT JOIN milkat_vapar mv ON mv.MILKAT_VAPAR_ID = c.MILKAT_VAPAR_ID
            LEFT JOIN malmatta m ON m.MALMATTA_ID = c.MALMATTA_ID
            WHERE c.newuser_id = ? AND c.DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [customerId]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching getConstructionBynew_userid: ${error.message}`);
        throw error;
    }
}
export async function getManoraBynew_userid(customerId: number): Promise<any | null> {
    try {
        const query = `
            SELECT t.*,
            (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = t.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
            (SELECT X.DESCRIPTION_NAME FROM malmatta X WHERE X.MALMATTA_ID = t.MALMATTA_ID) AS DESCRIPTION_NAME,
            (SELECT X.MANORAMASTER_NAME FROM manoramaster X WHERE X.MANORAMASTER_ID = t.MANORAMASTER_ID) AS MANORAMASTER_NAME
            FROM taxpayers t
            WHERE t.newuser_id = ? AND t.DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [customerId]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching getManoraBynew_userid: ${error.message}`);
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
            query += ` AND (LOWER(HOMEUSER_NAME) LIKE LOWER(?) OR 
            LOWER(BHOGATWARGARACHE_NAME) LIKE LOWER(?) OR 
            LOWER(ANNU_KRAMANK) LIKE LOWER(?) OR 
            LOWER(MALMATTA_NUMBER) LIKE LOWER(?) OR 
            LOWER(VARD_NUMBER) LIKE LOWER(?) OR 
            LOWER(PLOT_NO) LIKE LOWER(?) OR 
            LOWER(KHASARA_KRAMANK) LIKE LOWER(?) OR 
            LOWER(SURVEY_KRAMANK) LIKE LOWER(?) OR 
            LOWER(ADDRESS_NAGAR_SOCIETY) LIKE LOWER(?))`;
            values.push(`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`);
        }
        let totalCount = await getMalmattaNotdniRecordCount(query, values);
        query += ` ORDER BY NEWUSER_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        // console.log("query", query);
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
                            diva_batti_less_5 = ?,
                            diva_batti_plus_5 = ?,
                            aarogya_less_5 = ?,
                            aarogya_plus_5 = ?,
                            safae_less_5 = ?,
                            safae_plus_5 = ?,
                            samanya_pani_less_5 = ?,
                            samanya_pani_plus_5 = ?,
                            vishesh_pani_less_5 = ?,
                            vishesh_pani_plus_5 = ?,
                            ANNU_KRAMANK=?
                        WHERE
                            USER_ID = ?
                            AND NEWUSER_ID = ?
                            AND YEAR_ID = ?
                            AND NEWUSERSAVEKAR_ID = ?
                            AND vard_number = ?`;
            await executeQuery(query, [
                savakar.cmbyear,
                savakar.cmbyear1,
                savakar.kar_bhumikar,
                savakar.divabatti_kar,
                savakar.aarogya_rakshan_kar,
                savakar.safai_kar,
                savakar.samanya_pani_kar,
                savakar.vishesh_pani_kar,
                savakar.total,
                savakar.etar_fees,
                savakar.notice_fees,
                savakar.less5 || 0,
                savakar.plus5 || 0,
                savakar.diva_batti_less_5 || 0,
                savakar.diva_batti_plus_5 || 0,
                savakar.aarogya_less_5 || 0,
                savakar.aarogya_plus_5 || 0,
                savakar.safae_less_5 || 0,
                savakar.safae_plus_5 || 0,
                savakar.samanya_pani_less_5 || 0,
                savakar.samanya_pani_plus_5 || 0,
                savakar.vishesh_pani_less_5 || 0,
                savakar.vishesh_pani_plus_5 || 0,
                savakar.annu_kramank,
                savakar.user_id,
                savakar.newuser_id,
                savakar.years,
                sillakJodaExist[0].NEWUSERSAVEKAR_ID,
                savakar.ward_numbers
            ]);
            logger.info("sillak joda updated successfully");
        } else {
            const query = `INSERT INTO newusersavekar (
                USER_ID, NEWUSER_ID, YEAR_ID, YEAR1_ID, HOMEUSER_NAME, vard_number,
                BHUMI_KAR, DIVA_BATTI_KAR, AAROGYA_RAKSHAN_KAR, SAFAI_KAR,
                SAMANYA_PANI_KAR, VISHESH_PANI_KAR, ETAR_FEES, NOTICE_FEES,
                TOTAL, tdate, ttime, RNO, less5, plus5, ANNU_KRAMANK,
                diva_batti_less_5, diva_batti_plus_5,
                aarogya_less_5, aarogya_plus_5,
                safae_less_5, safae_plus_5,
                samanya_pani_less_5, samanya_pani_plus_5,
                vishesh_pani_less_5, vishesh_pani_plus_5
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`;
            await executeQuery(query, [
                savakar.user_id,
                savakar.newuser_id,
                savakar.cmbyear,
                savakar.cmbyear1,
                savakar.homeuser,
                savakar.ward_numbers,
                savakar.kar_bhumikar,
                savakar.divabatti_kar,
                savakar.aarogya_rakshan_kar,
                savakar.safai_kar,
                savakar.samanya_pani_kar,
                savakar.vishesh_pani_kar,
                savakar.etar_fees,
                savakar.notice_fees,
                savakar.total,
                savakar.rno,
                savakar.less5 || 0,
                savakar.plus5 || 0,
                savakar.annu_kramank,
                savakar.diva_batti_less_5 || 0,
                savakar.diva_batti_plus_5 || 0,
                savakar.aarogya_less_5 || 0,
                savakar.aarogya_plus_5 || 0,
                savakar.safae_less_5 || 0,
                savakar.safae_plus_5 || 0,
                savakar.samanya_pani_less_5 || 0,
                savakar.samanya_pani_plus_5 || 0,
                savakar.vishesh_pani_less_5 || 0,
                savakar.vishesh_pani_plus_5 || 0
            ]);
            logger.info("sillak joda added successfully");
        }
    } catch (error) {
        logger.error(`Error adding new customer in malmatta nodni form: ${error.message}`);
        throw error;
    }
}

let checkSillakJodaExist = async (selectParamValue: any) => {
    try {
        const query = `SELECT * FROM newusersavekar WHERE YEAR_ID = ? AND USER_ID = ? AND NEWUSER_ID = ? AND vard_number = ?`;
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
            SELECT * FROM newuser WHERE user_id = ? AND NEWUSER_ID = ? AND DELETED_AT IS NULL
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
    // console.log("user_id", user_id, "new_user_id", new_user_id);
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
        console.log("user_id-->", user_id, "new_user_id-->", new_user_id);
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
export async function getYear(): Promise<any | null> {
    try {
        const query = `
           SELECT Year_id, Year_name AS yyy 
            FROM year 
            WHERE Year_name = YEAR(CURDATE()) AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query,[]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function getNewUserSevakarDetails(sevakar:any): Promise<any | null> {
    try {
        // console.log("sevakar-->", sevakar);
        // const sevakarParam = {
        //     'user_id': Number(decoded_user['userId']),
        //     "previousYear_id": Number(years_response[0].Year_id) - 1,
        //     "vard_number": newUserDataDB[0].VARD_NUMBER,
        //     "newuser_id":newUserDataDB[0].NEWUSER_ID,
        // }
        const binding = [sevakar.user_id, sevakar.previousYear_id, sevakar.vard_number, sevakar.newuser_id];
        const query = `
                     SELECT 
                        IFNULL(SUM(bhumi_kar), 0) AS bhumi,
                        IFNULL(SUM(diva_batti_kar), 0) AS diva,
                        IFNULL(SUM(aarogya_rakshan_kar), 0) AS aarogya,
                        IFNULL(SUM(safai_kar), 0) AS safai,
                        IFNULL(SUM(samanya_pani_kar), 0) AS samanya,
                        IFNULL(SUM(vishesh_pani_kar), 0) AS vishesh,
                        IFNULL(SUM(etar_fees), 0) AS etar,
                        IFNULL(SUM(notice_fees), 0) AS notice,
                        IFNULL(SUM(total), 0) AS total,
                        IFNULL(SUM(less5), 0) AS less,
                        IFNULL(SUM(plus5), 0) AS plus,
                        IFNULL(SUM(diva_batti_less_5), 0) AS diva_batti_less_5,
                        IFNULL(SUM(diva_batti_plus_5),0) AS diva_batti_plus_5,
                        IFNULL(SUM(aarogya_less_5), 0) AS aarogya_less_5,
                        IFNULL(SUM(aarogya_plus_5), 0) AS aarogya_plus_5,
                        IFNULL(SUM(safae_less_5), 0) AS safae_less_5,
                        IFNULL(SUM(safae_plus_5),0) AS safae_plus_5,
                        IFNULL(SUM(samanya_pani_less_5), 0) AS samanya_pani_less_5,
                        IFNULL(SUM(samanya_pani_plus_5),0) AS samanya_pani_plus_5,
                        IFNULL(SUM(vishesh_pani_less_5), 0) AS vishesh_pani_less_5,
                        IFNULL(SUM(vishesh_pani_plus_5), 0) AS vishesh_pani_plus_5
                    FROM newusersavekar
                    WHERE USER_ID = ? AND YEAR_ID = ? AND vard_number = ? AND NEWUSER_ID = ? AND DELETED_AT IS NULL;

        `;
        console.log("binding-->", binding);
        console.log("query-->", query); 
        const results: any = await executeQuery(query, binding);
        console.log("results-->", results);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user sevakar details: ${error.message}`);
        throw error;
    }
}
export async function getNewDistinctUserDetails(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT DISTINCT NEWUSER_ID AS newww, VARD_NUMBER, ANNU_KRAMANK 
        FROM newuser 
        WHERE user_id = ? 
        AND NEWUSER_ID = ? AND DELETED_AT IS NULL
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
export async function getNewDistinctUserwithStartEndDetails( user_id: number, vard_number:number, start:number, end:number): Promise<any | null> {
    try {
        const query = `
        SELECT DISTINCT NEWUSER_ID AS new_user_id, VARD_NUMBER, ANNU_KRAMANK 
        FROM newuser 
        WHERE user_id = ? 
        AND VARD_NUMBER = ?
        AND ANNU_KRAMANK BETWEEN ? AND ? 
        AND DELETED_AT IS NULL
        ORDER BY ANNU_KRAMANK ASC
        `;
        const results: any = await executeQuery(query, [user_id, vard_number, start, end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}

export async function getEntriesDetailsForNamuna8Sarkari(data: any): Promise<any | null> {
    try {
        const query = `
            SELECT 
                A.*, 
                D.DISTRICT_NAME, 
                T.TALUKA_NAME, 
                P.PANCHAYAT_NAME, 
                G.GATGRAMPANCHAYAT_NAME
            FROM 
                entries A
            LEFT JOIN 
                district D ON D.DISTRICT_ID = A.DISTRICT_ID
            LEFT JOIN 
                taluka T ON T.TALUKA_ID = A.TALUKA_ID
            LEFT JOIN 
                panchayat P ON P.PANCHAYAT_ID = A.PANCHAYAT_ID
            LEFT JOIN 
                gatgrampanchayat G ON G.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID
            WHERE 
                A.DISTRICT_ID = ? AND
                A.TALUKA_ID = ? AND
                A.PANCHAYAT_ID = ? AND
                A.GATGRAMPANCHAYAT_ID = ? AND
                A.USER_ID = ?
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
export async function countConstructiontax(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT COUNT(constructiontax_id) AS count1
        FROM constructiontax
        WHERE user_id = ? AND newuser_id = ? AND DELETED_AT IS NULL
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
export async function countTaxationLand(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT IFNULL(COUNT(taxationland_id), 0) AS count
        FROM taxationland
        WHERE user_id = ? AND newuser_id = ? AND DELETED_AT IS NULL
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
export async function countTaxPayer(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT COUNT(taxpayers_id) AS count2
        FROM taxpayers
        WHERE user_id = ? AND newuser_id = ? AND DELETED_AT IS NULL
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
export async function getTaxationLandDetails(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
                    SELECT 
                    IFNULL(SUM(A.TOTALAREA), 0) AS TOTALAREA,
                    IFNULL(SUM(A.TOTALAREA1), 0) AS TOTALAREA1,
                    IFNULL(SUM(A.capital), 0) AS capital,
                    IFNULL(SUM(A.LEVYRATE), 0) AS LEVYRATE,
                    IFNULL(SUM(A.taxation), 0) AS taxation,
                    IFNULL(SUM(A.ANNUALVALUE), 0) AS ANNUALVALUE
                    FROM taxationland A
                    WHERE A.user_id = ? AND A.newuser_id = ? AND A.DELETED_AT IS NULL
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

export async function getTaxationandMilkat(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
                    SELECT 
                    MV.MILKAT_VAPAR_NAME
                    FROM 
                    taxationland A
                    LEFT JOIN 
                    milkat_vapar MV ON MV.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
                    WHERE A.user_id = ? AND A.newuser_id = ? AND A.DELETED_AT IS NULL
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


export async function getConstructionForsarkari8(new_user_id: number, user_id: number): Promise<any | null> {
    try {
        const query = `
                    SELECT 
                    A.*,
                    MV.MILKAT_VAPAR_NAME,
                    MM.DESCRIPTION_NAME,
                    CT2.VAPARACHE_PRAKAR,
                    F.FLOOR_NAME
                    FROM 
                        constructiontax A
                    LEFT JOIN 
                        milkat_vapar MV ON MV.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
                    LEFT JOIN 
                        malmatta MM ON MM.MALMATTA_ID = A.MALMATTA_ID
                    LEFT JOIN 
                        constructiontax CT2 ON CT2.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID
                    LEFT JOIN 
                        floor F ON F.FLOOR_ID = A.FLOOR_ID
                    WHERE 
                        A.newuser_id = ? AND A.user_id = ? AND A.DELETED_AT IS NULL
                    ORDER BY 
                        A.CONSTRUCTIONTAX_ID ASC
                    LIMIT 5
        `;
        const results: any = await executeQuery(query, [new_user_id,user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}



export async function getYearByYearId(year:number): Promise<any | null> {
    try {
        const query = `
           SELECT YEAR_ID, YEAR_NAME AS year 
            FROM year 
            WHERE YEAR_ID = ? AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query,[year]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function getRecordBasedOnStartandEnd(user_id: number, ward_number: number, start: number, end: number, new_user_id:any): Promise<any | null> {
    try {
        let results: any = [];
        if(new_user_id != null && new_user_id != undefined && new_user_id != ''){
            const query = `
            SELECT * 
                FROM newuser 
                WHERE NEWUSER_ID = ? 
            `;
            results = await executeQuery(query, [new_user_id]);
        } else{
            const query = `
            SELECT * 
                FROM newuser 
                WHERE user_id = ? 
                AND VARD_NUMBER = ? 
                AND ANNU_KRAMANK BETWEEN ? AND ? 
                AND DELETED_AT IS NULL
                ORDER BY ANNU_KRAMANK ASC
            `;
            results = await executeQuery(query, [user_id, ward_number, start, end]);
        }
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching records based on start and end: ${error.message}`);
        throw error;
    }
}

export async function getTaxLandData(user_id: number, ward_number: number, start: number, end: number): Promise<any | null> {
    try {
        const query = `
           SELECT newuser_id, Annu_kramank
            FROM taxationland
            WHERE user_id = ?
            AND vard_number = ?
            AND extra = 1
            AND taxpayersss = 1
            AND Annu_kramank BETWEEN ? AND ?
            AND DELETED_AT IS NULL
            ORDER BY CAST(Annu_kramank AS UNSIGNED) asc
        `;
        const results: any = await executeQuery(query, [user_id, ward_number, start, end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching tax land data: ${error.message}`);
        throw error;
    }
}

export async function getUserDataForRs3(user_id:number, new_user_id:number): Promise<any | null> {
    try {
        const query = `
            SELECT *
            FROM newuser
            WHERE DELETED_AT IS NULL 
            AND user_id = ?
            AND NEWUSER_ID = ?
        `;
        const results: any = await executeQuery(query, [user_id, new_user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}

export async function getUserDataForGharKar(user_id: number, ward_number: number, start: number, end: number): Promise<any | null> {
    try {
        const query = `
           SELECT *
            FROM newuser
            WHERE user_id = ?
            AND MILKAR_PRAKAR = 'घर कर लावायचा आहे'
            AND VARD_NUMBER = ?
            AND ANNU_KRAMANK BETWEEN ? AND ?
            AND DELETED_AT IS NULL
            ORDER BY ANNU_KRAMANK ASC
        `;
        const results: any = await executeQuery(query, [user_id, ward_number,start,end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}

export async function getImlakarNew(user_id: number, ward_number: number, start: number, end: number): Promise<any | null> {
    try {
        const query = `
           SELECT *
            FROM newuser
            WHERE user_id = ?
            AND MILKAR_PRAKAR = 'इमलाकर'
            AND VARD_NUMBER = ?
            AND ANNU_KRAMANK BETWEEN ? AND ?
            AND DELETED_AT IS NULL
            ORDER BY ANNU_KRAMANK ASC
        `;
        const results: any = await executeQuery(query, [user_id, ward_number,start,end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}
export async function getImlakarNewDistinct(user_id: number, ward_number: number, start: number, end: number): Promise<any | null> {
    try{
        const query = `
           SELECT DISTINCT(NEWUSER_ID), ANNU_KRAMANK
            FROM newuser
            WHERE 
                MILKAR_PRAKAR = 'इमलाकर'
                AND USER_ID = ?
                AND VARD_NUMBER = ?
                AND ANNU_KRAMANK BETWEEN ? AND ?
                AND DELETED_AT IS NULL
            ORDER BY ANNU_KRAMANK ASC;

        `;
        const results: any = await executeQuery(query, [user_id, ward_number,start,end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}
export async function getImlakarAnukramnika(user_id: number, ward_number: number): Promise<any | null> {
    try {
        const query = `
           SELECT *
            FROM newuser
            WHERE DELETED_AT IS NULL
                AND MILKAR_PRAKAR = 'इमलाकर'
                AND user_id = ?
                AND VARD_NUMBER = ?        `;
        const results: any = await executeQuery(query, [user_id,ward_number]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}

export async function getUserDataForAdhikrutGharkul(user_id: number, ward_number: number, start: number, end: number): Promise<any | null> {
    try {
        const query = `
           SELECT *
            FROM newuser
            WHERE user_id = ?
            AND (MILKAR_PRAKAR = 'अधिकृत' OR MILKAR_PRAKAR = 'घरकुल')
            AND vard_number = ?
            AND annu_kramank BETWEEN ? AND ?
            AND DELETED_AT IS NULL
            ORDER BY annu_kramank ASC
        `;
        const results: any = await executeQuery(query, [user_id, ward_number,start,end]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}


export async function searchCustomer(user_id: number, data: any, page:number): Promise<any | null> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let sql = `
            SELECT DISTINCT b.ANNU_KRAMANK,
                       c.MALMATTA_NUMBER,
                       d.VARD_NUMBER,
                       e.PLOT_NO,
                       f.KHASARA_KRAMANK,
                       g.SURVEY_KRAMANK,
                       h.HOMEUSER_NAME,
                       i.BHOGATWARGARACHE_NAME,
                       a.*
                FROM newuser a
                LEFT JOIN newuser b ON b.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser c ON c.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser d ON d.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser e ON e.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser f ON f.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser g ON g.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser h ON h.NEWUSER_ID = a.NEWUSER_ID
                LEFT JOIN newuser i ON i.NEWUSER_ID = a.NEWUSER_ID
                WHERE a.DELETED_AT IS NULL AND  a.USER_ID = ?
        `;
        const params: (number | string)[] = [user_id];

            if (data.txtnumber) {
                sql += ' AND a.ANNU_KRAMANK LIKE ?';
                params.push(`%${data.txtnumber}%`);
            }
            if (data.txt_malmatta_number) {
                sql += ' AND a.MALMATTA_NUMBER LIKE ?';
                params.push(`%${data.txt_malmatta_number}%`);
            }
            if (data.txt_vard_number) {
                sql += ' AND a.VARD_NUMBER LIKE ?';
                params.push(`%${data.txt_vard_number}%`);
            }
            if (data.txt_plot_number) {
                sql += ' AND a.PLOT_NO LIKE ?';
                params.push(`%${data.txt_plot_number}%`);
            }
            if (data.txt_khasara_number) {
                sql += ' AND a.KHASARA_KRAMANK LIKE ?';
                params.push(`%${data.txt_khasara_number}%`);
            }
            if (data.txt_survey_number) {
                sql += ' AND a.SURVEY_KRAMANK LIKE ?';
                params.push(`%${data.txt_survey_number}%`);
            }
            if (data.txt_khatedarache_name) {
                sql += ' AND a.HOMEUSER_NAME LIKE ?';
                params.push(`%${data.txt_khatedarache_name}%`);
            }
            if (data.txt_bhogatwarache_name) {
                sql += ' AND a.BHOGATWARGARACHE_NAME LIKE ?';
                params.push(`%${data.txt_bhogatwarache_name}%`);
            }
            if (data.txt_patta) {
                sql += ' AND a.address_nagar_society LIKE ?';
                params.push(`%${data.txt_patta}%`);
            }
        let totalCount = await getMalmattaNotdniRecordCount(sql, params);
        sql += ` ORDER BY a.ANNU_KRAMANK ASC LIMIT ${limit} OFFSET ${offset}`;
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

export async function getConstructionTaxDetailsForNamuna8(user_id: number, new_user_id: number): Promise<any | null> {
    try {
        const query = `
                SELECT A.*, 
                    M.MILKAT_VAPAR_NAME, 
                    MAL.DESCRIPTION_NAME, 
                    F.FLOOR_NAME 
                FROM constructiontax A
                LEFT JOIN milkat_vapar M ON M.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
                LEFT JOIN malmatta MAL ON MAL.MALMATTA_ID = A.MALMATTA_ID
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

export async function getTaxPayerDetailsForNamuna8(user_id: number, new_user_id: number): Promise<any | null> {
    try {
        // console.log("user_id-->", user_id, "new_user_id-->", new_user_id);
        const query = `
            SELECT A.*, 
                M.MILKAT_VAPAR_NAME, 
                MAL.DESCRIPTION_NAME, 
                MANO.MANORAMASTER_NAME  
            FROM taxpayers A
            LEFT JOIN milkat_vapar M ON M.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
            LEFT JOIN malmatta MAL ON MAL.MALMATTA_ID = A.MALMATTA_ID
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

export async function updateCustomerImagePath(imaggeData: any): Promise<void> {
    try {
        const query = `UPDATE newuser SET r_path = ? WHERE NEWUSER_ID = ? AND user_id = ?`;
        await executeQuery(query, [imaggeData.r_path, imaggeData.new_user_id, imaggeData.user_id]);
        logger.info("Customer image successfully updated");
    } catch (error) {
        logger.error(`Error updating the customer image: ${error.message}`);
        throw error;
    }
}

export async function fetchCurrentYear():Promise<any | null>{
    try {
        // const query = `
        //    SELECT YEAR(NOW()) AS yyy
        // `;
        const query = `SELECT YEAR_ID, YEAR_NAME AS yyy 
                FROM year  
                WHERE YEAR_NAME = YEAR(CURDATE())`;
        const results: any = await executeQuery(query,[]);
        if (results.length > 0) {
           let returnData = {
                'yearId': results[0].YEAR_ID,
                'currentYear': Number(results[0].yyy),
                'prevuiousYear': Number(results[0].yyy) - 1,
                'nextYear': Number(results[0].yyy) + 1,
                'year_4': Number(results[0].yyy) + 4,
                'year_3': Number(results[0].yyy) + 3,
                'yearId_negative_1': (results[0].YEAR_ID) - 1

            }
            return returnData as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function  fetchBhumu_bhumiCount(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = `SELECT 
                    IFNULL(SUM(manoraaddition), 0) AS bhumi,
                    COUNT(BHUMIKAR) AS bhumicount
                FROM newuser
                WHERE vanijya <> 'औद्योगिक'
                AND vanijya <> 'मनोरा'
                AND user_id = ?
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS <= ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}

export async function fetchViz_VizCount(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = `SELECT 
                    IFNULL(SUM(VIZ_DIVVABATTIKAR), 0) AS VIZ,
                    COUNT(CHECK1) AS VIZcount
                FROM newuser
                WHERE user_id = ?
                AND CHECK1 = 'on'
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}
export async function fetchAarogya_aarogyaCount(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                IFNULL(SUM(AAROGYA_RAKSHAN_KAR), 0) AS aarogya,
                COUNT(CHECK2) AS aarogyacount
            FROM newuser
            WHERE user_id = ?
            AND CHECK2 = 'on'
            AND VARD_NUMBER = ?
            AND YEARS >= ?
            AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}
export async function fetchSafai_SafaiCount(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                    IFNULL(SUM(SAFAI_KAR), 0) AS safai,
                    COUNT(CHECK3) AS safaicount
                FROM newuser
                WHERE user_id = ?
                AND CHECK3 = 'on'
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}

export async function fetchSamanya_Pani_kar_count(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                    IFNULL(SUM(SAMANYA_PANI_KAR), 0) AS pani,
                    COUNT(CHECK4) AS panicount
                FROM newuser
                WHERE user_id = ?
                AND CHECK4 = 'on'
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}
export async function fetchViseshPaniKar_Count(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                    IFNULL(SUM(VISHESH_PANI_KAR), 0) AS vishesh,
                    COUNT(CHECK5) AS visheshcount
                FROM newuser
                WHERE user_id = ?
                AND CHECK5 = 'on'
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}

export async function fetchVanijya_Count(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                    IFNULL(SUM(BHUMIKAR), 0) AS vani,
                    COUNT(vanijya) AS vanicount
                FROM newuser
                WHERE 
                vanijya='औद्योगिक'
                AND user_id = ?
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}

export async function fetchManora_Count(user_id, ward_no, previousYear, year_4):Promise<any | null>{
    try{
        const query = ` SELECT 
                    IFNULL(SUM(BHUMIKAR), 0) AS mano,
                    COUNT(vanijya) AS manocount
                FROM newuser
                WHERE 
                vanijya='मनोरा'
                AND user_id = ?
                AND VARD_NUMBER = ?
                AND YEARS >= ?
                AND YEARS < ?`;
         const results: any = await executeQuery(query,[user_id, ward_no, previousYear, year_4]);
        if (results.length > 0) {
            return results as any;
        }
        return [];
    }catch(error){
        logger.error(`Error fetching count details: ${error.message}`);
        throw error;
    }
}

export async function getTotalNewUserSevakar(year_id, new_user_id, user_id): Promise<Number> {
    try {
        const query = `
                    SELECT IFNULL(SUM(TOTAL), 0) AS tot
                    FROM newusersavekar
                    WHERE YEAR_ID = ?
                    AND NEWUSER_ID = ?
                    AND USER_ID = ? AND DELETED_AT IS NULL;

        `;
        const results: any = await executeQuery(query, [user_id, year_id, new_user_id]);
        if (results.length > 0) {
            return results[0].tot as Number;
        }
        return 0;
    } catch (error) {
        logger.error(`Error fetching new user sevakar details: ${error.message}`);
        throw error;
    }
}

export async function getDataByUserIdAndVardNumber(user_id:number, vard_number:number): Promise<any | null> {
    try {
        const query = `
            SELECT *
            FROM newuser
            WHERE user_id = ?
            AND VARD_NUMBER = ?
            AND DELETED_AT IS NULL LIMIT 1
        `;
        const results: any = await executeQuery(query, [user_id, vard_number]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}


export async function getAarogyaRakshanKar(user_id:number, vard_number:number): Promise<any | null> {
    try {
        const query = `
            SELECT COUNT(AAROGYA_RAKSHAN_KAR) AS aarogya 
            FROM newuser 
            WHERE user_id = ? 
                AND VARD_NUMBER = ? 
                AND AAROGYA_RAKSHAN_KAR <> 0
        `;
        const results: any = await executeQuery(query, [user_id, vard_number]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}

export async function getSafaeKar(user_id:number, vard_number:number): Promise<any | null> {
    try {
        const query = `
            SELECT COUNT(SAFAI_KAR) AS SAFAI_KAR
            FROM newuser
            WHERE user_id = ?
                AND VARD_NUMBER = ?
                AND SAFAI_KAR <> 0
        `;
        const results: any = await executeQuery(query, [user_id, vard_number]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }
}

export async function getBhumikar_bhumiCountandOther(user_id:number, vard_number:number): Promise<any | null> {
    try {
        const query = `
            SELECT 
                IFNULL(SUM(a.manoraaddition), 0) AS bhumikar,
                COUNT(a.BHUMIKAR) AS bhumicount,
                IFNULL(SUM(a.VIZ_DIVVABATTIKAR), 0) AS VIZ,
                (SELECT COUNT(b.CHECK1) 
                FROM newuser b 
                WHERE b.user_id = a.user_id 
                AND b.VARD_NUMBER = a.VARD_NUMBER 
                AND b.CHECK1 = 'on') AS VIZcount,
                IFNULL(SUM(a.AAROGYA_RAKSHAN_KAR), 0) AS aarogya,
                (SELECT COUNT(c.CHECK2) 
                FROM newuser c 
                WHERE c.user_id = a.user_id 
                AND c.VARD_NUMBER = a.VARD_NUMBER 
                AND c.CHECK2 = 'on') AS aarogyacount,
                IFNULL(SUM(a.SAFAI_KAR), 0) AS safai,
                (SELECT COUNT(d.CHECK3) 
                FROM newuser d 
                WHERE d.user_id = a.user_id 
                AND d.VARD_NUMBER = a.VARD_NUMBER 
                AND d.CHECK3 = 'on') AS safaicount,
                IFNULL(SUM(a.SAMANYA_PANI_KAR), 0) AS pani,
                (SELECT COUNT(e.CHECK4) 
                FROM newuser e 
                WHERE e.user_id = a.user_id 
                AND e.VARD_NUMBER = a.VARD_NUMBER 
                AND e.CHECK4 = 'on') AS panicount,
                IFNULL(SUM(a.VISHESH_PANI_KAR), 0) AS vishesh,
                (SELECT COUNT(f.CHECK5) 
                FROM newuser f 
                WHERE f.user_id = a.user_id 
                AND f.VARD_NUMBER = a.VARD_NUMBER 
                AND f.CHECK5 = 'on') AS visheshcount
            FROM newuser a
            WHERE a.vanijya NOT IN ('औद्योगिक', 'मनोरा')
            AND a.user_id = ?
            AND a.VARD_NUMBER = ?
            GROUP BY a.VARD_NUMBER, a.user_id
        `;
        const results: any = await executeQuery(query, [user_id, vard_number]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching user data for Rs3: ${error.message}`);
        throw error;
    }

}

export async function getBhumi_deva_from_newsevakar(user_id:number, vard_number:number, year_id:number): Promise<any | null> {
    try {
        const query = `
           SELECT 
                IFNULL(SUM(a.BHUMI_KAR), 0) AS bhumi,
                IFNULL(SUM(a.DIVA_BATTI_KAR), 0) AS diva,
                IFNULL(SUM(a.AAROGYA_RAKSHAN_KAR), 0) AS aarogya,
                IFNULL(SUM(a.SAFAI_KAR), 0) AS safai,
                IFNULL(SUM(a.SAMANYA_PANI_KAR), 0) AS samanya,
                IFNULL(SUM(a.VISHESH_PANI_KAR), 0) AS vishesh,
                IFNULL(SUM(a.ETAR_FEES), 0) AS etar,
                IFNULL(SUM(a.NOTICE_FEES), 0) AS notice,
                IFNULL(SUM(a.TOTAL), 0) AS total
            FROM newusersavekar a
            JOIN newuser b ON a.NEWUSER_ID = b.NEWUSER_ID
            WHERE b.vanijya NOT IN ('औद्योगिक', 'मनोरा')
            AND b.VARD_NUMBER = ?
            AND a.USER_ID = ?
            AND a.YEAR_ID < ?
        `;
        const results: any = await executeQuery(query,[vard_number, user_id, year_id]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function getAudhogikData(user_id:number, vard_number:number, vanijya:string): Promise<any | null> {
    try {
        const query = `
           SELECT 
                IFNULL(SUM(a.BHUMIKAR), 0) AS manoraaddition,
                COUNT(a.NEWUSER_ID) AS ws,
                IFNULL(SUM(a.VIZ_DIVVABATTIKAR), 0) AS VIZ1,

                (SELECT COUNT(b.CHECK1)
                FROM newuser b
                WHERE b.user_id = a.user_id 
                AND b.VARD_NUMBER = a.VARD_NUMBER
                AND b.CHECK1 = 'on') AS VIZcount1,

                IFNULL(SUM(a.AAROGYA_RAKSHAN_KAR), 0) AS aarogya1,

                (SELECT COUNT(c.CHECK2)
                FROM newuser c
                WHERE c.user_id = a.user_id 
                AND c.VARD_NUMBER = a.VARD_NUMBER
                AND c.CHECK2 = 'on') AS aarogyacount1,

                IFNULL(SUM(a.SAFAI_KAR), 0) AS safai1,

                (SELECT COUNT(d.CHECK3)
                FROM newuser d
                WHERE d.user_id = a.user_id 
                AND d.VARD_NUMBER = a.VARD_NUMBER
                AND d.CHECK3 = 'on') AS safaicount1,

                IFNULL(SUM(a.SAMANYA_PANI_KAR), 0) AS pani1,

                (SELECT COUNT(e.CHECK4)
                FROM newuser e
                WHERE e.user_id = a.user_id 
                AND e.VARD_NUMBER = a.VARD_NUMBER
                AND e.CHECK4 = 'on') AS panicount1,

                IFNULL(SUM(a.VISHESH_PANI_KAR), 0) AS vishesh1,

                (SELECT COUNT(f.CHECK5)
                FROM newuser f
                WHERE f.user_id = a.user_id 
                AND f.VARD_NUMBER = a.VARD_NUMBER
                AND f.CHECK5 = 'on') AS visheshcount1,

                IFNULL(SUM(a.VIZ_DIVVABATTIKAR), 0) AS VIZ_DIVVABATTIKAR,
                IFNULL(SUM(a.AAROGYA_RAKSHAN_KAR), 0) AS AAROGYA_RAKSHAN_KAR,
                IFNULL(SUM(a.SAFAI_KAR), 0) AS SAFAI_KAR,
                IFNULL(SUM(a.SAMANYA_PANI_KAR), 0) AS SAMANYA_PANI_KAR,
                IFNULL(SUM(a.VISHESH_PANI_KAR), 0) AS VISHESH_PANI_KAR,
                IFNULL(SUM(a.EKUN), 0) AS EKUN

            FROM newuser a
            WHERE a.vanijya = ?
            AND a.user_id = ?
            AND a.VARD_NUMBER = ?
            GROUP BY a.VARD_NUMBER, a.user_id
        `;
        const results: any = await executeQuery(query,[vard_number, user_id, vanijya]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return {
            manoraaddition: 0,
            ws: 0,
            VIZ1: 0,
            VIZcount1: 0,
            aarogya1: 0,
            aarogyacount1: 0,
            safai1: 0,
            safaicount1: 0,
            pani1: 0,
            panicount1: 0,
            vishesh1: 0,
            visheshcount1: 0,
            VIZ_DIVVABATTIKAR: 0,
            AAROGYA_RAKSHAN_KAR: 0,
            SAFAI_KAR: 0,
            SAMANYA_PANI_KAR: 0,
            VISHESH_PANI_KAR: 0,
            EKUN: 0
        };
    } catch (error) {
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function getAudhogik_from_newsevakar(user_id:number, vard_number:number, year_id:number, vanikya:string): Promise<any | null> {
    try{
        const query = `
          SELECT 
                IFNULL(SUM(a.BHUMI_KAR), 0) AS bhumi_kar,
                IFNULL(SUM(a.DIVA_BATTI_KAR), 0) AS diva_batti_kar,
                IFNULL(SUM(a.AAROGYA_RAKSHAN_KAR), 0) AS aarogya_rakshan_kar,
                IFNULL(SUM(a.SAFAI_KAR), 0) AS safai_kar,
                IFNULL(SUM(a.SAMANYA_PANI_KAR), 0) AS samanya_pani_kar,
                IFNULL(SUM(a.VISHESH_PANI_KAR), 0) AS vishesh_pani_kar,
                IFNULL(SUM(a.ETAR_FEES), 0) AS etar_fees,
                IFNULL(SUM(a.NOTICE_FEES), 0) AS notice_fees,
                IFNULL(SUM(a.TOTAL), 0) AS total
            FROM newusersavekar a
            JOIN newuser b ON a.NEWUSER_ID = b.NEWUSER_ID
            WHERE b.vanijya = ?
            AND b.VARD_NUMBER = ?
            AND a.USER_ID = ?
            AND a.YEAR_ID < ?
        `;
        const results: any = await executeQuery(query,[vard_number, user_id, year_id, vanikya]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    }catch(error){
        logger.error(`Error fetching year details: ${error.message}`);
        throw error;
    }
}

export async function searchMagnicheBillData(user_id: number, data: any, page:number): Promise<any | null> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let sql = `
             SELECT
                N.ANNU_KRAMANK as N_ANNU_KRAMANK,
                N.MALMATTA_NUMBER as N_MALMATTA_NUMBER,
                N.VARD_NUMBER as N_VARD_NUMBER,
                N.HOMEUSER_NAME as N_HOMEUSER_NAME,
                A.*
            FROM newuser A
            INNER JOIN newuser N ON N.NEWUSER_ID = A.NEWUSER_ID
            WHERE 
                A.NEWUSER_ID NOT IN (
                    SELECT DISTINCT B.NEWUSER_ID
                    FROM vasuli B
                    WHERE B.user_id = ?
                )
                AND A.user_id = ?
                AND A.DELETED_AT IS NULL
        `;
        const params: (number | string)[] = [user_id, user_id];

            if (data.from_year) {
                sql += ' AND A.YEARS_ID >= ?';
                params.push(`${data.from_year}`);
            }
            if (data.to_year) {
                sql += ' AND A.YEARS_ID <= ?';
                params.push(`${data.to_year}`);
            }
            if (data.from_anu_kramank) {
                sql += ' AND A.ANNU_KRAMANK >= ?';
                params.push(`${data.from_anu_kramank}`);
            }
            if (data.to_anu_kramank) {
                sql += ' AND A.ANNU_KRAMANK <= ?';
                params.push(`${data.to_anu_kramank}`);
            }
            if (data.vard_number) {
                sql += ' AND A.VARD_NUMBER LIKE ?';
                params.push(`%${data.vard_number}%`);
            }
        let totalCount = await getMalmattaNotdniRecordCount(sql, params);
        sql += ` ORDER BY A.VARD_NUMBER, A.ANNU_KRAMANK `;
        // sql += ` ORDER BY A.VARD_NUMBER, A.ANNU_KRAMANK ASC LIMIT ${limit} OFFSET ${offset}`;
        // const results: any = await executeQuery(sql, params);
        // if (results.length > 0) {
        //     return results as any;
        // }
        // return [];
        // console.log("sql", sql);
        // console.log("params", params);    
        return executeQuery(sql, params).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("magniche bill fetch data error: ", error);
            return [];
        });
    } catch (error) {
        logger.error(`Error searching magniche bill: ${error.message}`);
        throw error;
    }
}


export async function checkSillakJodaExistAPI(data: any): Promise<any | null> {
    try {
        // const selectParamValue = {
        //     'year_id': data.year_id,
        //     'user_id': data.user_id,
        //     'newuser_id': data.newuser_id,
        //     'ward_no': data.ward_no
        // };
        const result = await checkSillakJodaExist(data);
        return result;
    } catch (error) {
        logger.error(`Error checking sillak joda exist: ${error.message}`);
        throw error;
    }
}
