import { Router } from "express";
import { AuthController } from "../controllers/admin/auth.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { district } from "../controllers/admin/district.controller";
import { taluka } from "../controllers/admin/taluka.controller";

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

        this.router.get('/get-taluka/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.getTaluka);
    }

    postRoutes() {
        this.router.post('/district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,district.addDistrict);
        this.router.post('/district-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.getDistrictList);

        this.router.post('/taluka', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,taluka.addTaluka);
        this.router.post('/taluka-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.getTalukatList);

        this.router.post('/sign-in', GlobalMiddleware.checkError, AuthController.authenticate);
    }

    deleteRoute() {
        this.router.delete('/district/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.deleteDistrict);

        this.router.delete('/taluka/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.deleteTaluka);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.updateDistrict);

        this.router.put('/update-taluka', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.updateTaluka);
    }
}


export default new adminRoutes().router;