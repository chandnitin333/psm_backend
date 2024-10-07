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

