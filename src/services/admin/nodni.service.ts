import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";

// khula band kamachi tax
//खुला बांधकामाची कर आकारणी : // in englis h it is "open construction tax assessment"
export const openConstructionTaxAssessment = async (data: any) => {
    try {
        let sql = `SELECT 
                A.*, 
                (SELECT X.MILKAT_VAPAR_NAME FROM MILKAT_VAPAR X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
                (SELECT X.PRAKAR_NAME FROM PRAKAR X WHERE X.PRAKAR_ID IN (SELECT Y.PRAKAR_ID FROM OPENPLOT Y WHERE Y.OPENPLOT_ID = A.OPENPLOT_ID)) AS PRAKAR_NAME,
                (SELECT X.GATGRAMPANCHAYAT_NAME FROM GATGRAMPANCHAYAT X WHERE X.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID) AS GATGRAMPANCHAYAT_NAME,
                (SELECT X.VAPARACHE_PRAKAR FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS VAPARACHE_PRAKAR,
                (SELECT X.AREAP FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAP,
                (SELECT X.AREAI FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAI,
                (SELECT X.TOTALAREA FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TOTALAREA,
                (SELECT X.AREAP1 FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAP1,
                (SELECT X.AREAI1 FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAI1,
                (SELECT X.TOTALAREA1 FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TOTALAREA1,
                (SELECT X.ANNUALVALUE FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS ANNUALVALUE,
                (SELECT X.LEVYRATE FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS LEVYRATE,
                (SELECT X.CAPITAL FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS CAPITAL,
                (SELECT X.TAXATION FROM TAXATIONLAND_Temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TAXATION
            FROM 
                TAXATIONLAND_Temp A
            WHERE 
                RandomNumber = ?
                AND user_id = ?
                AND RNO = ?
                AND Token = ?
            ORDER BY 
                TAXATIONLAND_ID ASC
            LIMIT 3`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno, data.token]);

        return result;


    } catch (err) {
        logger.error('Error ::getKhulaBhuKandTax :', err);
        throw err;
    }
};

//बांधकामाची कर आकारणी :  
export const taxAssessmentForConstruction = async (data: any) => {
    try {
        let sql = `SELECT 
            A.*,
            (SELECT X.MILKAT_VAPAR_NAME FROM MILKAT_VAPAR X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
            (SELECT X.DESCRIPTION_NAME FROM MALMATTA X WHERE X.MALMATTA_ID = A.MALMATTA_ID) AS DESCRIPTION_NAME,
            (SELECT X.VAPARACHE_PRAKAR FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS VAPARACHE_PRAKAR,
            (SELECT X.FLOOR_NAME FROM FLOOR X WHERE X.FLOOR_ID = A.FLOOR_ID) AS FLOOR_NAME,
            (SELECT X.AREAP FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS AREAP,
            (SELECT X.AREAI FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS AREAI,
            (SELECT X.TOTALAREA FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TOTALAREA,
            (SELECT IFNULL(X.TOTALAREA, 0) FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS TOTALAREA_X,
            (SELECT X.TOTALAREA1 FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TOTALAREA1,
            (SELECT X.LIFESPAN FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS LIFESPAN,
            (SELECT X.CONSTRUCTING FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS CONSTRUCTING,
            (SELECT X.DEPRECIATION FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS DEPRECIATION,
            (SELECT X.WEIGHTTAGE FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS WEIGHTTAGE,
            (SELECT X.ANNUALCOST FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS ANNUALCOST,
            (SELECT X.LEVYRATE FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS LEVYRATE,
            (SELECT X.ONE FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS ONE,
            (SELECT IFNULL(X.ONE, 0) FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS ONE_X,
            (SELECT X.TWO FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TWO,
            (SELECT IFNULL(X.TWO, 0) FROM CONSTRUCTIONTAX_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS TWO_X
        FROM 
            CONSTRUCTIONTAX_temp A
        WHERE 
            RandomNumber = ?
            AND user_id = ? 
            AND RNO = ?
            AND Token = ?
        ORDER BY 
            CONSTRUCTIONTAX_ID ASC
        LIMIT 5`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno, data.token]);

        return result;


    } catch (err) {
        logger.error('Error ::BandhKamachiKarAkarnai :', err);
        throw err;
    }
};

//Tax Assessment for Towers  मनोऱ्याचे कर आकारणी 
export const taxAssessmentForTowers = async (data: any) => {
    try {
        let sql = `SELECT A.*,
        (SELECT X.MILKAT_VAPAR_NAME FROM MILKAT_VAPAR X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
        (SELECT X.DESCRIPTION_NAME FROM MALMATTA X WHERE X.MALMATTA_ID = A.MALMATTA_ID) AS DESCRIPTION_NAME,
        (SELECT X.VAPARACHE_PRAKAR FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS VAPARACHE_PRAKAR,
        (SELECT X.MANORAMASTER_NAME FROM MANORAMASTER X WHERE X.MANORAMASTER_ID = A.MANORAMASTER_ID) AS MANORAMASTER_NAME,
        (SELECT X.AREAP FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS AREAP,
        (SELECT X.AREAI FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS AREAI,
        (SELECT X.TOTALAREA FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TOTALAREA,
        (SELECT X.TOTALAREA1 FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TOTALAREA1,
        (SELECT X.CAPITAL FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS CAPITAL,
        (SELECT X.TAXATION FROM TAXPAYERS_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TAXATION
        FROM TAXPAYERS_temp A
        WHERE RandomNumber = ?
        AND user_id =?
        AND RNO = ?
        AND Token = ?
        ORDER BY TAXPAYERS_ID ASC
        LIMIT 3`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno, data.token]);

        return result;


    } catch (err) {
        logger.error('Error ::BandhKamachiKarAkarnai :', err);
        throw err;
    }
};



//इतर कर गणना (Other Tax Calculation)
export const otherTaxCalculation = async (data: any) => {
    try {
        let sql = `SELECT 
                A.*, 
                (SELECT X.TAXRATE1 FROM CREATEOTHERTAX X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE1,
                (SELECT X.TAXRATE2 FROM CREATEOTHERTAX X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE2,
                (SELECT X.TAXRATE3 FROM CREATEOTHERTAX X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE3,
                (SELECT X.TAXRATE4 FROM CREATEOTHERTAX X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE4,
                (SELECT X.TAXRATE5 FROM CREATEOTHERTAX X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE5
            FROM 
                CREATEOTHERTAX A
            WHERE 
                DISTRICT_ID = ?
                AND TALUKA_ID = ?
                AND PANCHAYAT_ID = ?`


        const result = await executeQuery(sql, [data.district_id, data.taluka_id, data.panchayat_id]);

        return result;

    } catch (err) {
        logger.error('Error ::BandhKamachiKarAkarnai :', err);
        throw err;
    }
};


export const saveNondni = async (data: any) => {
    try {
        const {
            txt_number, txt_vard_number, txt_malmatta_number, txt_plot_number,
            txt_khasara_number, txt_survey_number, txt_voter_card_number, txt_aadhar_card_number,
            txt_mobile_number, txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
            txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
            txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
            txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter,
            user_id, randomNumber, token, rno
        } = data;


        // Check if ANNU_KRAMANK already exists
        const checkQuery = `SELECT ANNU_KRAMANK FROM NEWUSER WHERE ANNU_KRAMANK = ? AND VARD_NUMBER = ? AND user_id = ?`;
        const checkParams = [txt_number, txt_vard_number, user_id];
        const checkResult = await executeQuery(checkQuery, checkParams) as any[];

        if (checkResult.length > 0) {
            const deleteQueries = [
                `DELETE FROM taxationland_temp WHERE ANNU_KRAMANK = ? AND VARD_NUMBER = ? AND RandomNumber = ? AND user_id = ? AND RNO = ? AND Token = ?`,
                `DELETE FROM constructiontax_temp WHERE ANNU_KRAMANK = ? AND VARD_NUMBER = ? AND RandomNumber = ? AND user_id = ? AND RNO = ? AND Token = ?`,
                `DELETE FROM taxpayers_temp WHERE ANNU_KRAMANK = ? AND VARD_NUMBER = ? AND RandomNumber = ? AND user_id = ? AND RNO = ? AND Token = ?`
            ];
            const deleteParams = [txt_number, txt_vard_number, randomNumber, user_id, rno, token];

            for (const query of deleteQueries) {
                await executeQuery(query, deleteParams);
            }

            return { status: 200, message: "This Annu Kramank Already Exists" };
        } else {
            // Corrected insert query
            const insertQuery = `INSERT INTO NEWUSER (
                    ANNU_KRAMANK, MALMATTA_NUMBER, VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, 
                    SURVEY_KRAMANK, VOTERCARD_NUMBER, AADHARCARD_NUMBER, MOBILE_NUMBER, 
                    HOMEUSER_NAME, HOMEUSER_NAME1, BHOGATWARGARACHE_NAME, ADDRESS_NAGAR_SOCIETY, 
                    KAMAYACHA_ADDRESS, BHOGATDARACHE_MALAK, PURVA, PACHHIM, UTTAR, DAKSIN, 
                    PINIYACHA_PANI, SOUNCHALAY, MILKAR_PRAKAR, EMARTICHE_JAMIN, EMARTICHE_MOKDI, 
                    LAMBI, RUNDI, SQUARE_FOOT, SQUARE_METER
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                )`;

            const insertParams = [
                txt_number, txt_malmatta_number, txt_vard_number, txt_plot_number, txt_khasara_number,
                txt_survey_number, txt_voter_card_number, txt_aadhar_card_number, txt_mobile_number,
                txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
                txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
                txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
                txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter
            ];


            await executeQuery(insertQuery, insertParams);

            let outParam = 0; // Declare outParam to store the returned value.
            let result = await executeQuery(`CALL multipleinsertdata(?, ?, ?, ?, ?, ?)`,
                [txt_number, txt_vard_number, randomNumber, user_id, rno, token]);


            return { status: 200, message: "Data Inserted Successfully" };
        }

    } catch (err) {
        logger.error('Error ::saveNondni :', err);
        throw err;
    }
};



export const saveKhaliBhuKhand = async (data: any) => {
    try {
        let sql = `INSERT INTO TAXATIONLAND (
                newuser_id, user_id, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, 
                GATGRAMPANCHAYAT_ID, OPENPLOT_ID, AREAP, AREAI, TOTALAREA, 
                AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE, 
                CAPITAL, TAXATION, RNO, EXTRA, taxpayersss, 
                tax1000, vard_number, annu_kramank, Year_id, Year_name, 
                reg_date, tdate, ttime
            ) VALUES (
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?
            )`;
        const params = [
            data.newuser_id, data.user_id, data.milkat_vapar_id, data.milkat_vapar_id1, data.vaparache_prakar,
            data.gatgrampanchayat_id, data.openplot_id, data.areap, data.areai, data.totalarea,
            data.areap1, data.areai1, data.totalarea1, data.annualvalue, data.levyrate,
            data.capital, data.taxation, data.rno, data.extra, data.taxpayersss,
            data.tax1000, data.vard_number, data.annu_kramank, data.year_id, data.year_name,
            new Date(), new Date(), new Date()
        ];
        const result = await executeQuery(sql, params);
        if (result) {
            return { status: 200, message: "Open Plat rate added Successfully." };
        } else {
            return { status: 400, message: "Data Insertion Failed" };
        }

    } catch (err) {
        logger.error('Error ::saveKhaliBhuKhand :', err);
        throw err;
    }

}


export const saveBandhKam = async (data: any) => {
    try {
        let sql = `INSERT INTO CONSTRUCTIONTAX (
                newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR, FLOOR_ID, AREAP, AREAI, TOTALAREA, 
                AREAP1, AREAI1, TOTALAREA1, LIFESPAN, CONSTRUCTING, DEPRECIATION, WEIGHTTAGE, ANNUALCOST, LEVYRATE, 
                ONE, TWO, RNO, cons1000, vard_number, annu_kramank, Year_id, Year_name, reg_date, tdate, ttime
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`;
        const params = [
            data.newuser_id, data.user_id, data.malmatta_id,
            data.vaparache_prakar,
            data.floor_id,
            data.areap,
            data.areai,
            data.totalarea,
            data.totalarea_x,
            data.totalarea1,
            data.lifespan,
            data.constructing,
            data.depreciation,
            data.weighttage,
            data.annualcost,
            data.levyrate,
            data.one,
            data.one_x,
            data.two,
            data.two_x,
            data.rno,
            data.cons1000,
            data.vard_number,
            data.annu_kramank,
            data.year_id,
            data.year_name,
            new Date(),
            new Date(),
            new Date()
        ];

        console.log("params", params);
        const result = await executeQuery(sql, params);
        if (result) {
            return { status: 200, message: "Bandh Kam rate added Successfully." };
        }
        else {
            return { status: 400, message: "Data Insertion Failed" };
        }
    } catch (err) {
        logger.error('Error ::saveBandhKam :', err);
        throw err;
    }
}


export const saveTaxPayers = async (data: any) => {
    try {
        let sql = `INSERT INTO TAXPAYERS (
                newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR, MANORAMASTER_ID, 
                AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, CAPITAL, TAXATION, RNO, 
                taxp1000, vard_number, annu_kramank, Year_id, Year_name, reg_date, tdate, ttime
            ) 
            VALUES (
                ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?
            )`;
        const params = [
            data.newuser_id,
            data.user_id,
            data.milkat_vapar_id,
            data.malmatta_id,
            data.vaparache_prakar,
            data.manoramaster_id,
            data.areap,
            data.areai,
            data.totalarea,
            data.areap1,
            data.areai1,
            data.totalarea1,
            data.capital,
            data.taxation,
            data.rno,
            data.taxp1000,
            data.vard_number,
            data.annu_kramank,
            data.year_id,
            data.year_name,
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8), // reg_date
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8), // tdate
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8)  // ttime
        ];

        console.log("params", params);
        const result = await executeQuery(sql, params);
        if (result) {
            return { status: 200, message: "Bandh Kam rate added Successfully." };
        }
        else {
            return { status: 400, message: "Data Insertion Failed" };
        }
    } catch (err) {
        logger.error('Error ::saveTaxPayers :', err);
        throw err;
    }
}



