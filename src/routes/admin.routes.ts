import { Router } from "express";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { district } from "../controllers/district.controller";

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
        this.router.get('/get-district/:id', GlobalMiddleware.checkError, district.getDistrict);
    }

    postRoutes() {
        this.router.post('/district', GlobalMiddleware.checkError, district.addDistrict);
        this.router.post('/district-list', GlobalMiddleware.checkError, district.getDistrictList);
    }

    deleteRoute() {
        this.router.delete('/district/:id', GlobalMiddleware.checkError, district.deleteDistrict);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError, district.updateDistrict);
    }
}


export default new adminRoutes().router;