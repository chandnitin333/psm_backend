-- Tables for the bill payment link feature (gruhkar/panikar QR scanner payments).
-- The backend service auto-creates and auto-migrates these on first call
-- (bill-payment.service.ts), but you can run this manually as well.
-- Syntax below uses MariaDB's IF NOT EXISTS support — everything is idempotent.

CREATE TABLE IF NOT EXISTS `bill_payment_link` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(64) NOT NULL,
    `user_id` INT DEFAULT NULL,
    `newuser_id` INT DEFAULT NULL,
    `ward_no` INT DEFAULT NULL,
    `year_id` INT DEFAULT NULL,
    `panchayat_id` INT DEFAULT NULL,
    `report_type` VARCHAR(10) DEFAULT '129-1',
    `bill_data` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_bill_payment_link_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `bill_payment` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `link_id` INT NOT NULL,
    `kar_type` ENUM('gruhkar', 'panikar') DEFAULT NULL,
    `payment_mode` ENUM('cash', 'upi') DEFAULT NULL,
    `amount` DECIMAL(12, 2) DEFAULT NULL,
    `utr_number` VARCHAR(100) DEFAULT NULL,
    `transaction_image` VARCHAR(200) DEFAULT NULL,
    `payer_name` VARCHAR(200) DEFAULT NULL,
    `payer_mobile` VARCHAR(20) DEFAULT NULL,
    `payer_remark` VARCHAR(300) DEFAULT NULL,
    `username` VARCHAR(100) DEFAULT NULL,
    `status` ENUM('claimed', 'verified', 'rejected') DEFAULT 'claimed',
    `remark` VARCHAR(300) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migration for installs where the tables already exist without the newer columns.
ALTER TABLE `bill_payment_link` ADD COLUMN IF NOT EXISTS `report_type` VARCHAR(10) DEFAULT '129-1' AFTER `panchayat_id`;
ALTER TABLE `bill_payment` ADD COLUMN IF NOT EXISTS `payment_mode` ENUM('cash', 'upi') DEFAULT NULL AFTER `kar_type`;
ALTER TABLE `bill_payment` ADD COLUMN IF NOT EXISTS `transaction_image` VARCHAR(200) DEFAULT NULL AFTER `utr_number`;
ALTER TABLE `bill_payment` ADD COLUMN IF NOT EXISTS `payer_remark` VARCHAR(300) DEFAULT NULL AFTER `payer_mobile`;
ALTER TABLE `bill_payment` ADD COLUMN IF NOT EXISTS `username` VARCHAR(100) DEFAULT NULL AFTER `payer_remark`;
