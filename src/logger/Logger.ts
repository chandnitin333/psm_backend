import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.splat(),
        format.printf(({ level, message }) => `${level}: ${message}`),
      ),

    }),
    new transports.File({
      dirname: "logs",
      filename: (new Date()).toISOString().split('T')[0] + ".log",
      format: format.combine(format.json()),
    }),
  ],
  format: format.combine(format.metadata(), format.timestamp()),
});

