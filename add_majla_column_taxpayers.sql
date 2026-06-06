-- The manora kar aakarni insert writes a `majla` value, but the taxpayers /
-- taxpayers_temp tables were created without it. Add the column.
-- The backend self-heals this too (nodni.service.ts ensureMajlaColumn).
-- MariaDB IF NOT EXISTS syntax — safe to run multiple times.

ALTER TABLE `taxpayers` ADD COLUMN IF NOT EXISTS `majla` INT DEFAULT NULL;
ALTER TABLE `taxpayers_temp` ADD COLUMN IF NOT EXISTS `majla` INT DEFAULT NULL;
