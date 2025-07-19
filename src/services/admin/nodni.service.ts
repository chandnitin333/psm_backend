import { executeQuery } from "../../config/db/db";
import { logger } from "../../logger/Logger";

// khula band kamachi tax
//खुला बांधकामाची कर आकारणी : // in englis h it is "open construction tax assessment"
export const openConstructionTaxAssessment = async (data: any) => {
    try {
        let sql = `SELECT 
                A.*, 
                (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
                (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME1,
                (SELECT X.PRAKAR_NAME FROM prakar X WHERE X.PRAKAR_ID IN (SELECT Y.PRAKAR_ID FROM openplot Y WHERE Y.OPENPLOT_ID = A.OPENPLOT_ID)) AS PRAKAR_NAME,
                (SELECT X.GATGRAMPANCHAYAT_NAME FROM gatgrampanchayat X WHERE X.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID) AS GATGRAMPANCHAYAT_NAME,
                (SELECT X.VAPARACHE_PRAKAR FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS VAPARACHE_PRAKAR,
                (SELECT X.AREAP FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAP,
                (SELECT X.AREAI FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAI,
                (SELECT X.TOTALAREA FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TOTALAREA,
                (SELECT X.AREAP1 FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAP1,
                (SELECT X.AREAI1 FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS AREAI1,
                (SELECT X.TOTALAREA1 FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TOTALAREA1,
                (SELECT X.ANNUALVALUE FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS ANNUALVALUE,
                (SELECT X.LEVYRATE FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS LEVYRATE,
                (SELECT X.CAPITAL FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS CAPITAL,
                (SELECT X.TAXATION FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TAXATION,
                '' as action
            FROM 
                taxationland_temp A
            WHERE 
                RandomNumber = ?
                AND user_id = ?
                AND RNO = ?
            ORDER BY 
                TAXATIONLAND_ID ASC
            LIMIT 3`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno]);

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
            (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
            (SELECT X.DESCRIPTION_NAME FROM malmatta X WHERE X.MALMATTA_ID = A.MALMATTA_ID) AS DESCRIPTION_NAME,
            (SELECT X.VAPARACHE_PRAKAR FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS VAPARACHE_PRAKAR,
            (SELECT X.FLOOR_NAME FROM floor X WHERE X.FLOOR_ID = A.FLOOR_ID) AS FLOOR_NAME,
            (SELECT X.AREAP FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS AREAP,
            (SELECT X.AREAI FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS AREAI,
            (SELECT X.TOTALAREA FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TOTALAREA,
            (SELECT IFNULL(X.TOTALAREA, 0) FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS TOTALAREA_X,
            (SELECT X.TOTALAREA1 FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TOTALAREA1,
            (SELECT X.LIFESPAN FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS LIFESPAN,
            (SELECT X.CONSTRUCTING FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS CONSTRUCTING,
            (SELECT X.DEPRECIATION FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS DEPRECIATION,
            (SELECT X.WEIGHTTAGE FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS WEIGHTTAGE,
            (SELECT X.ANNUALCOST FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS ANNUALCOST,
            (SELECT X.LEVYRATE FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS LEVYRATE,
            (SELECT X.ONE FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS ONE,
            (SELECT IFNULL(X.ONE, 0) FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS ONE_X,
            (SELECT X.TWO FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID) AS TWO,
            (SELECT IFNULL(X.TWO, 0) FROM constructiontax_temp X WHERE X.CONSTRUCTIONTAX_ID = A.CONSTRUCTIONTAX_ID AND X.floor_id = 3) AS TWO_X,
            '' as action
        FROM 
            constructiontax_temp A
        WHERE 
            RandomNumber = ?
            AND user_id = ? 
            AND RNO = ?
        ORDER BY 
            CONSTRUCTIONTAX_ID ASC
        LIMIT 5`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno]);

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
        (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
        (SELECT X.DESCRIPTION_NAME FROM malmatta X WHERE X.MALMATTA_ID = A.MALMATTA_ID) AS DESCRIPTION_NAME,
        (SELECT X.VAPARACHE_PRAKAR FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS VAPARACHE_PRAKAR,
        (SELECT X.MANORAMASTER_NAME FROM manoramaster X WHERE X.MANORAMASTER_ID = A.MANORAMASTER_ID) AS MANORAMASTER_NAME,
        (SELECT X.AREAP FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS AREAP,
        (SELECT X.AREAI FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS AREAI,
        (SELECT X.TOTALAREA FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TOTALAREA,
        (SELECT X.TOTALAREA1 FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TOTALAREA1,
        (SELECT X.CAPITAL FROM taxpayers_temp X WHERE X.TAXPAYERS_ID    = A.TAXPAYERS_ID) AS CAPITAL,
        (SELECT X.TAXATION FROM taxpayers_temp X WHERE X.TAXPAYERS_ID = A.TAXPAYERS_ID) AS TAXATION, '' as action
        FROM taxpayers_temp A
        WHERE RandomNumber = ?
        AND user_id =?
        AND RNO = ?
        ORDER BY TAXPAYERS_ID ASC
        LIMIT 3`
        const result = await executeQuery(sql, [data.randomNumber, data.userId, data.rno]);

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
                (SELECT X.TAXRATE1 FROM createothertax X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE1,
                (SELECT X.TAXRATE2 FROM createothertax X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE2,
                (SELECT X.TAXRATE3 FROM createothertax X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE3,
                (SELECT X.TAXRATE4 FROM createothertax X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE4,
                (SELECT X.TAXRATE5 FROM createothertax X WHERE X.CREATEOTHERTAX_ID = A.CREATEOTHERTAX_ID) AS TAXRATE5
            FROM 
                createothertax A
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
        // const {
        //     txt_number, txt_vard_number, txt_malmatta_number, txt_plot_number,
        //     txt_khasara_number, txt_survey_number, txt_voter_card_number, txt_aadhar_card_number,
        //     txt_mobile_number, txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
        //     txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
        //     txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
        //     txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter,user_id, randomNumber, rno, token,
        //     urvarit_khali_jaga_feet,urvarit_khali_jaga_meter,  emaratiche_bhandavali_mulya, jaminiche_bhandavali_mulya, ekun_bhandavli_mulya,emartiche_kar_akarani_txt, khula_bhukand_kar_aakarani_txt, gruhkar_bhumikar_from_property_tax,
        //     gruhkar_bhumikar_from_tax_payble,chalu_kar, magil_kar,ekun_kar_bharna,magahun_ghat_kiva_badal, vanijya_prakar_radio
        // } = data;
        let {
            txt_number, txt_malmatta_number, txt_vard_number, txt_plot_number, txt_khasara_number,
            txt_survey_number, txt_voter_card_number, txt_aadhar_card_number, txt_mobile_number,
            txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
            txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
            txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
            txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter,user_id, randomNumber, rno, token,
            urvarit_khali_jaga_feet,urvarit_khali_jaga_meter,  emaratiche_bhandavali_mulya, jaminiche_bhandavali_mulya, ekun_bhandavli_mulya,emartiche_kar_akarani_txt, khula_bhukand_kar_aakarani_txt, gruhkar_bhumikar_from_property_tax,gruhkar_bhumikar_from_tax_payble,chalu_kar, magil_kar,ekun_kar_bharna,magahun_ghat_kiva_badal, vanijya_prakar_radio, 
            check1,viz_divabatti_kar,check2,aaraogya_rakashan_kar,check3,safae_kar,check4,samanya_pani_kar,check5,vishesh_pani_kar
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
            const insertQuery = `INSERT INTO newuser (
                    ANNU_KRAMANK, MALMATTA_NUMBER, VARD_NUMBER, PLOT_NO, KHASARA_KRAMANK, 
                    SURVEY_KRAMANK, VOTERCARD_NUMBER, AADHARCARD_NUMBER, MOBILE_NUMBER, 
                    HOMEUSER_NAME, HOMEUSER_NAME1, BHOGATWARGARACHE_NAME, ADDRESS_NAGAR_SOCIETY, 
                    KAMAYACHA_ADDRESS, BHOGATDARACHE_MALAK, PURVA, PACHHIM, UTTAR, DAKSIN, 
                    PINIYACHA_PANI, SOUNCHALAY, MILKAR_PRAKAR, EMARTICHE_JAMIN, EMARTICHE_MOKDI, 
                    LAMBI, RUNDI, SQUARE_FOOT, SQUARE_METER, user_id, RandomNumber, RNO, Tokens,
                    URVATICH_KHALI_JAGA, URVATICH_KHALI_JAGAS, EMARTICHE_RUPESS, JAMINICHE_RUPEES, TOTAL,
                    EMARTICHE_KARAAKARNI, KHULA_BHUKAND, TOTALS,
                    BHUMIKAR, CHALU_KAR, MAGIL_BAKI, EEKUN_KAR_BHARNA, MAJAHUN_GHAT,vanijya,
                    CHECK1,VIZ_DIVVABATTIKAR,CHECK2,AAROGYA_RAKSHAN_KAR,CHECK3,SAFAI_KAR,CHECK4,SAMANYA_PANI_KAR,CHECK5,VISHESH_PANI_KAR,EKUN
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?
                )`;
                // check1,viz_divabatti_kar,check2,aaraogya_rakashan_kar,check3,safae_kar,check4,samanya_pani_kar,check5,vishesh_pani_kar
                if(check1 === 0){
                   check1 = null;
                   viz_divabatti_kar = 0;
                }
                if(check2 === 0){
                    check2 = null;
                    aaraogya_rakashan_kar = 0;
                }
                if(check3 === 0){
                    check3 = null;
                    safae_kar = 0;
                }
                if(check4 === 0){
                    check4 = null;
                    samanya_pani_kar = 0;
                }
                if(check5 === 0){
                    check5 = null;
                    vishesh_pani_kar = 0;
                }
                let ekun = viz_divabatti_kar + aaraogya_rakashan_kar+ safae_kar + samanya_pani_kar + vishesh_pani_kar;

            const insertParams = [
                txt_number, txt_malmatta_number, txt_vard_number, txt_plot_number, txt_khasara_number,
                txt_survey_number, txt_voter_card_number, txt_aadhar_card_number, txt_mobile_number,
                txt_home_name, txt_spouse, txt_bhogatwadarache_name, txt_address,
                txt_kamayacha_address, txt_bhogatwarache_malak, txt_east, txt_west, txt_north, txt_south,
                txt_water, txt_washroom, txt_milkat_prakar, txt_emarat_jamin, txt_emarat_mokdi,
                txt_lambi, txt_rundi, txt_shetrafadh_foot, txt_shetrafadh_meter,user_id, randomNumber, rno, token,
                urvarit_khali_jaga_feet,urvarit_khali_jaga_meter,  emaratiche_bhandavali_mulya, jaminiche_bhandavali_mulya, ekun_bhandavli_mulya,emartiche_kar_akarani_txt, khula_bhukand_kar_aakarani_txt, gruhkar_bhumikar_from_property_tax,gruhkar_bhumikar_from_tax_payble,chalu_kar, magil_kar,ekun_kar_bharna,magahun_ghat_kiva_badal, vanijya_prakar_radio,
                check1,viz_divabatti_kar,check2,aaraogya_rakashan_kar,check3,safae_kar,check4,samanya_pani_kar,check5,vishesh_pani_kar, ekun
                
            ];


            await executeQuery(insertQuery, insertParams);
            
            // const insertedIdQuery = `SELECT LAST_INSERT_ID() AS id`;
            // const insertedIdResult = await executeQuery(insertedIdQuery,[]);
            // const insertedId = insertedIdResult[0]?.id;

// check1,viz_divabatti_kar,check2,aaraogya_rakashan_kar,check3,safae_kar,check4,samanya_pani_kar,check5,vishesh_pani_kar
        //     check1: this.viz_divabatti_kar_checkbox,
        // viz_divabatti_kar: this.viz_divabatti_kar,
        // check2: this.aaraogya_rakashan_kar_checkbox,
        // aaraogya_rakashan_kar: this.aaraogya_rakashan_kar,
        // check3: this.safae_kar_checkbox,
        // safae_kar: this.safae_kar,
        // check4: this.samanya_pani_kar_checkbox,
        // samanya_pani_kar: this.samanya_pani_kar,
        // check5: this.vishesh_pani_kar_checkbox,
        // vishesh_pani_kar: this.vishesh_pani_kar,


            // console.log("test",data)
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
        let sql = `INSERT INTO taxationland_temp (
                newuser_id, user_id, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, 
                GATGRAMPANCHAYAT_ID, OPENPLOT_ID, AREAP, AREAI, TOTALAREA, 
                AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE, 
                CAPITAL, TAXATION, RNO, extra, taxpayersss, 
                tax1000, vard_number, Annu_kramank, Year_id, Year_name, 
                reg_date, tdate, ttime,RandomNumber,Token
            ) VALUES (
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, 
                ?, ?, ?,?, ?
            )`;
        const params = [
            data.newuser_id, data.user_id, data.milkat_vapar_id, data.milkat_vapar_id1, data.vaparache_prakar,
            data.gatgrampanchayat_id, data.openplot_id, data.areap, data.areai, data.totalarea,
            data.areap1, data.areai1, data.totalarea1, data.annualvalue, data.levyrate,
            data.capital, data.taxation, data.rno, 1, 1,
            1000, data.vard_number, data.annu_kramank, data.year_id, data.year_name,
            new Date(), new Date(), new Date(), data.randomNumber,""
        ];
        const result = await executeQuery(sql, params);
        if (result) {
            return true;
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
        // javaNew.js 1135 line number vala krna hain
        // let sql = `INSERT INTO CONSTRUCTIONTAX (
        //         newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR, FLOOR_ID, AREAP, AREAI, TOTALAREA, 
        //         AREAP1, AREAI1, TOTALAREA1, LIFESPAN, CONSTRUCTING, DEPRECIATION, WEIGHTTAGE, ANNUALCOST, LEVYRATE, 
        //         ONE, TWO, RNO, cons1000, vard_number, annu_kramank, Year_id, Year_name, reg_date, tdate, ttime
        //     ) VALUES (
        //         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        //     )`;
        let sql = `INSERT INTO CONSTRUCTIONTAX_temp (
            newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR, FLOOR_ID,
            AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, LIFESPAN, CONSTRUCTING,
            DEPRECIATION, WEIGHTTAGE, ANNUALCOST, LEVYRATE, ONE, TWO, RNO, cons1000,
            annu_kramank, vard_number, Year_id, Year_name, reg_date, tdate, ttime,
            RandomNumber, Token
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )`;
        const params = [
            data.newuser_id, data.user_id, data.milkat_vapar_id,
            data.malmatta_id,
            data.vaparache_prakar,
            data.manoramaster_id,
            data.areap,
            data.areai,
            data.totalarea,
            data.areap1,
            data.areai1,
            data.totalarea1,
            data.lifespan,
            data.constructing,
            data.depreciation,
            data.weighted,
            data.annual_cost,
            data.levyrate,
            data.one,
            data.two,
            data.rno,
            1000,
            data.annu_kramank,
            data.vard_number,
            data.year_id,
            data.year_name,
            new Date(),
            new Date(),
            new Date(),
            data.random_number,data.token
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
        // let sql = `INSERT INTO TAXPAYERS (
        //         newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR, MANORAMASTER_ID, 
        //         AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, CAPITAL, TAXATION, RNO, 
        //         taxp1000, vard_number, annu_kramank, Year_id, Year_name, reg_date, tdate, ttime
        //     ) 
        //     VALUES (
        //         ?, ?, ?, ?, ?, ?, 
        //         ?, ?, ?, ?, ?, ?, 
        //         ?, ?, ?, ?, ?, ?, 
        //         ?, ?, ?, ?, ?
        //     )`;
        let sql = `INSERT INTO TAXPAYERS_temp (
                    newuser_id, user_id, MILKAT_VAPAR_ID, MALMATTA_ID, VAPARACHE_PRAKAR,
                    MANORAMASTER_ID, AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1,
                    CAPITAL, TAXATION, RNO, taxp1000, vard_number, annu_kramank, Year_id,
                    Year_name, reg_date, tdate, ttime,RandomNumber, Token
                                ) 
                                VALUES (
                                    ?, ?, ?, ?, ?, ?, 
                                    ?, ?, ?, ?, ?, ?, 
                                    ?, ?, ?, ?, ?, ?, 
                                    ?, ?, ?, ?, ?, ?,?
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
            data.levyrate,
            data.karAkarani,
            data.rno,
            1000,
            data.vard_number,
            data.annu_kramank,
            data.year_id,
            data.year_name,
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8), // reg_date
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8), // tdate
            new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 8),  // ttime
            data.random_number,
            data.token
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





export async function get_khulaBhukhandKar_MalmattechePrakar(): Promise<any[]> {
    try {
        const query = `
            SELECT MILKAT_VAPAR_ID, MILKAT_VAPAR_NAME FROM milkat_vapar WHERE MILKAT_VAPAR_ID=14 AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching Khula Bhukhand Malmatteche Prakar DDL: ${error.message}`);
        throw error;
    }
}

export async function get_khulaBhukhandKar_Gavthan(id: number): Promise<any[]> {
    try {
        const query = `
            SELECT B.openplot_id,
                (SELECT A.PRAKAR_NAME
                    FROM prakar A
                    WHERE A.PRAKAR_ID = B.PRAKAR_ID) AS PRAKAR_NAME
            FROM openplot B
            WHERE B.GATGRAMPANCHAYAT_ID = ?  AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching Khula Bhukhand Gavthan DDL: ${error.message}`);
        throw error;
    }
}

export async function get_buildingKar_MalmattechePrakar(): Promise<any[]> {
    try {
        const query = `
            SELECT MILKAT_VAPAR_ID, MILKAT_VAPAR_NAME FROM milkat_vapar WHERE MILKAT_VAPAR_ID IN(6,7,8) AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching Building Kar Malmatteche Prakar DDL: ${error.message}`);
        throw error;
    }
}

export async function get_buildingKar_MalmattecheVarnan(): Promise<any[]> {
    try {
        const query = `
            SELECT * FROM malmatta WHERE MALMATTA_ID IN(1,2,3,4) AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching बिल्डिंग कर आकारणी मालमत्तेचे वर्णन DDL: ${error.message}`);
        throw error;
    }
}

export async function get_buildingKar_bandkamachaMajla(): Promise<any[]> {
    try {
        const query = `
            SELECT * FROM floor WHERE DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching बिल्डिंग कर आकारणी बांधकामाचा मजला DDL: ${error.message}`);
        throw error;
    }
}

export async function get_monoraKar_MalmattechePrakar(): Promise<any[]> {
    try {
        const query = `
            SELECT MILKAT_VAPAR_ID, MILKAT_VAPAR_NAME FROM milkat_vapar WHERE MILKAT_VAPAR_ID IN(13) AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching मनोरा कर आकारणी मालमत्तेचे प्रकार DDL: ${error.message}`);
        throw error;
    }
}

export async function get_monoraKar_MalmattecheVarnan(): Promise<any[]> {
    try {
        const query = `
            SELECT * FROM malmatta WHERE MALMATTA_ID IN(1,5) AND DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching मनोरा कर आकारणी मालमत्तेचे वर्णन DDL: ${error.message}`);
        throw error;
    }
}
export async function get_monoraKar_ManoracheBhag(): Promise<any[]> {
    try {
        const query = `
            SELECT * FROM manoramaster WHERE DELETED_AT IS NULL
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching मनोरा कर आकारणी मनोऱ्याचे भाग DDL: ${error.message}`);
        throw error;
    }
}

export async function get_AllWardNoList(user_id:number): Promise<any[]> {
    try {
        const query = `
            SELECT distinct(VARD_NUMBER)as vard_number FROM newuser WHERE user_id=? AND DELETED_AT IS NULL`;
        const results: any[] = await executeQuery(query, [user_id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching मनोरा कर आकारणी मनोऱ्याचे भाग DDL: ${error.message}`);
        throw error;
    }
}

export async function getAnnualRateAkarniDar(id:number, district_id:number, taluka_id:number, panchayat_id:number): Promise<any[]> {
    try {
        const query = `
            SELECT ANNUALCOST_NAME, LEVYRATE_NAME
            FROM openplot
            WHERE OPENPLOT_ID = ?
            AND DISTRICT_ID = ?
            AND TALUKA_ID = ?
            AND PANCHAYAT_ID = ?
            AND DELETED_AT IS NULL`;
            // console.log("query",query)
        const results: any[] = await executeQuery(query, [id,district_id, taluka_id, panchayat_id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching जमिनीचे वार्षिक मूल्य आणि आकारणी दर DDL: ${error.message}`);
        throw error;
    }
}
export async function getYearIdAndYearName(): Promise<any[]> {
    try {
        const query = `
            select YEAR_ID,YEAR_NAME from year where year_name=(SELECT YEAR(CURDATE()) AS yyy) AND DELETED_AT IS null;
        `;
        const results: any[] = await executeQuery(query, []);
        return results;
    } catch (error) {
        logger.error(`Error fetching वर्ष ID आणि वर्ष नाव DDL: ${error.message}`);
        throw error;
    }
}
export async function getBharankFromMalmattecheDDL(id:number): Promise<any[]> {
    try {
        const query = `
            SELECT BUILDINGWEIGHTS_NAME 
            FROM buildingweights 
            WHERE MILKAT_VAPAR_ID = ? AND DELETED_AT IS null
        `;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching भारांक: ${error.message}`);
        throw error;
    }
}
export async function getBuildingAnnuRateAndAkaranidar(malmatta_id:number, milkat_vapar_id:number, district_id:number): Promise<any[]> {
    try {
        const query = `
            SELECT ANNUALPRICE_NAME, LEVYRATE_NAME 
            FROM annualtax 
            WHERE malmatta_id = ?
            AND milkat_vapar_id = ?
            AND district_id = ?
            AND DELETED_AT IS null
        `;
        const results: any[] = await executeQuery(query, [malmatta_id, milkat_vapar_id, district_id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching भारांक: ${error.message}`);
        throw error;
    }
}
export async function getBharankDar_buildingModal(malmatta_varnan_id:number, vayoman:number): Promise<any[]> {
    try {
        const query = `
        SELECT DEPRECIATION_NAME 
        FROM depreciation 
        WHERE AGEOFBUILDING_ID = (
            SELECT AGEOFBUILDING_ID 
            FROM ageofbuilding a 
            WHERE MIN_AGE <= ? 
            ORDER BY AGEOFBUILDING_ID DESC 
            LIMIT 1
        ) AND MALMATTA_ID = ? AND DELETED_AT IS null LIMIT 1`;
        const results: any[] = await executeQuery(query, [vayoman, malmatta_varnan_id]);
        return results;
    } catch (error) {
        logger.error(`Error fetching भारांक: ${error.message}`);
        throw error;
    }
}
export async function getKhulabhukhandModalData(id:any): Promise<any[]> {
    try{
        const query = `
        SELECT * 
        FROM taxationland_temp 
        WHERE TAXATIONLAND_ID = ? AND DELETED_AT IS null LIMIT 1`;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    }catch (error) {
        logger.error(`Error fetching खुला भूखंड कर आकारणी modal data: ${error.message}`);
        throw error;
    }
}
export async function updateKhaliBhukhand(data:any, id:any): Promise<any> {
    try {
        const sql = `UPDATE taxationland_temp SET 
                    MILKAT_VAPAR_ID = ?, 
                    MILKAT_VAPAR_ID1 = ?, 
                    VAPARACHE_PRAKAR = ?, 
                    GATGRAMPANCHAYAT_ID = ?, 
                    OPENPLOT_ID = ?, 
                    AREAP = ?, 
                    AREAI = ?, 
                    TOTALAREA = ?, 
                    AREAP1 = ?, 
                    AREAI1 = ?, 
                    TOTALAREA1 = ?, 
                    ANNUALVALUE = ?, 
                    LEVYRATE = ?, 
                    CAPITAL = ?, 
                    TAXATION = ?
                WHERE TAXATIONLAND_ID = ?`;
        data = Object.values(data);
        await executeQuery(sql, [...data,id]);
    } catch (err) {
        logger.error('Error ::updateKhaliBhukhand :', err);
        throw err;
    }
}

export async function deleteKhaliBhukhand(id:number): Promise<any> {
    try {
        const sql = `DELETE FROM taxationland_temp WHERE TAXATIONLAND_ID = ?`;
        await executeQuery(sql, [id]);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::deleteKhaliBhukhand :', err);
        throw err;
    }
}

export async function getBhandkamModalData(id:any): Promise<any[]> {
    try{
        const query = `
        SELECT * 
        FROM constructiontax_temp 
        WHERE CONSTRUCTIONTAX_ID = ? AND DELETED_AT IS null LIMIT 1`;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    }catch (error) {
        logger.error(`Error fetching बांधकाम कर आकारणी modal data: ${error.message}`);
        throw error;
    }
}
export async function updateBandkamModalRecords(data:any, id:any): Promise<any> {
    try {
        const sql = `UPDATE constructiontax_temp SET 
                    MILKAT_VAPAR_ID = ?, 
                    MALMATTA_ID = ?, 
                    VAPARACHE_PRAKAR = ?, 
                    FLOOR_ID = ?, 
                    AREAP = ?, 
                    AREAI = ?, 
                    TOTALAREA = ?, 
                    AREAP1 = ?, 
                    AREAI1 = ?, 
                    TOTALAREA1 = ?, 
                    LIFESPAN = ?, 
                    CONSTRUCTING = ?, 
                    DEPRECIATION = ?, 
                    WEIGHTTAGE = ?, 
                    ANNUALCOST = ?, 
                    LEVYRATE = ?, 
                    ONE = ?, 
                    TWO = ?
                WHERE CONSTRUCTIONTAX_ID = ?`;
        data = Object.values(data);
        await executeQuery(sql, [...data,id]);
    } catch (err) {
        logger.error('Error ::updateBandkamModalRecords :', err);
        throw err;
    }
}
export async function deletebandkamKarAkkarniRecord(id:number): Promise<any> {
    try {
        const sql = `DELETE FROM constructiontax_temp WHERE CONSTRUCTIONTAX_ID = ?`;
        await executeQuery(sql, [id]);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::deleteBandkamModalRecords :', err);
        throw err;
    }
}

export async function getManoraKarAkaraniRecortds(id:any): Promise<any[]> {
    try{
        const query = `
        SELECT * 
        FROM taxpayers_temp 
        WHERE TAXPAYERS_ID = ? AND DELETED_AT IS null LIMIT 1`;
        const results: any[] = await executeQuery(query, [id]);
        return results;
    }catch (error) {
        logger.error(`Error fetching मनोरा कर आकारणी modal data: ${error.message}`);
        throw error;
    }
}

export async function updateManoraKarAkaraniRecords(data:any, id:any): Promise<any> {
    try {
        const sql = `UPDATE taxpayers_temp SET 
                    MILKAT_VAPAR_ID = ?, 
                    MALMATTA_ID = ?, 
                    VAPARACHE_PRAKAR = ?, 
                    MANORAMASTER_ID = ?, 
                    AREAP = ?, 
                    AREAI = ?, 
                    TOTALAREA = ?, 
                    AREAP1 = ?, 
                    AREAI1 = ?, 
                    TOTALAREA1 = ?, 
                    CAPITAL = ?, 
                    TAXATION = ?
                WHERE TAXPAYERS_ID = ?`;
        data = Object.values(data);
        await executeQuery(sql, [...data,id]);
    } catch (err) {
        logger.error('Error ::updateManoraKarAkaraniRecords :', err);
        throw err;
    }
}
export async function deleteManoraKarAkaraniRecord(id:number): Promise<any> {
    try {
        const sql = `DELETE FROM taxpayers_temp WHERE TAXPAYERS_ID = ?`;
        await executeQuery(sql, [id]);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::deleteManoraKarAkaraniRecord :', err);
        throw err;
    }
}

export async function deleteKhulaBhukhandBySession(data:any): Promise<{ status: number; message: string; }> {
    try {
        const sql = `DELETE FROM taxationland_temp WHERE RandomNumber = ? AND user_id = ? AND RNO = ?`;
        const params = [data.randomNumber, data.user_id, data.rno];
        const result = await executeQuery(sql, params);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::deleteKhulaBhukhandBySession :', err);
        throw err;
    }
}

export async function delete_buildingKarAkarniSession(data:any): Promise<{ status: number; message: string; }> {
    try {
        const sql = `DELETE FROM constructiontax_temp WHERE RandomNumber = ? AND user_id = ? AND RNO = ?`;
        const params = [data.randomNumber, data.user_id, data.rno];
        const result = await executeQuery(sql, params);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::delete_buildingKarAkarniSession :', err);
        throw err;
    }
}

export async function delete_manoraKarBySession(data:any):Promise<{ status: number; message: string; }> {
    try {
        const sql = `DELETE FROM taxpayers_temp WHERE RandomNumber = ? AND user_id = ? AND RNO = ?`;
        const params = [data.randomNumber, data.user_id, data.rno];
        const result = await executeQuery(sql, params);
        return { status: 200, message: "Data Deleted Successfully" };
    } catch (err) {
        logger.error('Error ::delete_manoraKarBySession :', err);
        throw err;
    }
}