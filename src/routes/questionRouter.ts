import { Router } from "express";


export class questionRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.postRoutes();
    }

    postRoutes() {

    }


}


export default new questionRouter().router;