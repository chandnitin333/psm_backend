ALTER TABLE milkat ADD DELETED_AT DATETIME DEFAULT NULL NULL;

ALTER TABLE milkat_vapar ADD DELETED_AT DATETIME DEFAULT NULL NULL;

ALTER TABLE membermaster ADD DELETED_AT DATETIME DEFAULT NULL NULL;

ALTER TABLE uploaddatadashboard ADD DELETED_AT DATETIME DEFAULT NULL NULL;

--  Kundan db update -> you can run on your db (once run this sql remove this comment)
ALTER TABLE floor ADD DELETED_AT DATETIME DEFAULT NULL NULL;
ALTER TABLE prakar ADD DELETED_AT DATETIME DEFAULT NULL NULL;

ALTER TABLE othertax ADD COLUMN DELETED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE createothertax ADD COLUMN DELETED_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE openplot ADD DELETED_AT DATETIME DEFAULT NULL NULL;


ALTER TABLE panchayat ADD IS_DELETE INT DEFAULT 0;


