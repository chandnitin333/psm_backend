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

