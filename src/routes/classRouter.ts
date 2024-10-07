import { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { classController } from "../controllers/classController";


export class courseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.postRoutes();
    }

    postRoutes() {
        this.router.post('/get-live-class-list', GlobalMiddleware.authenticate, classController.liveClass);
        this.router.post('/get-live-class-status', GlobalMiddleware.authenticate, classController.liveClassStatus);
        this.router.post('/add-live-class-status', GlobalMiddleware.authenticate, classController.addLiveClassMeetingStatus);
    }


}


export default new courseRouter().router;