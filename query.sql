ALTER TABLE milkat ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE milkat_vapar ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE membermaster ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE uploaddatadashboard ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

--  Kundan db update -> you can run on your db (once run this sql remove this comment)
ALTER TABLE floor ADD DELETED_AT DATETIME DEFAULT NULL NULL;
ALTER TABLE prakar ADD DELETED_AT DATETIME DEFAULT NULL NULL;

ALTER TABLE othertax ADD COLUMN DELETED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE createothertax ADD COLUMN DELETED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE openplot ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE panchayat ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE malmatta ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE malmattaincome ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE othertax ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE createothertax ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;



ALTER TABLE createothertax
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;



ALTER TABLE bdouser
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;


ALTER TABLE annualtax
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;



ALTER TABLE depreciation
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE buildingweights
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;


ALTER TABLE manoramaster
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;


ALTER TABLE designation
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;




ALTER TABLE up
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE entries
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;
entries

ALTER TABLE vasuliuser
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;

ALTER TABLE ferfaruserpdf
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;


ALTER TABLE ferfaruser
ADD COLUMN DELETED_AT DATETIME DEFAULT NULL;



# CREATE PROCEDURE



CREATE PROCEDURE multipleinsertdata (
    IN anu_kramank VARCHAR(100),
    IN vard_number VARCHAR(100),
    IN ramdom TEXT,
    IN userid INT,
    IN rno INT,
    IN tokens TEXT,
    OUT newuserid INT
)
BEGIN
    DECLARE local_newuserid INT DEFAULT NULL;

    SELECT NEWUSER_ID INTO local_newuserid
    FROM NEWUSER
    WHERE ANNU_KRAMANK = anu_kramank 
      AND VARD_NUMBER = vard_number 
      AND USER_ID = userid 
      AND RNO = rno 
      AND TOKENS = tokens 
      AND RANDOMNUMBER = ramdom;

    SET newuserid = local_newuserid;
    IF local_newuserid IS NOT NULL AND local_newuserid <> 0 THEN
    
        UPDATE TAXATIONLAND_Temp
        SET NEWUSER_ID = local_newuserid
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

     
        UPDATE constructiontax_temp
        SET NEWUSER_ID = local_newuserid
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

       
        UPDATE TAXPAYERS_Temp
        SET NEWUSER_ID = local_newuserid
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

       
        INSERT INTO TAXATIONLAND (
            NEWUSER_ID, USER_ID, EXTRA, TAXPAYERSSS, TAX1000, VARD_NUMBER, ANNU_KRAMANK,
            RNO, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, GATGRAMPANCHAYAT_ID, OPENPLOT_ID,
            AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE,
            CAPITAL, TAXATION, YEAR_NAME, YEAR_ID, REG_DATE, TDATE, TTIME, RANDOMNUMBER, TOKEN
        )
        SELECT local_newuserid, USER_ID, 1, 1, 1000, VARD_NUMBER, ANNU_KRAMANK,
               RNO, MILKAT_VAPAR_ID, MILKAT_VAPAR_ID1, VAPARACHE_PRAKAR, GATGRAMPANCHAYAT_ID, OPENPLOT_ID,
               AREAP, AREAI, TOTALAREA, AREAP1, AREAI1, TOTALAREA1, ANNUALVALUE, LEVYRATE,
               CAPITAL, TAXATION, YEAR_NAME, YEAR_ID, REG_DATE, TDATE, TTIME, RANDOMNUMBER, TOKEN
        FROM TAXATIONLAND_Temp
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

       
        DELETE FROM TAXATIONLAND_Temp
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

        DELETE FROM constructiontax_temp
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

        DELETE FROM TAXPAYERS_Temp
        WHERE RANDOMNUMBER = ramdom 
          AND USER_ID = userid 
          AND RNO = rno 
          AND TOKEN = tokens 
          AND ANNU_KRAMANK = anu_kramank 
          AND VARD_NUMBER = vard_number;

        SELECT 'successfullydeleted' AS deletes;
    END IF;
   
END





CREATE PROCEDURE DBMS_District_List()
BEGIN
    SELECT DISTRICT_ID AS id, DISTRICT_NAME AS District_Name, '' AS isactive 
    FROM District 
    ORDER BY District_Name;
END 



CREATE PROCEDURE DBMS_Taluka_List_By_District_ID(
    IN District_ID INT
)
BEGIN
    SELECT Taluka_ID, Taluka_Name 
    FROM Taluka 
    WHERE District_ID = District_ID 
    ORDER BY Taluka_Name;
END 




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
      AND token = token;
      
    DELETE FROM constructiontax_temp  
    WHERE RandomNumber = ramdom 
      AND user_id = userid 
      AND RNO = rno 
      AND token = token;
       
    DELETE FROM taxpayers_temp  
    WHERE RandomNumber = ramdom 
      AND user_id = userid 
      AND RNO = rno 
      AND token = token;
END 






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

   
    SELECT annu_kramank INTO a 
    FROM newuser 
    WHERE user_id = 1016 
    ORDER BY vard_number, annu_kramank ASC 
    LIMIT 1;

 
    simple_loop: LOOP
        IF CAST(a AS UNSIGNED) > 1000 THEN
            LEAVE simple_loop;
        END IF;

        SELECT a AS anu;

       
        SET a = CAST(a AS UNSIGNED) + 1;
    END LOOP simple_loop;

END 





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
END 




CREATE PROCEDURE taxationdata(
    IN userid INT,
    IN newuserid INT
)
BEGIN
    DECLARE taxationland_exists INT DEFAULT 0;

   
    SELECT COUNT(*) INTO taxationland_exists 
    FROM TAXATIONLAND A 
    WHERE A.user_id = userid AND A.newuser_id = newuserid;

    IF taxationland_exists = 0 THEN
        SELECT '' AS MILKAT_VAPAR_NAME, 0 AS TOTALAREA1, 0 AS TOTALAREA, '' AS ANNUALVALUE, '' AS CAPITAL, '' AS levyrate, '' AS TAXATION;
    ELSE
        SELECT A.*, X.MILKAT_VAPAR_NAME, P.PRAKAR_NAME, MV.MILKAT_VAPAR_NAME, TX.VAPARACHE_PRAKAR 
        FROM TAXATIONLAND A 
        INNER JOIN MILKAT_VAPAR X ON X.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
        INNER JOIN OPENPLOT OP ON OP.OPENPLOT_ID = A.OPENPLOT_ID
        INNER JOIN PRAKAR P ON P.PRAKAR_ID = (SELECT Y.PRAKAR_ID FROM OPENPLOT Y WHERE Y.OPENPLOT_ID = A.OPENPLOT_ID)
        INNER JOIN MILKAT_VAPAR MV ON MV.MILKAT_VAPAR_ID = A.MILKAT_VAPAR_ID
        INNER JOIN GATGRAMPANCHAYAT GT ON GT.GATGRAMPANCHAYAT_ID = A.GATGRAMPANCHAYAT_ID
        INNER JOIN TAXATIONLAND TX ON TX.TAXATIONLAND_ID = A.TAXATIONLAND_ID
        WHERE A.user_id = userid AND A.newuser_id = newuserid
        LIMIT 1;
    END IF;
END 






CREATE PROCEDURE taxationtemp(
    IN ramdom VARCHAR(100),
    IN userid INT,
    IN rno INT,
    IN tokens VARCHAR(100)
)
BEGIN
    SELECT A.*, 
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
    FROM TAXATIONLAND_Temp A 
    WHERE RandomNumber = ramdom AND user_id = userid AND RNO = rno AND Token = tokens 
    ORDER BY TAXATIONLAND_ID ASC
    LIMIT 3;
END 



CREATE PROCEDURE getUserCounts(IN user_id INT)
BEGIN
    SELECT 
        (SELECT COUNT(annu_kramank)  FROM newuser WHERE user_id = user_id) AS current_account,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'अधिकृत' AND user_id = user_id) AS ADHIKRUT,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'घरकुल' AND user_id = user_id) AS GHARKUL,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE milkar_prakar = 'इमलाकर' AND user_id = user_id) AS IMLAKAR,
        (SELECT COUNT(milkar_prakar) FROM newuser WHERE MILKAR_PRAKAR = 'घर कर लावायचा आहे' AND user_id = user_id) AS HOME_KAR;
END 


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
        MEMBERMASTER A
    LEFT JOIN 
        MEMBERMASTER X ON X.MEMBERMASTER_ID = A.MEMBERMASTER_ID
    WHERE 
        A.PANCHAYAT_ID = 1036;
END 

