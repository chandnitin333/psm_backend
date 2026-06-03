-- Public read-only report view links (QR on printed reports).
-- The backend auto-creates this on first call (report-link.service.ts).

CREATE TABLE IF NOT EXISTS `report_view_link` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(64) NOT NULL,
    `user_id` INT DEFAULT NULL,
    `newuser_id` INT DEFAULT NULL,
    `report_key` VARCHAR(40) DEFAULT NULL,
    `params` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_report_view_link_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
