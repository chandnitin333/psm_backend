import { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { courseController } from "../controllers/courseController";



export class courseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.postRoutes();
    }

    postRoutes() {
        this.router.post('/get-course-direct', GlobalMiddleware.authenticate, courseController.getAllCourses);


    }


}


export default new courseRouter().router;