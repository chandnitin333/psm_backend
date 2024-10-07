import { Router } from "express";
import { district } from "../controllers/District.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";

export class psmRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.deleteRoute();
        this.putRoute();
    }


    getRoutes() {
        this.router.get('/list', GlobalMiddleware.checkError, district.getDistrictList);
    }

    postRoutes() {
        this.router.post('/add-district', GlobalMiddleware.checkError, district.addDistrict);
        this.router.post('/get-district', GlobalMiddleware.checkError, district.getDistrict);
    }

    deleteRoute() {
        this.router.delete('/delete-district', GlobalMiddleware.checkError, district.deleteDistrict);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError, district.updateDistrict);
    }
}


export default new psmRoutes().router;