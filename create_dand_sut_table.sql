-- Schema for the `dand_sut` table.
-- The backend service auto-creates and auto-migrates this table on first call
-- (sut-dand.service.ts), but you can run this manually as well.
-- Syntax below uses MariaDB's IF EXISTS / IF NOT EXISTS support — idempotent.

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

-- Migration for old installs: drop the obsolete `_5_sut_dand` columns.
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `g_v_b_5_sut_dand`;
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `v_v_d_5_sut_dand`;
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `ark_5_sut_dand`;
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `s_k_5_sut_dand`;
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `s_p_k_5_sut_dand`;
ALTER TABLE `dand_sut` DROP COLUMN IF EXISTS `v_p_k_5_sut_dand`;

-- NOTE: renaming the old base columns (gruhkar_v_bhumikar -> gruhkar_v_bhumikar_5 etc.)
-- is handled automatically by the backend self-heal (sut-dand.service.ts), which
-- preserves existing data. If you must do it manually instead, run for each pair:
--   ALTER TABLE dand_sut CHANGE gruhkar_v_bhumikar gruhkar_v_bhumikar_5 DECIMAL(12,2) DEFAULT NULL;
-- (only if the old column still exists and the new one does not).
