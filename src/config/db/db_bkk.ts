import { createPool, Pool } from 'mysql2/promise'

let connection: Pool;



export async function connect(): Promise<Pool> {
    connection = await createPool({
        host: 'localhost',
        user: 'root',
        database: 'test',
        password: 'java@123',
        connectionLimit: 10
    });
    return connection;
}



export async function getData() {
    const conn = await connect();
    const posts = await conn.query('SELECT * FROM users',);
    console.log(posts)
}

export const execute = async <T>(query: string, params: string[] | Object): Promise<T> => {
    const conn = await connect();
    let results = null;
    try {
        if (!conn) throw new Error('Pool was not created. Ensure pool is created when running the app.');

        return new Promise<T>((resolve, reject) => {
            try {

                conn.query(query, params).then(function (response) {
                    console.log(response);
                    results = response[0]
                    resolve(results);
                });

            } catch (error) {
                reject(error)
            }

        });

    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}