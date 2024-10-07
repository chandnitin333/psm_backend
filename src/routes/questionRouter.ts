import { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { questionController } from "../controllers/questionController";


export class questionRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.postRoutes();
    }

    postRoutes() {
        this.router.post('/get-all-exam-questions', GlobalMiddleware.authenticate, questionController.getAllExamQuestion);


    }


}


export default new questionRouter().router;