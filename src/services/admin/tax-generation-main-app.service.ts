import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export async function getTaxGenerationData(page:number,ward_no:string,from_year:string,to_year:string,user_id:number): Promise<any | null> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let sql = `
             SELECT 
                (SELECT COUNT(newusersavekar_id) 
                FROM newusersavekar b WHERE b.NEWUSERSAVEKAR_ID=A.NEWUSERSAVEKAR_ID) AS max_user,
                (SELECT DISTINCT b.vard_number 
                FROM newusersavekar b WHERE b.NEWUSERSAVEKAR_ID=A.NEWUSERSAVEKAR_ID) AS VARD_NUMBER,
                (SELECT DISTINCT c.YEAR_NAME 
                FROM year c WHERE c.YEAR_ID=A.YEAR_ID) AS YEAR_NAME,
                (SELECT DISTINCT d.YEAR_NAME 
                FROM year d WHERE d.YEAR_ID=A.YEAR1_ID) AS YEAR_NAME1,
                (SELECT MAX(year_id) 
                FROM newusersavekar e WHERE e.NEWUSERSAVEKAR_ID=A.NEWUSERSAVEKAR_ID) AS maxx,
                IFNULL((SELECT total 
                        FROM newusersavekar f 
                        WHERE f.YEAR_ID < ? AND f.vard_number=A.vard_number AND f.NEWUSERSAVEKAR_ID=A.NEWUSERSAVEKAR_ID AND f.USER_ID=?),0) AS FGFHH,
                A.HOMEUSER_NAME,A.BHUMI_KAR,A.DIVA_BATTI_KAR,A.AAROGYA_RAKSHAN_KAR,A.SAFAI_KAR,A.SAMANYA_PANI_KAR,A.VISHESH_PANI_KAR,A.TOTAL,
                IFNULL(A.EMARTICHE_KARAAKARNI,0) AS EMARTICHE_KARAAKARNI,
                IFNULL(A.KHULA_BHUKAND,0) AS KHULA_BHUKAND
                FROM newusersavekar A
                WHERE A.DELETED_AT IS NULL AND USER_ID = ?`;
        const params: (number | string)[] = [from_year, user_id, user_id];

        if (ward_no) {
            sql += " AND A.vard_number = ?";
            params.push(`${ward_no}`);
        }

        if (from_year) {
            sql += " AND A.YEAR_ID = ?";
            params.push(`${from_year}`);
        }

        if (to_year) {
            sql += " AND A.YEAR1_ID = ?";
            params.push(`${to_year}`);
        }
        let totalCount = await getRecordCount(sql, params);
        sql += ` ORDER BY A.ANNU_KRAMANK,A.vard_number DESC LIMIT ${limit} OFFSET ${offset}`;
        // console.log("getTaxGenerationData SQL Query: ", totalCount);
        //  return Object.keys(result).length;
        return executeQuery(sql, params).then(result => {    
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount.totalCount, 'sumCalculation':totalCount } : null;
        }).catch(error => {
            console.error("getTaxGenerationData fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error(`Error searching getTaxGenerationData: ${error.message}`);
        throw error;
    }
}

let getRecordCount = async (query: string, param: any) => {
    try {
        const result = await executeQuery(query, param);
        let sum = (result as any[]).reduce((acc: any, row: any) => {
            return {
                FGFHH: acc.FGFHH + row.FGFHH,
                BHUMI_KAR: acc.BHUMI_KAR + row.BHUMI_KAR,
                DIVA_BATTI_KAR: acc.DIVA_BATTI_KAR + row.DIVA_BATTI_KAR,
                AAROGYA_RAKSHAN_KAR: acc.AAROGYA_RAKSHAN_KAR + row.AAROGYA_RAKSHAN_KAR,
                SAFAI_KAR: acc.SAFAI_KAR + row.SAFAI_KAR,
                SAMANYA_PANI_KAR: acc.SAMANYA_PANI_KAR + row.SAMANYA_PANI_KAR,
                VISHESH_PANI_KAR: acc.VISHESH_PANI_KAR + row.VISHESH_PANI_KAR,
                TOTAL: acc.TOTAL + row.TOTAL,
                EMARTICHE_KARAAKARNI: acc.EMARTICHE_KARAAKARNI + row.EMARTICHE_KARAAKARNI,
                KHULA_BHUKAND: acc.KHULA_BHUKAND + row.KHULA_BHUKAND,
            };
        }, {
            FGFHH: 0,
            BHUMI_KAR: 0,
            DIVA_BATTI_KAR: 0,
            AAROGYA_RAKSHAN_KAR: 0,
            SAFAI_KAR: 0,
            SAMANYA_PANI_KAR: 0,
            VISHESH_PANI_KAR: 0,
            TOTAL: 0,
            EMARTICHE_KARAAKARNI: 0,
            KHULA_BHUKAND: 0,
        });

        // console.log("Sum of fields: ", sum);
        const totalCount = Object.keys(result).length;
        sum.totalCount = totalCount;
        return sum;
    } catch (err) {
        logger.error('Error fetching getRecordCount', err);
        throw err;
    }
};