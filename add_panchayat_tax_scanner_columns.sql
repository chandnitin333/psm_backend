-- Adds two scanner image columns to the panchayat table.
-- Stores filenames (relative to /uploads) of ghar tax and pani tax scanner images.
-- The backend self-heals these columns too (grampanchayat.service.ts).
-- MariaDB IF NOT EXISTS syntax — safe to run multiple times.

ALTER TABLE `panchayat` ADD COLUMN IF NOT EXISTS `GHAR_TAX_SCANNER` VARCHAR(200) COLLATE utf8mb4_general_ci DEFAULT NULL;
ALTER TABLE `panchayat` ADD COLUMN IF NOT EXISTS `PANI_TAX_SCANNER` VARCHAR(200) COLLATE utf8mb4_general_ci DEFAULT NULL;
