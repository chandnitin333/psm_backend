
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";


export const addGatGramPanchayat = async (params: object) => {
    try {
        let sql = `SELECT GATGRAMPANCHAYAT_ID FROM gatgrampanchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_NAME=? AND DELETED_AT IS NULL`;
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
        console.log("params===", params);
        let sql = `select g.GATGRAMPANCHAYAT_ID ,g.DISTRICT_ID ,g.TALUKA_ID ,g.PANCHAYAT_ID ,RTRIM(g.GATGRAMPANCHAYAT_NAME) as GATGRAMPANCHAYAT_NAME ,RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME,RTRIM(t.TALUKA_NAME) as TALUKA_NAME,RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME from gatgrampanchayat g join district d on g.DISTRICT_ID  = d.DISTRICT_ID join taluka t  on g.TALUKA_ID  = t.TALUKA_ID join panchayat p on g.PANCHAYAT_ID =p.PANCHAYAT_ID where g.GATGRAMPANCHAYAT_ID =? and g.DELETED_AT IS NULL`
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

        const { limit, offset, searchText } = params as { limit: number, offset: number, searchText: string };
        let sql = `select g.GATGRAMPANCHAYAT_ID ,g.DISTRICT_ID ,g.TALUKA_ID ,g.PANCHAYAT_ID ,RTRIM(g.GATGRAMPANCHAYAT_NAME) as GATGRAMPANCHAYAT_NAME ,RTRIM(d.DISTRICT_NAME) as DISTRICT_NAME,RTRIM(t.TALUKA_NAME) as TALUKA_NAME,RTRIM(p.PANCHAYAT_NAME) as PANCHAYAT_NAME 
                   from gatgrampanchayat g 
                   join district d on g.DISTRICT_ID  = d.DISTRICT_ID 
                   join taluka t  on g.TALUKA_ID  = t.TALUKA_ID 
                   join panchayat p on g.PANCHAYAT_ID = p.PANCHAYAT_ID 
                   where g.DELETED_AT IS NULL `;
        let data = [];
        if (searchText) {
            const searchPattern = `%${searchText}%`;
            sql += ` and (g.GATGRAMPANCHAYAT_NAME LIKE ? OR p.PANCHAYAT_NAME LIKE ? OR t.TALUKA_NAME LIKE ? OR d.DISTRICT_NAME LIKE ?)`;
            data = [searchPattern, searchPattern, searchPattern, searchPattern, limit, offset];
        } else {
            data = [limit, offset];
        }
        let totalCount = await getRecordsCount(sql, data);
        sql += ` ORDER BY g.GATGRAMPANCHAYAT_ID DESC LIMIT ? OFFSET ?`;
        return executeQuery(sql, data).then(result => {
            (result) ? result : null;
            return (result) ? { 'data': result, 'total_count': totalCount } : null;
        }).catch(error => {
            console.error("getGatGramPanchayatList fetch data error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getGatGramPanchayatList :: ", error);
        throw new Error(error);
    }

}

const getRecordsCount = (sql: string, data: any[]) => {
    return executeQuery(sql, data).then((result: any) => {
        return (result && result.length > 0) ? result.length : 0;
    }).catch(error => {
        console.error("getRecordsCount fetch data error: ", error);
        return 0;
    });
}
export const updateGatGramPanchayat = async (params: object) => {
    try {
        let sql = `SELECT GATGRAMPANCHAYAT_ID FROM gatgrampanchayat WHERE DISTRICT_ID = ? AND TALUKA_ID=? AND PANCHAYAT_ID=? AND GATGRAMPANCHAYAT_NAME=? AND DELETED_AT IS NULL`;
        return executeQuery(sql, params).then(result => {
            if (result && (result as any[]).length > 0) {
                return "exists";
            } else {
                let sql = `UPDATE gatgrampanchayat SET DISTRICT_ID = ?, TALUKA_ID=?, PANCHAYAT_ID=?, GATGRAMPANCHAYAT_NAME=? WHERE GATGRAMPANCHAYAT_ID = ? and DELETED_AT IS NULL`
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
        let sql = `UPDATE gatgrampanchayat SET DELETED_AT = NOW() WHERE GATGRAMPANCHAYAT_ID = ?`
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
        let sql = `select PANCHAYAT_ID,PANCHAYAT_NAME from panchayat p where TALUKA_ID =? and DELETED_AT IS NULL ORDER BY PANCHAYAT_ID DESC`;
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
        let sql = `select GATGRAMPANCHAYAT_ID,GATGRAMPANCHAYAT_NAME from gatgrampanchayat g  where PANCHAYAT_ID =? and DELETED_AT IS NULL order by GATGRAMPANCHAYAT_ID desc;`;
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