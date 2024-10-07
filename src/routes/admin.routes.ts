import { Router } from "express";
import { AuthController } from "../controllers/admin/auth.controller";
import { district } from "../controllers/admin/district.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";

export class adminRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.deleteRoute();
        this.putRoute();
    }


    getRoutes() {
        this.router.get('/get-district/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.getDistrict);
    }

    postRoutes() {
        this.router.post('/district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,district.addDistrict);
        this.router.post('/district-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.getDistrictList);

        this.router.post('/sign-in', GlobalMiddleware.checkError, AuthController.authenticate);
    }

    deleteRoute() {
        this.router.delete('/district/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.deleteDistrict);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.updateDistrict);
    }
}


export default new adminRoutes().router;
