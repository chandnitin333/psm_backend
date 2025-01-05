import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export async function addOpenPlotInfo(openplot: any): Promise<void> {
    try {
        const query = `
            INSERT INTO openplot (TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_ID, PRAKAR_ID, ANNUALCOST_NAME, LEVYRATE_NAME, DISTRICT_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        openplot = Object.values(openplot);
        await executeQuery(query, [...openplot]);
        logger.info("Open plot added successfully");
    } catch (error) {
        logger.error(`Error adding open plot: ${error.message}`);
        throw error;
    }
}

export async function updateOpenPlotInfo(id: number, openplot: any): Promise<void> {
    try {
        const query = `
            UPDATE openplot
            SET TALUKA_ID = ?, PANCHAYAT_ID = ?, GATGRAMPANCHAYAT_ID = ?, PRAKAR_ID = ?, ANNUALCOST_NAME = ?, LEVYRATE_NAME = ?, DISTRICT_ID = ?
            WHERE OPENPLOT_ID = ?
        `;

        openplot = [...Object.values(openplot)];
        openplot.push(id);
        console.log(openplot);
        await executeQuery(query, openplot);
        logger.info("Open plot updated successfully");
    } catch (error) {
        logger.error(`Error updating open plot: ${error.message}`);
        throw error;
    }
}

export async function getOpenPlotDetailsById(openPlotId: number): Promise<any | null> {
    try {
        const query = `
            SELECT * FROM openplot
            WHERE OPENPLOT_ID = ? AND DELETED_AT IS NULL
        `;
        const results: any = await executeQuery(query, [openPlotId]);
        if (results.length > 0) {
            return results[0] as any;
        }
        return null;
    } catch (error) {
        logger.error(`Error fetching open plot details by ID: ${error.message}`);
        throw error;
    }
}

export async function getOpenPlotInfoList(page: number = 1, search: string = ""): Promise<any[]> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let query = `
            SELECT openplot.OPENPLOT_ID,openplot.ANNUALCOST_NAME, openplot.LEVYRATE_NAME,openplot.DISTRICT_ID, openplot.TALUKA_ID,openplot.PANCHAYAT_ID,openplot.GATGRAMPANCHAYAT_ID, district.DISTRICT_NAME, taluka.TALUKA_NAME, panchayat.PANCHAYAT_NAME, gatgrampanchayat.GATGRAMPANCHAYAT_NAME, prakar.PRAKAR_NAME
             FROM openplot as openplot
            INNER JOIN district ON openplot.DISTRICT_ID = district.DISTRICT_ID
            INNER JOIN taluka ON openplot.TALUKA_ID = taluka.TALUKA_ID
            INNER JOIN panchayat ON openplot.PANCHAYAT_ID = panchayat.PANCHAYAT_ID
            INNER JOIN gatgrampanchayat ON openplot.GATGRAMPANCHAYAT_ID = gatgrampanchayat.GATGRAMPANCHAYAT_ID
            INNER JOIN prakar ON openplot.PRAKAR_ID = prakar.PRAKAR_ID
            WHERE openplot.DELETED_AT IS NULL ORDER BY openplot.OPENPLOT_ID DESC
        `;
        const values: any[] = [];
        if (search) {
            query += ` AND LOWER(District.DISTRICT_NAME) LIKE LOWER(?) OR LOWER(Taluka.TALUKA_NAME) LIKE LOWER(?) OR LOWER( Panchayat.PANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(GatGramPanchayat.GATGRAMPANCHAYAT_NAME) LIKE LOWER(?) OR LOWER(Prakar.PRAKAR_NAME) LIKE LOWER(?) OR LOWER(OpenPlot.ANNUALCOST_NAME) LIKE LOWER(?) OR LOWER(OpenPlot.LEVYRATE_NAME) LIKE LOWER(?)`;
            values.push(`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`);
        }

        query += ` ORDER BY OpenPlot.OPENPLOT_ID DESC LIMIT ${limit} OFFSET ${offset}`;
        console.log(query)
        const results = await executeQuery(query, values);
        return results as any[];
    } catch (error) {
        logger.error(`Error fetching open plot info list: ${error.message}`);
        throw error;
    }
}

export async function softDeleteOpenPlotInfo(openPlotId: number): Promise<void> {
    try {
        const query = `
            UPDATE openplot
            SET DELETED_AT = NOW()
            WHERE OPENPLOT_ID = ?
        `;
        await executeQuery(query, [openPlotId]);
        logger.info(`Open plot with ID ${openPlotId} soft deleted successfully`);
    } catch (error) {
        logger.error(`Error soft deleting open plot: ${error.message}`);
        throw error;
    }
}

export async function getOpenPlotRecordsCount(): Promise<number> {
    try {
        const result: any[] = await executeQuery('SELECT COUNT(*) as count FROM openplot WHERE DELETED_AT IS NULL', []);
        return result[0].count;
    } catch (error) {
        logger.error(`Error fetching open plot records count: ${error.message}`);
        throw error;
    }
}


export const getPrakarListForDDL = async (params: object) => {
    try {
        let sql = `SELECT PRAKAR_ID,PRAKAR_NAME FROM prakar WHERE DELETED_AT IS NULL`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;


        }).catch((error) => {
            console.error("getPrakarListForDDL fetch data error: ", error);
            return null;
        }
        );
    } catch (error) {
        logger.error("getPrakarListForDDL :: ", error)
        throw new Error(error)
    }
}