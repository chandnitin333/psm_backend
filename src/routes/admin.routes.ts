import { Router } from "express";
import { AuthController } from "../controllers/admin/auth.controller";
import { DashboardUpload } from "../controllers/admin/dashboard-upload.controller";
import { district } from "../controllers/admin/district.controller";
import { Floor } from "../controllers/admin/floor.controller";
import { gatgrampanchayat } from "../controllers/admin/gatgrampanchayat.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";
import { Memeber } from "../controllers/admin/member.controller";
import { MilkatVapar } from "../controllers/admin/milkat-vapar.controller";
import { Milkat } from "../controllers/admin/milkat.controller";
import { OpenPlotController } from "../controllers/admin/openplot.controller";
import { OtherTax } from "../controllers/admin/other-tax.controller";
import { Prakar } from "../controllers/admin/prakar.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { Tax } from "../controllers/admin/tax.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";

import { AnnualTax } from "../controllers/admin/annual-tax.controller";
import { BDOUser } from "../controllers/admin/bdo-user.controller";
import { BharankDar } from "../controllers/admin/bharank-dar.controller";
import { GhasaraDar } from "../controllers/admin/ghasara-dar.controller";
import { KaryaKarniCommitee } from "../controllers/admin/karyakarni-commitee.controller";
import { Malmatta } from "../controllers/admin/malmatta.controller";
import { MalmattechePrakar } from "../controllers/admin/malmatteche-prakar.controller";
import { Tower } from "../controllers/admin/tower.controller";
import { UploadFile } from "../controllers/admin/upload-file.controller";
import { User } from "../controllers/admin/user.controller";


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

        // Malamatteche Prakar
        this.router.get('/get-malmatteche-prakar-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.getMalmattechePrakar);

        // Malmatta routes
        this.router.get('/get-malmatta-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.getMalmatta);

        // Karyakanri Committee
        this.router.get('/get-karyakarni-commitee-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.getKaryaKarniCommitee);

        // Upload File
        this.router.get('/get-upload-file/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UploadFile.getUploadFile);

        // BDO User
        this.router.get('/get-bdo-user-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BDOUser.getBDOUser);
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

        this.router.get('/get-user-district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.getUserDistrict);

        this.router.get('/get-panchayat-users', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Memeber.getPanchayatUsers);
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
        this.router.post('/malmatta-list-ddl',GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.getAllMalmattaDDL)
        this.router.post('/age-of-buildings-ddl',GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Floor.getAllBuildingAgeDDL)
        this.router.post('/panchayat-list-ddl',GlobalMiddleware.checkError, GlobalMiddleware.authenticate, grampanchayat.getAllgrampanchayatDDL)
        this.router.post('/designation-list-ddl',GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.getAllDesignationDDL)

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
        this.router.post('/get-annual-tax-list-by-district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.getAllAnnualTaxByDistrict);
        this.router.post('/get-annual-get-district', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AnnualTax.getDistrictData);




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

        // Malamatteche Prakar
        this.router.post('/add-malmatteche-prakar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.addMalmattechePrakar);
        this.router.post('/get-malmatteche-prakar-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.getAllMalmattechePrakar);
        this.router.post('/get-malmatteche-prakar-all-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.getAllMalmattechePrakarDDL);

        // Malmatta routes
        this.router.post('/add-malmatta', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.addMalmatta);
        this.router.post('/get-malmatta-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.getAllMalmatta);

        // Karyakanri Committee
        this.router.post('/add-karyakarni-commitee', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.addKaryaKarniCommitee);
        this.router.post('/get-karyakarni-commitee-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.getAllKaryaKarniCommitee);

        // Upload File
        this.router.post('/add-upload-file', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UploadFile.addUploadFile);
        this.router.post('/get-upload-file-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UploadFile.getAllUploadFile);

        // BDO User Route
        this.router.post('/add-bdo-user', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BDOUser.addBDOUser);
        this.router.post('/get-bdo-user-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BDOUser.getAllBDOUser);
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

        // users routes
        this.router.post('/add-new-user', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.addNewUser);
        this.router.post('/get-all-user-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.getAllUser);
        this.router.post('/get-user-by-id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.getUser);


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

        this.router.delete('/delete-ghasara-dar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.deleteGhasaraDar);

        // Bharank Dar routes
        this.router.delete('/delete-bharank-dar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.deleteBharankDar);

        // Tower routes
        this.router.delete('/delete-tower/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.deleteTower);

        // Malamatteche Prakar
        this.router.delete('/delete-malmatteche-prakar/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.deleteMalmattechePrakar);

        // Malmatta routes
        this.router.delete('/delete-malmatta/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.deleteMalmatta);

        // Karyakanri Committee
        this.router.delete('/delete-karyakarni-commitee/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.deleteKaryaKarniCommitee);

        // Upload File
        this.router.delete('/delete-upload-file/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UploadFile.deleteUploadFile);

        // BDO User Route
        this.router.delete('/delete-bdo-user/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BDOUser.deleteBDOUser);

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

        // Malamatteche Prakar
        this.router.put('/update-malmatteche-prakar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalmattechePrakar.updateMalmattechePrakarInfo);

        // Malmatta routes
        this.router.put('/update-malmatta', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Malmatta.updateMalmattaInfo);

        // Karyakanri Committee
        this.router.put('/update-karyakarni-commitee', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, KaryaKarniCommitee.updateKaryaKarniCommiteeInfo);

        // Upload File
        this.router.put('/update-upload-file/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, UploadFile.updateUploadDataInfo);

        // BDO User Route
        this.router.put('/update-bdo-user', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BDOUser.updateBDOUserInfo);

        this.router.put('/update-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.updateOpenPlotInfo);


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

        // ghasara dar routes
        this.router.put('/update-ghasara-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, GhasaraDar.updateGhasaraDarInfo);

        // Bharank Dar routes
        this.router.put('/update-bharank-dar', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, BharankDar.updateBharankDarInfo);

        // Tower routes
        this.router.put('/update-tower', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Tower.updateTowerInfo);

        //User routes
        this.router.put('/update-user', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.updateUserInfo);
        this.router.put('/delete-user-by-id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, User.deleteUser);

    }
}


export default new adminRoutes().router;