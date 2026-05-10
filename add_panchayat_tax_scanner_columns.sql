-- Adds two scanner image columns to the panchayat table.
-- Stores filenames (relative to /uploads) of ghar tax and pani tax scanner images.

ALTER TABLE `panchayat`
    ADD COLUMN `GHAR_TAX_SCANNER` VARCHAR(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
    ADD COLUMN `PANI_TAX_SCANNER` VARCHAR(200) COLLATE utf8mb4_general_ci DEFAULT NULL;
