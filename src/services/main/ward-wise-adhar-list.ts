import exp = require("constants");
import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";

export async function getAdharNoWardWise(ward_number: number, user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT *
        FROM newuser 
        WHERE user_id = ? 
        AND vard_number  = ? AND DELETED_AT IS NULL ORDER BY annu_kramank ASC
        `;
        const results: any = await executeQuery(query, [user_id, ward_number]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}
export async function get_ward_number(user_id: number): Promise<any | null> {
    try {
        const query = `
        SELECT DISTINCT VARD_NUMBER as label, VARD_NUMBER as value 
        FROM newuser n 
        WHERE user_id = ? AND DELETED_AT IS NULL ORDER BY VARD_NUMBER ASC
        `;
        const results: any = await executeQuery(query, [user_id]);
        if (results.length > 0) {
            return results as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching new user details: ${error.message}`);
        throw error;
    }
}