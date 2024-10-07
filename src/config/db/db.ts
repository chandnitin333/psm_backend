import { createPool, Pool } from 'mysql';
import { getEnvironmentVariable } from '../../environments/env';
import { logger } from '../../logger/Logger';
let pool: Pool;

export const init = () => {
    try {
        pool = createPool({
            host: getEnvironmentVariable().DB_HOST,
            user: getEnvironmentVariable().DB_USER,
            database: getEnvironmentVariable().DB_NAME,
            password: getEnvironmentVariable().DB_PWD,
            port: 3306,
            connectionLimit: getEnvironmentVariable().DB_CONNECTION_LIMIT,
            "typeCast": function castField(field, useDefaultTypeCasting) {

                if ((field.type === "BIT") && (field.length === 1)) {
                    var bytes = field.buffer();
                    return bytes[0].toString();
                }

                return (useDefaultTypeCasting());
            }
        });
        logger.info("MySql Adapter Pool generated successfully :: ")

    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        logger.error("Connection Error:: ", JSON.stringify(error))
        throw new Error('failed to initialized pool');
    }
};


export const executeQuery = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {

        if (!pool) throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise<T>((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

    } catch (error) {
        logger.error("execute Query Error:: ", JSON.stringify(error))
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}
