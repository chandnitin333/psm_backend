import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";

export async function addOpenPlotInfo(openPlot: any): Promise<void> {
    try {
        const query = `
            INSERT INTO OpenPlot (TALUKA_ID, PANCHAYAT_ID, GATGRAMPANCHAYAT_ID, PRAKAR_ID, ANNUALCOST_NAME, LEVYRATE_NAME, DISTRICT_ID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        openPlot = Object.values(openPlot);
        await executeQuery(query, [...openPlot]);
        logger.info("Open plot added successfully");
    } catch (error) {
        logger.error(`Error adding open plot: ${error.message}`);
        throw error;
    }
}

export async function updateOpenPlotInfo(id: number, openPlot: any): Promise<void> {
    try {
        const query = `
            UPDATE OpenPlot
            SET TALUKA_ID = ?, PANCHAYAT_ID = ?, GATGRAMPANCHAYAT_ID = ?, PRAKAR_ID = ?, ANNUALCOST_NAME = ?, LEVYRATE_NAME = ?, DISTRICT_ID = ?
            WHERE OPENPLOT_ID = ?
        `;

        openPlot = [...Object.values(openPlot)];
        openPlot.push(id);
        console.log(openPlot);
        await executeQuery(query, openPlot);
        logger.info("Open plot updated successfully");
    } catch (error) {
        logger.error(`Error updating open plot: ${error.message}`);
        throw error;
    }
}

export async function getOpenPlotDetailsById(openPlotId: number): Promise<any | null> {
    try {
        const query = `
            SELECT * FROM OpenPlot
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

export async function getOpenPlotInfoList(page: number = 1): Promise<any[]> {
    try {
        let limit: number = PAGINATION.LIMIT;
        const offset = (page - 1) * limit;
        let query = `
            SELECT OpenPlot.OPENPLOT_ID,OpenPlot.ANNUALCOST_NAME, OpenPlot.LEVYRATE_NAME,OpenPlot.DISTRICT_ID, OpenPlot.TALUKA_ID,OpenPlot.PANCHAYAT_ID,OpenPlot.GATGRAMPANCHAYAT_ID, District.DISTRICT_NAME, Taluka.TALUKA_NAME, Panchayat.PANCHAYAT_NAME, GatGramPanchayat.GATGRAMPANCHAYAT_NAME, Prakar.PRAKAR_NAME
             FROM OpenPlot as OpenPlot
            INNER JOIN District ON OpenPlot.DISTRICT_ID = District.DISTRICT_ID
            INNER JOIN Taluka ON OpenPlot.TALUKA_ID = Taluka.TALUKA_ID
            INNER JOIN Panchayat ON OpenPlot.PANCHAYAT_ID = Panchayat.PANCHAYAT_ID
            INNER JOIN GatGramPanchayat ON OpenPlot.GATGRAMPANCHAYAT_ID = GatGramPanchayat.GATGRAMPANCHAYAT_ID
            INNER JOIN Prakar ON OpenPlot.PRAKAR_ID = Prakar.PRAKAR_ID
            WHERE OpenPlot.DELETED_AT IS NULL ORDER BY OpenPlot.OPENPLOT_ID DESC
        `;
        const values: any[] = [];



        query += ` LIMIT ${limit} OFFSET ${offset}`;
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
            UPDATE OpenPlot
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
        const result = await executeQuery('SELECT COUNT(*) as count FROM OpenPlot WHERE DELETED_AT IS NULL', []);
        return result[0].count;
    } catch (error) {
        logger.error(`Error fetching open plot records count: ${error.message}`);
        throw error;
    }
}
