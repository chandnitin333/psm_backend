import { ENV_VAR } from "../constants/constant";
import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";


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

