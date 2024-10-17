
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


export const addGatGramPanchayat = async (params: object) => {
     try {
        let sql = `SELECT GATGRAMPANCHAYAT_ID FROM gatgrampanchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_NAME=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                    sql = `INSERT INTO gatgrampanchayat (DISTRICT_ID, TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_NAME) VALUES (?, ?, ?, ?)`;
                    return executeQuery(sql, params).then(result => {
                        return (result) ? result : null;
                    }).catch(error => {
                        console.error("addGatGramPanchayat fetch data error: ", error);
                        return null;
                    });
            }
        }).catch(error => {
            console.error("addGatGrampanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("addGatGrampanchaya :: ", error)
        throw new Error(error)
    }

}

export const getGatGramPanchayat = async (params: object) => {
    try {
        let sql = `select g.GATGRAMPANCHAYAT_ID ,g.DISTRICT_ID ,g.TALUKA_ID ,g.PANCHAYAT_ID ,RTRIM(g.GATGRAMPANCHAYAT_NAME) as GATGRAMPANCHAYAT_NAME ,RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME,RTRIM(t.TALUKA_NAME) as TALUKA_NAME,RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME from gatgrampanchayat g join district d on g.DISTRICT_ID  = d.DISTRICT_ID join taluka t  on g.TALUKA_ID  = t.TALUKA_ID join panchayat p on g.PANCHAYAT_ID =p.PANCHAYAT_ID where g.GATGRAMPANCHAYAT_ID =1 and g.IS_DELETE =0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("GatGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGatGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const getGatGramPanchayatList = async (params: object) => {
    try {
        const { limit, offset } = params as { limit: number, offset: number };
        let sql = `select g.GATGRAMPANCHAYAT_ID ,g.DISTRICT_ID ,g.TALUKA_ID ,g.PANCHAYAT_ID ,RTRIM(g.GATGRAMPANCHAYAT_NAME) as GATGRAMPANCHAYAT_NAME ,RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME,RTRIM(t.TALUKA_NAME) as TALUKA_NAME,RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME from gatgrampanchayat g join district d on g.DISTRICT_ID  = d.DISTRICT_ID join taluka t  on g.TALUKA_ID  = t.TALUKA_ID join panchayat p on g.PANCHAYAT_ID =p.PANCHAYAT_ID where g.IS_DELETE = 0 order by g.GATGRAMPANCHAYAT_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, [limit, offset]).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getGatGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGatGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

export const updateGatGramPanchayat = async (params: object) => {
    try {
        let sql = `SELECT GATGRAMPANCHAYAT_ID FROM gatgrampanchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_NAME=? AND IS_DELETE = 0`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                let sql = `UPDATE gatgrampanchayat SET DISTRICT_ID = ?, TALUKA_ID=?, PANCHAYAT_ID=?, GATGRAMPANCHAYAT_NAME=? WHERE GATGRAMPANCHAYAT_ID = ? and IS_DELETE = 0`
                return executeQuery(sql, params).then(result => {
                    return (result) ? result : null;
                }).catch(error => {
                    console.error("updateGatGramPanchayat fetch data error: ", error);
                    return null;
                });
            }
        }).catch(error => {
            console.error("addGatGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("updateGatGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const deleteGatGramPanchayat = async (params: object) => {    
    try {
        let sql = `UPDATE gatgrampanchayat SET IS_DELETE = 1 WHERE GATGRAMPANCHAYAT_ID = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("deleteGatGramPanchayat fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("deleteGatGramPanchayat :: ", error)
        throw new Error(error)
    }
}

export const getGrampanchayatByTalukaId = async (params: object) => {
    try {
        let sql = `select PANCHAYAT_ID,PANCHAYAT_NAME from panchayat p where TALUKA_ID =? and IS_DELETE =0 ORDER BY PANCHAYAT_ID DESC`;
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

export const getGatGrampanchayatByPanchayatId = async (params: object) => {
    try {
        let sql = `select GATGRAMPANCHAYAT_ID,GATGRAMPANCHAYAT_NAME from gatgrampanchayat g  where PANCHAYAT_ID =? and IS_DELETE =0 order by GATGRAMPANCHAYAT_ID desc;`;
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