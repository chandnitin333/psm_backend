import { Environment } from "./env";

export const ProdEnvironment: Environment = {
    DB_HOST: "localhost",
    DB_USER: "root",
    DB_PWD: "Java@123",
    DB_NAME: "test",
    DB_CONNECTION_LIMIT: 10,
    jwt_secret: "test"
};