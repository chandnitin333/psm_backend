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

        this.router.get('/get-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.getOpenPlotInfoById);
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


        this.router.post('/add-open-plot-info', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.createOpenPlotInfo);
        this.router.post('/get-open-plot-info-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.getOpenPlotInfoList);



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

        this.router.delete('/delete-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.deleteOpenPlotInfo);



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

        this.router.put('/update-open-plot-info/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, OpenPlotController.updateOpenPlotInfo);

    }
}


export default new adminRoutes().router;