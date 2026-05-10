-- Schema for the `dand_sut` table.
-- The backend service auto-creates and auto-migrates this table on first call,
-- but you can run this manually as well.

CREATE TABLE IF NOT EXISTS `dand_sut` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `district_id` INT DEFAULT NULL,
    `taluka_id` INT DEFAULT NULL,
    `grampanchayat_id` INT DEFAULT NULL,
    `kar_type` ENUM('chalu', 'magil') DEFAULT NULL,
    `gruhkar_v_bhumikar_5` DECIMAL(12, 2) DEFAULT NULL,
    `viz_v_divabatti_kar_5` DECIMAL(12, 2) DEFAULT NULL,
    `aarogya_rakshan_kar_5` DECIMAL(12, 2) DEFAULT NULL,
    `safae_kar_5` DECIMAL(12, 2) DEFAULT NULL,
    `samanya_pani_kar_5` DECIMAL(12, 2) DEFAULT NULL,
    `vishesh_pani_kar_5` DECIMAL(12, 2) DEFAULT NULL,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migration for existing installs (drops the old `_5_sut_dand` columns and renames the
-- base columns to `_5`). Each statement is idempotent-safe by checking column existence.
SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='g_v_b_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN g_v_b_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='v_v_d_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN v_v_d_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='ark_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN ark_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='s_k_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN s_k_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='s_p_k_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN s_p_k_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='v_p_k_5_sut_dand'),
    'ALTER TABLE dand_sut DROP COLUMN v_p_k_5_sut_dand', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='gruhkar_v_bhumikar'),
    'ALTER TABLE dand_sut CHANGE gruhkar_v_bhumikar gruhkar_v_bhumikar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='viz_v_divabatti_kar'),
    'ALTER TABLE dand_sut CHANGE viz_v_divabatti_kar viz_v_divabatti_kar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='aarogya_rakshan_kar'),
    'ALTER TABLE dand_sut CHANGE aarogya_rakshan_kar aarogya_rakshan_kar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='safae_kar'),
    'ALTER TABLE dand_sut CHANGE safae_kar safae_kar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='samanya_pani_kar'),
    'ALTER TABLE dand_sut CHANGE samanya_pani_kar samanya_pani_kar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @s := (SELECT IF(
    EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='dand_sut' AND COLUMN_NAME='vishesh_pani_kar'),
    'ALTER TABLE dand_sut CHANGE vishesh_pani_kar vishesh_pani_kar_5 DECIMAL(12,2) DEFAULT NULL', 'SELECT 1'));
PREPARE stmt FROM @s; EXECUTE stmt; DEALLOCATE PREPARE stmt;
