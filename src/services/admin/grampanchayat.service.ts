import e = require("express");
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


export const addGramPanchayat = async (params: object) => {
    try {
        let sql = `SELECT PANCHAYAT_ID FROM panchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_NAME=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                sql = `INSERT INTO panchayat (DISTRICT_ID, TALUKA_ID, PANCHAYAT_NAME) VALUES (?, ?, ?)`;
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("addGramPanchayat fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addGrampanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addGrampanchaya :: ", error)
        throw new Error(error)
    }

}

export const getGramPanchayat = async (params: object) => {
    try {
        let sql = ` select p.PANCHAYAT_ID ,p.DISTRICT_ID , p.TALUKA_ID , RTRIM(p.PANCHAYAT_NAME)  AS PANCHAYAT_NAME,  RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME, RTRIM(t.TALUKA_NAME) AS TALUKA_NAME from panchayat p join district d on p.DISTRICT_ID = d.DISTRICT_ID join taluka t on p.TALUKA_ID = t.TALUKA_ID where p.PANCHAYAT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("GramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const getGramPanchayatList = async (params: object) => {
    try {
        const { limit, offset, searchValue } = params as { limit: number, offset: number, searchValue?: string };
        let sql = `select p.PANCHAYAT_ID ,p.DISTRICT_ID , p.TALUKA_ID , RTRIM(p.PANCHAYAT_NAME) AS PANCHAYAT_NAME,  RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME, RTRIM(t.TALUKA_NAME) AS TALUKA_NAME 
               from panchayat p 
               join district d on p.DISTRICT_ID = d.DISTRICT_ID 
               join taluka t on p.TALUKA_ID = t.TALUKA_ID 
               WHERE p.IS_DELETE=0`;

        let data = [];
        if (searchValue) {
            sql += ` AND (RTRIM(LOWER(p.PANCHAYAT_NAME)) LIKE LOWER(?)  OR RTRIM(LOWER(t.TALUKA_NAME)) LIKE LOWER(?))`;
            let searchText = `%${searchValue}%`
            data = [searchText, searchText, limit, offset];
        } else {
            data = [limit, offset];
        }

        let total_count = await getGramPanchayaCount(sql, data);

        sql += ` ORDER BY p.PANCHAYAT_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, data).then(result => {
            return (result) ? { 'data': result, 'total_count': total_count } : null;
        }).catch(error => {
            console.error("getGramPanchayatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

export const getGramPanchayaCount = async (sql: string, params: object) => {
    try {

        return executeQuery(sql, params).then(result => {
            return (result) ? Object.keys(result).length : 0;

        }).catch(error => {
            console.error("getGramPanchayatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

export const updateGramPanchayat = async (params: object) => {
    try {
        let sql = `SELECT PANCHAYAT_ID FROM panchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_NAME=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                let sql = `UPDATE panchayat SET DISTRICT_ID = ?, TALUKA_ID=?, PANCHAYAT_NAME=? WHERE PANCHAYAT_ID = ? and IS_DELETE = 0`
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("updateGramPanchayat fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("updateGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const deleteGramPanchayat = async (params: object) => {
    try {
        let sql = `UPDATE panchayat SET IS_DELETE = 1 WHERE PANCHAYAT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteGramPanchayat :: ", error)
        throw new Error(error)
    }
}

// export const getTalukaListBYDistrictID = async (params: object) => {
//     try {
//         // console.log("params",params)
//         // const { limit, offset } = params as { limit: number, offset: number };
//         let sql = `select t.TALUKA_ID,RTRIM(t.TALUKA_NAME),RTRIM(d.DISTRICT_NAME),t.DISTRICT_ID from taluka t join district d on t.DISTRICT_ID = d.DISTRICT_ID WHERE t.IS_DELETE=0  AND t.DISTRICT_ID=? ORDER BY t.TALUKA_ID DESC`;
//         return executeQuery(sql, [params]).then(result => {
//             return (result) ? result : null;
//         }).catch(error => {
//             console.error("getTalukaList fetch data error: ", error);
//             return null;
//         });
//     } catch (error) {
//         logger.error("getTalukaList :: ", error);
//         throw new Error(error);
//     }

// }