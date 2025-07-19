CREATE PROCEDURE `multipleinsertdata`(
    IN anu_kramank VARCHAR(100),
    IN vard_number VARCHAR(100),
    IN ramdom TEXT,
    IN userid INT,
    IN rno INT,
    IN tokens TEXT
)
BEGIN
    DECLARE local_newuserid INT DEFAULT NULL;

    SELECT NEWUSER_ID INTO local_newuserid
    FROM newuser
    WHERE ANNU_KRAMANK = anu_kramank 
      AND VARD_NUMBER = vard_number 
      AND user_id = userid 
      AND RNO = rno 
      AND Tokens = tokens 
      AND RandomNumber = ramdom;

    IF local_newuserid IS NOT NULL AND local_newuserid <> 0 THEN
    
        UPDATE taxationland_temp
        SET newuser_id = local_newuserid
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND Annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        UPDATE constructiontax_temp
        SET newuser_id = local_newuserid
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        UPDATE taxpayers_temp
        SET newuser_id = local_newuserid
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        INSERT INTO taxationland (
            newuser_id, user_id, extra, taxpayersss, tax1000, vard_number, Annu_kramank,
            RNO, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, GATGRAMPANCHAYAT_ID, OPENPLOT_ID,
            AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE,
            CAPITAL, TAXATION, Year_name, Year_id, reg_date, tdate, ttime, RandomNumber, Token
        )
        SELECT local_newuserid, user_id, 1, 1, 1000, vard_number, Annu_kramank,
               RNO, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, GATGRAMPANCHAYAT_ID, OPENPLOT_ID,
               AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE,
               CAPITAL, TAXATION, Year_name, Year_id, reg_date, tdate, ttime, RandomNumber, Token
        FROM taxationland_temp
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND Annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        DELETE FROM taxationland_temp
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND Annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        DELETE FROM constructiontax_temp
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND annu_kramank = anu_kramank 
          AND vard_number = vard_number;

        DELETE FROM taxpayers_temp
        WHERE RandomNumber = ramdom 
          AND user_id = userid 
          AND RNO = rno 
          AND Token = tokens 
          AND annu_kramank = annu_kramank 
          AND vard_number = vard_number;

        SELECT 'successfullydeleted' AS deletes, local_newuserid AS newuserid;

    ELSE
        SELECT 'No matching records found' AS error;
    END IF;
END;


CREATE PROCEDURE DBMS_District_List()
BEGIN
    SELECT DISTRICT_ID AS id, DISTRICT_NAME AS District_Name, '' AS isactive 
    FROM district 
    ORDER BY District_Name;
END;


CREATE PROCEDURE DBMS_Taluka_List_By_District_ID(
    IN IN_District_ID INT
)
BEGIN
    SELECT TALUKA_ID, TALUKA_NAME 
    FROM taluka 
    WHERE DISTRICT_ID = IN_District_ID 
    ORDER BY TALUKA_NAME;
END;


CREATE PROCEDURE Delete_Record(
    IN ramdom VARCHAR(100),
    IN userid INT,
    IN rno INT,
    IN token VARCHAR(100)
)
BEGIN
    DELETE FROM taxationland_temp 
    WHERE RandomNumber = ramdom 
      AND user_id = userid 
      AND RNO = rno 
      AND Token = token;
      
    DELETE FROM constructiontax_temp  
    WHERE RandomNumber = ramdom 
      AND user_id = userid 
      AND RNO = rno 
      AND Token = token;
       
    DELETE FROM taxpayers_temp  
    WHERE RandomNumber = ramdom 
      AND user_id = userid 
      AND RNO = rno 
      AND Token = token;
END;


CREATE PROCEDURE desk()
BEGIN
    DECLARE a VARCHAR(100);
    DECLARE YEARS FLOAT;
    DECLARE GROW DATETIME;
    DECLARE GROWTH_YEAR FLOAT;
    DECLARE GROWTH_MONTH FLOAT;
    DECLARE GROWTH_DAY FLOAT;
    DECLARE GROWTH_DAY1 DATETIME;

    SET GROW = CURDATE();
    SET GROWTH_YEAR = YEAR(GROW);
    SET GROWTH_MONTH = MONTH(GROW);
    SET GROWTH_DAY = DAY(GROW);
    SET GROWTH_DAY1 = STR_TO_DATE(CONCAT(GROWTH_YEAR, '-03-31'), '%Y-%m-%d');

    simple_loop: LOOP
        IF CAST(a AS UNSIGNED) > 1000 THEN
            LEAVE simple_loop;
        END IF;

        SELECT a AS anu;

        SET a = CAST(a AS UNSIGNED) + 1;
    END LOOP simple_loop;
END;


CREATE PROCEDURE GRAM()
BEGIN
    DECLARE YEARS FLOAT;
    DECLARE GROW DATETIME;
    DECLARE GROWTH_YEAR FLOAT;
    DECLARE GROWTH_MONTH FLOAT;
    DECLARE GROWTH_DAY FLOAT;
    DECLARE GROWTH_DAY1 DATETIME;

    SET GROW = NOW();
    SET GROWTH_YEAR = YEAR(GROW);
    SET GROWTH_MONTH = MONTH(GROW);
    SET GROWTH_DAY = DAY(GROW);
    SET GROWTH_DAY1 = STR_TO_DATE(CONCAT(GROWTH_YEAR, '-03-31'), '%Y-%m-%d');

    IF GROWTH_DAY1 > GROW THEN
        SET YEARS = GROWTH_YEAR - 1;
        SELECT YEARS AS yyy;
    ELSE
        SET YEARS = GROWTH_YEAR;
        SELECT YEARS AS yyy;
    END IF;
END;


CREATE PROCEDURE taxationdata(
    IN userid INT,
    IN newuserid INT
)
BEGIN
    DECLARE taxationland_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO taxationland_exists 
    FROM taxationland A 
    WHERE A.user_id = userid AND A.newuser_id = newuserid;

    IF taxationland_exists = 0 THEN
        SELECT '' AS MILKAT_VAPAR_NAME, 0 AS TOTALAREA1, 0 AS TOTALAREA, '' AS ANNUALVALUE, '' AS CAPITAL, '' AS levyrate, '' AS TAXATION;
    ELSE
        SELECT A.*, X.MILKAT_VAPAR_NAME, P.PRAKAR_NAME, MV.MILKAT_VAPAR_NAME, TX.VAPARACHE_PRAKAR 
        FROM taxationland A 
        INNER JOIN milkat_vapar X ON X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
        INNER JOIN openplot OP ON OP.OPENPLOT_ID = A.OPENPLOT_ID
        INNER JOIN prakar P ON P.PRAKAR_ID = (SELECT Y.PRAKAR_ID FROM OPENPLOT Y WHERE Y.OPENPLOT_ID = A.OPENPLOT_ID)
        INNER JOIN milkat_vapar MV ON MV.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
        INNER JOIN gatgrampanchayat GT ON GT.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID
        INNER JOIN taxationland TX ON TX.TAXATIONLAND_ID = A.TAXATIONLAND_ID
        WHERE A.user_id = userid AND A.newuser_id = newuserid
        LIMIT 1;
    END IF;
END;


CREATE PROCEDURE taxationtemp(
    IN ramdom VARCHAR(100),
    IN userid INT,
    IN rno INT,
    IN tokens VARCHAR(100)
)
BEGIN
    SELECT A.*, 
    (SELECT X.MILKAT_VAPAR_NAME FROM milkat_vapar X WHERE X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID) AS MILKAT_VAPAR_NAME,
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
    (SELECT X.TAXATION FROM taxationland_temp X WHERE X.TAXATIONLAND_ID = A.TAXATIONLAND_ID) AS TAXATION
    FROM taxationland_temp A 
    WHERE RandomNumber = ramdom AND user_id = userid AND RNO = rno AND Token = tokens 
    ORDER BY TAXATIONLAND_ID ASC
    LIMIT 3;
END;


CREATE PROCEDURE getUserCounts(IN user_id INT)
BEGIN
    SELECT 
        (SELECT COUNT(annu_kramank)  FROM newuser WHERE user_id = user_id) AS current_account,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'अधिकृत' AND user_id = user_id) AS ADHIKRUT,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'घरकुल' AND user_id = user_id) AS GHARKUL,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE milkar_prakar = 'इमलाकर' AND user_id = user_id) AS IMLAKAR,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'घर कर लावायचा आहे' AND user_id = user_id) AS HOME_KAR;
END;


CREATE PROCEDURE getMemberList(IN panachayt_id INT)
BEGIN
    SELECT 
    A.*,
    X.NAME_NAME,
    X.MIDDLE_NAME,
    X.LAST_NAME,
    A.DESIGNATION_ID,
    X.MOBILE_NO
    FROM 
        membermaster A
    LEFT JOIN 
        membermaster X ON X.MEMBERMASTER_ID = A.MEMBERMASTER_ID
    WHERE 
        A.PANCHAYAT_ID = panachayt_id;
END;
