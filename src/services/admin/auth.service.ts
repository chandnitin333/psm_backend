import { executeQuery } from '../../config/db/db';
import { logger } from '../../logger/Logger';

export const isUserExists = async (params: Object) => {
    try {
        let sql = `SELECT * FROM adminpwd WHERE user_id = ?`;
        const result: any[] = await executeQuery(sql, params);
        return (result && result.length > 0) ? result[0] : null;
    } catch (error) {
        logger.error("isUserExists :: ", error);
        throw new Error(error);
    }
}

export const getTotalCount = (params:object)=>{
    try {
        let sql = `SELECT COUNT(*) AS total_count from `+params[0]+` WHERE  IS_DELETE = 0`;
        return executeQuery(sql, []).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("total Count Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("total counT Error::", err)
    }
}