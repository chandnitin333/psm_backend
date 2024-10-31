import { Router } from "express";
import { AuthController } from "../controllers/admin/auth.controller";
import { DashboardUpload } from "../controllers/admin/dashboard-upload.controlle";
import { district } from "../controllers/admin/district.controller";
import { gatgrampanchayat } from "../controllers/admin/gatgrampanchayat.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";
import { Memeber } from "../controllers/admin/member.controller";
import { MilkatVapar } from "../controllers/admin/milkat-vapar.controller";
import { Milkat } from "../controllers/admin/milkat.controller";
import { OpenPlotController } from "../controllers/admin/openplot.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { Floor } from "../controllers/admin/floor.controller";
import { Prakar } from "../controllers/admin/prakar.controller";
import { Tax } from "../controllers/admin/tax.controller";
import { OtherTax } from "../controllers/admin/other-tax.controller";
import { AnnualTax } from "../controllers/admin/annual-tax.controller";
import { GhasaraDar } from "../controllers/admin/ghasara-dar.controller";
import { BharankDar } from "../controllers/admin/bharank-dar.controller";
import { Tower } from "../controllers/admin/tower.controller";

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
        this.router.get('/get-district/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.getDistrict);

        this.router.get('/get-taluka/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.getTaluka);

        this.router.get('/get-gram-panchayat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.getGramPanchayat);

        this.router.get('/get-gat-gram-panchayat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.getGatGramPanchayat);

        this.router.get('/milkat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Milkat.getMilkat);
        this.router.get('/milkat-vapar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MilkatVapar.getMilkatVapar);
        this.router.get('/member/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.getMember);

        this.router.get('/get-dashboard-data/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, DashboardUpload.getUploadData);

        // floor
        this.router.get('/floor/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.getFloor);

        // prakar
        this.router.get('/prakar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Prakar.getPrakar);

        // Tax
        this.router.get('/tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tax.getTax);

        // Other Tax
        this.router.get('/get-other-tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OtherTax.getOtherTax);

        // Annual Tax
        this.router.get('/get-annual-tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.getAnnualTax);
        this.router.get('/get-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.getOpenPlotInfoById);

        // ghasara dar routes
        this.router.get('/ghasara-dar-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.getGhasaraDar);

        // Bharank Dar routes
        this.router.get('/bharank-dar-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.getBharankDar);

        // Tower routes
        this.router.get('/tower-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.getTower);
    }

    postRoutes() {
        this.router.post('/district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.addDistrict);
        this.router.post('/district-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.getDistrictList);

        this.router.post('/taluka', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.addTaluka);
        this.router.post('/taluka-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.getTalukatList);

        this.router.post('/gram-panchayat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.addGramPanchayat);
        this.router.post('/gram-panchayat-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.getGramPanchayatList);

        this.router.post('/gat-gram-panchayat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.addGatGramPanchayat);
        this.router.post('/gat-gram-panchayat-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.getGatGramPanchayatList);

        // for dropdown list
        this.router.post('/district-list-ddl', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.getAllDistrictDDL);
        this.router.post('/taluka-list-by-district-id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.getTalukaByDistrict);  // On district selection taluka list shown
        this.router.post('/panchayat-list-by-taluka-id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.getGrampanchayatByTalukaId);  // On taluka selection grampanchayat list shown
        this.router.post('/gat-gram-panchayat-list-by-panchayat-id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.getGatGrampanchayatByPanchayatId);  // On grampanchayat selection gatgrampanchayat list shown

        this.router.post('/milkat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Milkat.addMilkat);
        this.router.post('/get-milkat-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Milkat.getAllMilkat);

        this.router.post('/milkat-vapar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MilkatVapar.addMilkatVapar);
        this.router.post('/get-milkat-vapar-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MilkatVapar.getAllMilkatVaper);

        this.router.post('/add-member', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.createMember);
        this.router.post('/get-member-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.getMembersList);

        this.router.post('/add-dashboard-data', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, DashboardUpload.addUploadData);
        this.router.post('/get-dashboard-data-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, DashboardUpload.getAllUploadData);

        // floor
        this.router.post('/floor', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.addFloor);
        this.router.post('/get-floor-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.getAllFloor);

        // prakar
        this.router.post('/prakar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Prakar.addPrakar);
        this.router.post('/get-prakar-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Prakar.getAllPrakar);

        // Tax
        this.router.post('/tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tax.addTax);
        this.router.post('/get-tax-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tax.getAllTax);

        // Other Tax
        this.router.post('/add-other-tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OtherTax.addOtherTax);
        this.router.post('/get-other-tax-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OtherTax.getAllOtherTax);

        // Annual tax
        this.router.post('/add-annual-tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.addAnnualTax);
        this.router.post('/get-annual-tax-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.getAllAnnualTax);

        this.router.post('/add-open-plot-info', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.createOpenPlotInfo);
        this.router.post('/get-open-plot-info-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.getOpenPlotInfoList);

        // ghasara dar routes
        this.router.post('/add-ghasara-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.addGhasaraDar);
        this.router.post('/get-ghasara-dar-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.getAllGhasaraDar);

        // Bharank Dar routes
        this.router.post('/add-bharank-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.addBharankDar);
        this.router.post('/get-bharank-dar-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.getAllBharankDar);

        // Tower routes
        this.router.post('/add-tower', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.addTower);
        this.router.post('/get-tower-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.getAllTower);

        this.router.post('/sign-in', GlobalMiddleware.checkError, AuthController.authenticate);


    }

    deleteRoute() {
        this.router.delete('/district/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.deleteDistrict);

        this.router.delete('/taluka/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.deleteTaluka);

        this.router.delete('/gram-panchayat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.deleteGramPanchayat);

        this.router.delete('/gat-gram-panchayat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.deleteGatGramPanchayat);

        this.router.delete('/delete-milkat/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Milkat.deleteMilkat);
        this.router.delete('/delete-milkat-vapar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MilkatVapar.deleteMilkatVapar);
        this.router.delete('/delete-member/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.deleteMember);
        this.router.delete('/delete-dashboard-data/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, DashboardUpload.deleteUploadData);

        // floor
        this.router.delete('/delete-floor/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.deleteFloor);

        // prakar
        this.router.delete('/delete-prakar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Prakar.deletePrakar);

        // Tax
        this.router.delete('/delete-tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tax.deleteTax);

        // Other Tax
        this.router.delete('/delete-other-tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OtherTax.deleteOtherTax);

        // Annual Tax
        this.router.delete('/delete-annual-tax/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.deleteAnnualTax);

        this.router.delete('/delete-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.deleteOpenPlotInfo);

        // ghasara dar routes
        this.router.delete('/delete-ghasara-dar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.deleteGhasaraDar);

        // Bharank Dar routes
        this.router.delete('/delete-bharank-dar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.deleteBharankDar);

        // Tower routes
        this.router.delete('/delete-tower/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.deleteTower);

    }
    putRoute() {
        this.router.put('/update-district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, district.updateDistrict);
        this.router.put('/update-taluka', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taluka.updateTaluka);
        this.router.put('/update-gram-panchayat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.updateGramPanchayat);
        this.router.put('/update-gat-gram-panchayat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, gatgrampanchayat.updateGatGramPanchayat);

        this.router.put('/update-milkat', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Milkat.updateMilkatInfo);
        this.router.put('/update-milkat-vapar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MilkatVapar.updateMilkatVaparInfo);
        this.router.put('/update-member/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.updateMember);
        this.router.put('/update-dashboard-data/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, DashboardUpload.updateUploadDataInfo);

        // floor
        this.router.put('/update-floor', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.updateFloorInfo);

        // prakar
        this.router.put('/update-prakar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Prakar.updatePrakarInfo);

        // Tax
        this.router.put('/update-tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tax.updateTaxInfo);

        // Other Tax
        this.router.put('/update-other-tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OtherTax.updateOtherTaxInfo);

        // Annual Tax
        this.router.put('/update-annual-tax', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.updateAnnualTaxInfo);
        this.router.put('/update-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.updateOpenPlotInfo);

        // ghasara dar routes
        this.router.put('/update-ghasara-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.updateGhasaraDarInfo);

        // Bharank Dar routes
        this.router.put('/update-bharank-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.updateBharankDarInfo);

        // Tower routes
        this.router.put('/update-tower', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.updateTowerInfo);

    }
}


export default new adminRoutes().router;