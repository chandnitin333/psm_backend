import { Router } from "express";
import { district } from "../controllers/admin/district.controller";
import { Floor } from "../controllers/admin/floor.controller";
import { gatgrampanchayat } from "../controllers/admin/gatgrampanchayat.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";
import { KaryaKarniCommitee } from "../controllers/admin/karyakarni-commitee.controller";
import { Malmatta } from "../controllers/admin/malmatta.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { AuthController } from "../controllers/main/auth.controller";
import { CustomerController } from "../controllers/main/customer.controller";
import { FerFarYadi } from "../controllers/main/ferfar-yadi.controller";
import { Nodni } from "../controllers/main/nodni.controller";
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
        this.router.get('/get-malmatta-nodni-user-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.getCustomerById);
        this.router.get('/get-namuna-8-1/:new_user_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.namuna_8_1);
        this.router.get('/get-namuna-9-1/:new_user_id/:ward_number', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.namuna_9_1);
        this.router.get('/get-namuna-8-sarkari/:new_user_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.namuna_8_sarkari);

        this.router.get('/get-all-year-list', GlobalMiddleware.checkError, FerFarYadi.getYearList);

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


        this.router.post('/get-user-activity', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AuthController.getActivityCount);
        this.router.post('/get-member-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AuthController.getMemberDetails);

        this.router.post('/add-new-customer-in-malmatta-nodni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.createCustomerInfo);
        this.router.post('/get-annu-kramank-in-malmatta-nodni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.getAnnuKramank);
        this.router.post('/get-malmatta-nodni-list-info', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.getMalmattaNodniInfoList);
        this.router.post('/insert-update-sillak-joda', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.createUpdateSillakJoda);
        this.router.post('/verify-user-for-permission', GlobalMiddleware.checkError, CustomerController.verifyUser);

        this.router.post('/add-new-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.createNewFerfarYadiInfo);
        this.router.post('/get-annu-kramank-in-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getAnnuKramankFerfarYadi);

        this.router.post('/get-open-construction-tax-assessment', GlobalMiddleware.checkError, Nodni.getOpenConstructionTaxAssessment);
        this.router.post('/get-tax-assessment-construction', GlobalMiddleware.checkError, Nodni.getTaxAssessmentForConstruction);
        this.router.post('/get-tax-assessment-towers', GlobalMiddleware.checkError, Nodni.getTaxAssessmentForTowers);
        this.router.post('/get-other-tax-calculation', GlobalMiddleware.checkError, Nodni.getOtherTaxCalculation);


        this.router.post('/save-nodni-from', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveNondniFrom);
        this.router.post('/save-khali-bhukhand', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveKhaliBhuKhand);
        this.router.post('/save-bandh-kam', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveBandhKamFrm);

        this.router.post('/save-tax-payer', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveTaxPeryers);


    }

    deleteRoute() {
        this.router.delete('/delete-district', GlobalMiddleware.checkError, district.deleteDistrict);
        this.router.delete('/delete-malmatta-nodni-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.deleteMalmattaNodniInfo);
    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError, district.updateDistrict);
        this.router.put('/update-malmatta-nodni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.updateMalmattaNodniInfo);
    }
}


export default new psmRoutes().router;