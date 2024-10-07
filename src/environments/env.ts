import { ProdEnvironment } from "./prod.env";
import { DevEnvironment } from "./dev.env";
import { ENV_VAR } from "../constants/constant";

const config = require("../config/eganeetConfig.json");



export interface Environment {
    DB_HOST: string,
    DB_USER: string,
    DB_PWD: string,
    DB_NAME: string,
    DB_CONNECTION_LIMIT: number,
    jwt_secret: string

}


export function getEnvironmentVariable() {

    if (process.env.NODE_ENV == 'production') {
        return ProdEnvironment;
    }
    console.log(ProdEnvironment.DB_HOST)
    return DevEnvironment;
}

export function configData() {
    let configList: object
    if (process.env.NODE_ENV == 'production') {
        return configList = config[ENV_VAR.prod]
    }
    console.log(configList)
    return configList = config[ENV_VAR.dev]

}
