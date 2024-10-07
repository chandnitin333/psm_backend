import e = require("express");
import { executeQuery } from "../../config/db/db";
import { EMAIL } from "../../constants/constant";
import { logger } from "../../logger/Logger";


export const addTaluka = async (params: object) => {
    try {
        let sql = `INSERT INTO taluka (DISTRICT_ID, TALUKA_NAME) VALUES (?, ?)`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("addTaluka Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addTaluka :: ", error)
        throw new Error(error)
    }

}

export const getTaluka = async (params: object) => {
    try {
        let sql = ` SELECT
                        TALUKA_ID,
                        DISTRICT_ID,
                        DISTRICT_NAME,
                        TALUKA_NAME
                    FROM
                        taluka t
                    JOIN district d ON t.DISTRICT_ID = d.DISTRICT_ID  
                    WHERE TALUKA_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("Taluka Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getTaluka :: ", error)
        throw new Error(error)
    }
}

/**
 * @function getDistrictList use for fetch district list
 * @param params 
 * @returns 
 */

export const getTalukaList = async (params: object) => {
    try {
        const { limit, offset } = params as { limit: number, offset: number };
        let sql = `SELECT DISTRICT_ID, DISTRICT_NAME FROM district LIMIT ? OFFSET ?`;
        return executeQuery(sql, [limit, offset]).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getDistrictList Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getDistrictList :: ", error);
        throw new Error(error);
    }

}

/**
 * @function updateDistrict use for update district details
 * @param params 
 * @returns 
 */

export const updateTaluka = async (params: object) => {
    try {
        let sql = `UPDATE district SET DISTRICT_NAME = ? WHERE DISTRICT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("updateDistrict Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("updateDistrict :: ", error)
        throw new Error(error)
    }
}

/**
 * @function deleteDistrict use for delete district details
 * @param params 
 * @returns 
 */

export const deleteTaluka = async (params: object) => {    
    try {
        // let sql = `DELETE FROM district WHERE DISTRICT_ID = ?`
        let sql = `UPDATE district SET IS_DELETE = 1 WHERE DISTRICT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteDistrict Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteDistrict :: ", error)
        throw new Error(error)
    }
}
