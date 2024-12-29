import { Router } from "express";
import { district } from "../controllers/admin/district.controller";
import { Floor } from "../controllers/admin/floor.controller";
import { gatgrampanchayat } from "../controllers/admin/gatgrampanchayat.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";
import { KaryaKarniCommitee } from "../controllers/admin/karyakarni-commitee.controller";
import { Malmatta } from "../controllers/admin/malmatta.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { AuthController } from "../controllers/main/auth.controller";
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
        this.router.post('/sign-in', GlobalMiddleware.checkError, AuthController.authenticate);
        this.router.post('/district-list-ddl', GlobalMiddleware.checkError, district.getAllDistrictDDL);
        this.router.post('/taluka-list-by-district-id', GlobalMiddleware.checkError, taluka.getTalukaByDistrict);  // On district selection taluka list shown
        this.router.post('/panchayat-list-by-taluka-id', GlobalMiddleware.checkError, gatgrampanchayat.getGrampanchayatByTalukaId);  // On taluka selection grampanchayat list shown
        this.router.post('/gat-gram-panchayat-list-by-panchayat-id', GlobalMiddleware.checkError, gatgrampanchayat.getGatGrampanchayatByPanchayatId);  // On grampanchayat selection gatgrampanchayat list shown
        this.router.post('/malmatta-list-ddl', GlobalMiddleware.checkError, Malmatta.getAllMalmattaDDL)
        this.router.post('/age-of-buildings-ddl', GlobalMiddleware.checkError, Floor.getAllBuildingAgeDDL)
        this.router.post('/panchayat-list-ddl', GlobalMiddleware.checkError, grampanchayat.getAllgrampanchayatDDL)
        this.router.post('/designation-list-ddl', GlobalMiddleware.checkError, KaryaKarniCommitee.getAllDesignationDDL)


        this.router.post('/get-user-activity', GlobalMiddleware.checkError, AuthController.getActivityCount);

    }

    deleteRoute() {
        this.router.delete('/delete-district', GlobalMiddleware.checkError, district.deleteDistrict);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError, district.updateDistrict);
    }
}


export default new psmRoutes().router;