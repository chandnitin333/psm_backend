import * as express from 'express';
import { init } from './config/db/db';
import { getEnvironmentVariable } from './environments/env';
import { logger } from './logger/Logger';

import adminRoutes from './routes/admin.routes';
import bodyParser = require("body-parser");
import cors = require('cors');




/**
 * ICAD Technology
 * @author Nitin Chandekar
 * @date 22 Jan 2023
 * Use for Configuration application
 */
export class Server {
    public app: express.Application = express();
    constructor() {
        init()
        this.defaultMiddleware()
        this.configBodyParser()
        this.setRoutes()
        this.handleErrors()


    }

    configBodyParser() {

        this.app.use(bodyParser.text());
        this.app.use(bodyParser.raw());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors({ origin: 'http://localhost:4200' }));

        this.app.use((_, res, next) => {
           
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });
    }

    setRoutes() {

        this.app.use('/api/admin/', adminRoutes);

    }
    dbConnection() {

        let hostname = getEnvironmentVariable().DB_HOST


    }

    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            logger.error("Uncaused handleErrors :: ", error?.message);
            if (!res.headersSent) {
                res.status(errorStatus).json({
                    message: error.message || 'Something went wrong Please try again..!',
                    status_code: errorStatus,
                    SUCCESS: errorStatus,
                });
            }
            next(error);
        });
    }

    defaultMiddleware() {
        this.app.use((req, res, next) => {
            console.log(`Request URL: ${req.url}`);
            const controllerName = req.route?.path; // Use req.route.path to get the route path
            console.log(`Controller Name: ${controllerName}`);
            next();
        });

    }

}
