import { Router } from "express";
import { AuthController } from "../controllers/admin/auth.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { district } from "../controllers/admin/district.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";

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

        this.router.get('/get-gram-panchayat/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, grampanchayat.getGramPanchayat);
    }

    postRoutes() {
        this.router.post('/district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,district.addDistrict);
        this.router.post('/district-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.getDistrictList);

        this.router.post('/taluka', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,taluka.addTaluka);
        this.router.post('/taluka-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.getTalukatList);

        this.router.post('/gram-panchayat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate,grampanchayat.addGramPanchayat);
        this.router.post('/gram-panchayat-list', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, grampanchayat.getGramPanchayatList);

        // for dropdown list
        this.router.post('/district-list-ddl', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.getAllDistrictDDL);
        this.router.post('/taluka-list-by-district-id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.getTalukaByDistrict);  // On district selection taluka list shown

        this.router.post('/sign-in', GlobalMiddleware.checkError, AuthController.authenticate);
    }

    deleteRoute() {
        this.router.delete('/district/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.deleteDistrict);

        this.router.delete('/taluka/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.deleteTaluka);

        this.router.delete('/gram-panchayat/:id', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, grampanchayat.deleteGramPanchayat);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, district.updateDistrict);

        this.router.put('/update-taluka', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, taluka.updateTaluka);

        this.router.put('/update-gram-panchayat', GlobalMiddleware.checkError,GlobalMiddleware.authenticate, grampanchayat.updateGramPanchayat);
    }
}


export default new adminRoutes().router;