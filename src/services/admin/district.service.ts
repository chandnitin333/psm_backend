import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


/**
 * function getDistrict use for fetch district details
 * @param params 
 * @returns 
 */
export const addDistrict = async (params: object) => {
    try {
        let sql = `SELECT DISTRICT_ID FROM district WHERE DISTRICT_NAME = ? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                sql = `INSERT INTO district (DISTRICT_NAME) VALUES (?)`;
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("addDistrict fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addDistrict fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addDistrict :: ", error)
        throw new Error(error)
    }

}

/**
 * @function getDistrict use for fetch district details
 * @param params 
 * @returns 
 */

export const getDistrict = async (params: object) => {
    try {
        let sql = `SELECT DISTRICT_ID,DISTRICT_NAME FROM district WHERE DISTRICT_ID = ? AND IS_DELETE = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getDistrict fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getDistrict :: ", error)
        throw new Error(error)
    }
}

/**
 * @function getDistrictList use for fetch district list
 * @param params 
 * @returns 
 */

export const getDistrictList = async (params: object) => {
    try {
        const { limit, offset } = params as { limit: number, offset: number };
        let sql = `SELECT DISTRICT_ID, DISTRICT_NAME FROM district WHERE IS_DELETE = 0 ORDER BY DISTRICT_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, [limit, offset]).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getDistrictList fetch data error: ", error);
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

export const updateDistrict = async (params: object) => {
    try {
        let sql = `SELECT DISTRICT_ID FROM district WHERE DISTRICT_NAME = ?  AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                let sql = `UPDATE district SET DISTRICT_NAME = ? WHERE DISTRICT_ID = ?`
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("updateDistrict fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addDistrict fetch data error: ", error);
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

export const deleteDistrict = async (params: object) => {
    try {
        let sql = `UPDATE district SET IS_DELETE = 1 WHERE DISTRICT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteDistrict fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteDistrict :: ", error)
        throw new Error(error)
    }
}

/**
 * @function getDistrictCount use for fetch district count
 * @param params 
 * @returns 
 */

export const getDistrictCount = async (params: object) => {
    try {
        let sql = `SELECT COUNT(DISTRICT_ID) AS COUNT FROM district`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getDistrictCount Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getDistrictCount :: ", error)
        throw new Error(error)
    }
}
