import e = require("express");
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


export const addTaluka = async (params: object) => {
    try {
        let sql = `SELECT DISTRICT_ID FROM taluka WHERE DISTRICT_ID = ? AND RTRIM(TALUKA_NAME)=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                sql = `INSERT INTO taluka (DISTRICT_ID, TALUKA_NAME) VALUES (?, ?)`;
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("addTaluka fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addTaluka fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addTaluka :: ", error)
        throw new Error(error)
    }

}

export const getTaluka = async (params: object) => {
    try {
        let sql = ` select t.TALUKA_ID,RTRIM(t.TALUKA_NAME) as TALUKA_NAME ,RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME,t.DISTRICT_ID from taluka t join district d on t.DISTRICT_ID = d.DISTRICT_ID where t.TALUKA_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("Taluka fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getTaluka :: ", error)
        throw new Error(error)
    }
}

export const getTalukaList = async (params: object) => {
    try {
        const { limit, offset, search } = params as { limit: number, offset: number, search?: string };
        let sql = `select t.TALUKA_ID,RTRIM(t.TALUKA_NAME)  AS TALUKA_NAME ,RTRIM(d.DISTRICT_NAME) AS DISTRICT_NAME,t.DISTRICT_ID from taluka t join district d on t.DISTRICT_ID = d.DISTRICT_ID WHERE t.IS_DELETE=0`;
        
        if (search) {
            sql += ` AND (RTRIM(LOWER(t.TALUKA_NAME)) LIKE LOWER(?) OR RTRIM(LOWER(d.DISTRICT_NAME)) LIKE LOWER(?))`;
        }
        const queryParams = search ? [`%${search}%`, `%${search}%`, limit, offset] : [limit, offset];
        let totalCount = await getTalukaListCount(sql,queryParams);

        sql += ` ORDER BY t.TALUKA_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, queryParams).then(result => {
            result =  {result,totalCount:totalCount};
            return (result) ? result : null;
        }).catch(error => {
            console.error("getTalukaList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getTalukaList :: ", error);
        throw new Error(error);
    }

}
export const getTalukaListCount = async (sql,params) => {
    try {
        
        return executeQuery(sql, params).then((result: any[]) => {
            return Object.keys(result).length;
        }).catch(error => {
            console.error("getTalukaListCount fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getTalukaListCount :: ", error);
        throw new Error(error);
    }

}


export const updateTaluka = async (params: object) => {
    try {
        let sql = `SELECT DISTRICT_ID FROM taluka WHERE DISTRICT_ID = ? AND RTRIM(TALUKA_NAME)=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                let sql = `UPDATE taluka SET DISTRICT_ID = ?, TALUKA_NAME=? WHERE TALUKA_ID = ? and IS_DELETE = 0`
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("updateTaluka fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addTaluka fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("updateTaluka :: ", error)
        throw new Error(error)
    }
}

export const deleteTaluka = async (params: object) => {
    try {
        let sql = `UPDATE taluka SET IS_DELETE = 1 WHERE TALUKA_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteTaluka fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteTaluka :: ", error)
        throw new Error(error)
    }
}

export const getTalukaListBYDistrictID = async (params: object) => {
    try {
        let sql = `select TALUKA_ID,TALUKA_NAME from taluka t where DISTRICT_ID = ? and IS_DELETE =0 order by TALUKA_ID desc`;
        return executeQuery(sql, [params]).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getTalukaList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getTalukaList :: ", error);
        throw new Error(error);
    }

}