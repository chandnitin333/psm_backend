import { Router } from "express";
import { district } from "../controllers/admin/district.controller";
import { Floor } from "../controllers/admin/floor.controller";
import { gatgrampanchayat } from "../controllers/admin/gatgrampanchayat.controller";
import { grampanchayat } from "../controllers/admin/grampanchayat.controller";
import { KaryaKarniCommitee } from "../controllers/admin/karyakarni-commitee.controller";
import { Malmatta } from "../controllers/admin/malmatta.controller";
import { taluka } from "../controllers/admin/taluka.controller";
import { AdharWardList } from "../controllers/main/adhar-ward-list.controller";
import { AuthController } from "../controllers/main/auth.controller";
import { CustomerController } from "../controllers/main/customer.controller";
import { FerFarYadi } from "../controllers/main/ferfar-yadi.controller";
import { MalamattaGrahakYadiList } from "../controllers/main/malmatta-grahak-yadi.controller";
import { Namuna8Controller } from "../controllers/main/namuna-8.controller";
import { Nodni } from "../controllers/main/nodni.controller";
import { taxGenerationController } from "../controllers/main/tax-generation.controller";
import { vasuliController } from "../controllers/main/vasuli.controller";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { Namuna9Controller } from "../controllers/main/namuna-9.controller";
import { MagnicheBillController } from "../controllers/main/magniche-bill.controller";

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
        this.router.get('/get-ward-wise-adhar-list/:ward_no', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, AdharWardList.get_adhar_list);

        this.router.get('/get-all-year-list', GlobalMiddleware.checkError, FerFarYadi.getYearList);
        this.router.get('/get-all-ward-list', GlobalMiddleware.checkError, AdharWardList.get_ward_number_by_user_id);

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
        this.router.post('/search-customer-in-malmatta-nodni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.searchCustomers);
        this.router.post('/get-annu-kramank-in-malmatta-nodni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.getAnnuKramank);
        this.router.post('/get-malmatta-nodni-list-info', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.getMalmattaNodniInfoList);
        this.router.post('/insert-update-sillak-joda', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.createUpdateSillakJoda);
        this.router.post('/verify-user-for-permission', GlobalMiddleware.checkError, CustomerController.verifyUser);
        this.router.post('/update-customer-image', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, CustomerController.addUploadCustomerimage);

        this.router.post('/add-new-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.createNewFerfarYadiInfo);
        this.router.post('/search-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.searchFerfarYadi);
        this.router.post('/get-annu-kramank-in-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getAnnuKramankFerfarYadi);
        this.router.post('/get-ferfar-yadi-list-info', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getFerfarYadiList);
        this.router.get('/get-ferfar-yadi-by-id/:ferfar_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getFerfarDetailById);
        this.router.put('/update-ferfar-yadi-by-id/:ferfar_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.updateFerfarYadi);
        this.router.put('/delete-ferfar-yadi-by-id/:ferfar_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.deleteFerfarYadi);
        this.router.post('/pdf-ferfar-yadi', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.pdfFerfarYadi);
        this.router.get('/ferfar-namuna-yadi-ddl', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getFerfarNamunaYadiList);
        this.router.get('/ferfar-panchayat-list-ddl', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getPanchayatListOnPanchayatId);
        this.router.put('/delete-ferfar-yadi-pdf-by-id/:pdf_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.deleteFerfarYadiPDF);
        this.router.post('/add-ferfar-yadi-pdf', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.addUploadPDFFerfarData);
        this.router.post('/get-customer-by-annu-id-ward-no', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, FerFarYadi.getcustomerByAnuId_wardNo);


        this.router.post('/get-open-construction-tax-assessment', GlobalMiddleware.checkError, Nodni.getOpenConstructionTaxAssessment);
        this.router.post('/get-tax-assessment-construction', GlobalMiddleware.checkError, Nodni.getTaxAssessmentForConstruction);
        this.router.post('/get-tax-assessment-towers', GlobalMiddleware.checkError, Nodni.getTaxAssessmentForTowers);
        this.router.post('/get-other-tax-calculation', GlobalMiddleware.checkError, Nodni.getOtherTaxCalculation);


        this.router.post('/save-nodni-from', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveNondniFrom);
        this.router.put('/update-nodni-form/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateNondniFrom);        
        this.router.post('/save-khali-bhukhand', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveKhaliBhuKhand);
         this.router.post('/save-khali-bhukhand-insert-in-original-table', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveKhaliBhuKhandFromOriginalTable);
        
        this.router.post('/save-bandh-kam', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveBandhKamFrm);
        this.router.post('/save-bandh-kam-insert-in-original-table', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveBandhKamFrmFromOriginalTable);

        this.router.get('/get-khula-bhukhand-kar-malmatteche-prakar-ddl', GlobalMiddleware.checkError, Nodni.khulaBhukhandKar_MalmattechePrakar);
        this.router.get('/get-khula-bhukhand-kar-gavthan-ddl/:panchayat_id', GlobalMiddleware.checkError, Nodni.khulaBhukhandKar_Gavthan);
        this.router.get('/get-building-kar-malmatteche-prakar-ddl', GlobalMiddleware.checkError, Nodni.buildingKar_MalmattechePrakar);
        this.router.get('/get-building-kar-malmatteche-varnan-ddl', GlobalMiddleware.checkError, Nodni.buildingKar_MalmattecheVarnan);
        this.router.get('/get-building-kar-bandkamacha-majla-ddl', GlobalMiddleware.checkError, Nodni.buildingKar_bandkamachaMajla);
        this.router.get('/get-monora-kar-malmatteche-prakar-ddl', GlobalMiddleware.checkError, Nodni.monoraKar_MalmattechePrakar);
        this.router.get('/get-monora-kar-malmatteche-varnan-ddl', GlobalMiddleware.checkError, Nodni.monoraKar_MalmattecheVarnan);
        this.router.get('/get-monora-kar-manorache-bhag-ddl', GlobalMiddleware.checkError, Nodni.monoraKar_ManoracheBhag);
        this.router.get('/get-all-ward-no-list-ddl', GlobalMiddleware.checkError, Nodni.getAllWardNoList);
        this.router.get('/get-jamin-anual-rate-akarani-dar/:id', GlobalMiddleware.checkError, Nodni.getJaminicheVarshikMulyAndAkarniRate);
        this.router.get('/get-year-id-year-name', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getYearIdAndYearName);
        this.router.get('/get-bharank-from-malmatteche-prakar-select/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getBharankFromMalmattechDDLSelect);
        this.router.get('/get-anual-building-value-aakarani-dar-building-modal/:malmatta_id/:milkat_vapar_id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getBuildingAnnualRateAkaraniDar);
        this.router.get('/get-new-ghasara-dar-building-modal/:malmatta_varnan_id/:vayoman', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getGhasaraDarBuildingModal);

        this.router.get('/edit-khula-bhukhand-modal-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editKhulaBhukhand_modal);
        this.router.put('/update-khula-bhukhand-modal/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateKhulaBhukhand);
        this.router.put('/update-khula-bhukhand-modal-original-table/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateKhulaBhukhand_original_table);
        this.router.delete('/delete-khula-bhukhand-record/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteKhulaBhukhandModal);
        this.router.get('/edit-khula-bhukhand-modal-by-id-original-edit/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editKhulaBhukhand_modal_original_table);
        this.router.delete('/delete-khula-bhukhand-record-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteKhulaBhukhandModal_original_table);
         this.router.get('/get-khula-bhukhand-modal-by-newuserid-from-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getKhulaBhukhandRecordFromoriginalTable);

        this.router.get('/edit-bandkam-kar-aakarni-modal-data/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editbandkamkarAakaraniModal);
        this.router.put('/update-bandkam-kar-aakarani-modal/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateBandhKam);
         this.router.put('/update-bandkam-kar-aakarani-modal-from-original-table/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateBandhKamFromOriginalTable);
        this.router.delete('/delete-bandkam-kar-aakarni-record/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteBandhKamModal);
        this.router.delete('/delete-bandkam-kar-aakarni-record-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteBandhKamModal_original_table);
        this.router.get('/edit-bandkam-kar-aakarni-modal-data-original-edit/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editbandkamkarAakaraniModal_original_table);
        this.router.get('/get-bandkam-kar-aakarni-modal-data-from-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getbandkamkarAakaraniModalFromOriginalTable);
        
        this.router.get('/edit-manora-kar-aakarni-modal-data/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editManoraKarAkarniModal);
        this.router.put('/update-manora-kar-aakarani-modal/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateManoraKarAkaraniData);
        this.router.put('/update-manora-kar-aakarani-modal-from-original-table/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.updateManoraKarAkaraniDataFromOriginaltable);
        this.router.delete('/delete-manora-kar-aakarni-record/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteManoraKarAkaraniRecord);
        this.router.delete('/delete-manora-kar-aakarni-record-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.deleteManoraKarAkaraniRecord_original_table);
        this.router.get('/edit-manora-kar-aakarni-modal-data-original-edit/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.editManoraKarAkarniModal_original_table);
        this.router.get('/get-manora-kar-aakarni-modal-data-from-original/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.getManoraKarAkarniModalFromOriginalTable);

        this.router.post('/delete-khula-bhukhand-session-wise-clear-api', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.delete_khulabhukahnd_by_session_wise);
        this.router.post('/delete-building-kar-session-wise-clear-api', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.delete_buildingKarKarano_by_session_wise);
        this.router.post('/delete-monora-kar-session-wise-clear-api', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.delete_manoraKarAkarani_by_session_wise);

        // manora form
        this.router.post('/save-tax-payer', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveTaxPeryers);
        this.router.post('/save-tax-payer-insert-in-original-table', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Nodni.saveTaxPeryersFromOriginalTable);

        this.router.post('/malmatta-darkachi-yadi-list', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalamattaGrahakYadiList.get_malmatta_darkachi_yadi_list);
        this.router.post('/malmatta-grahak-yadi-khula-bhukhand', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalamattaGrahakYadiList.get_malmatta_grahak_yadi_khula_bhukhand);
        this.router.post('/malmatta-grahak-yadi-ghar-karni', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MalamattaGrahakYadiList.get_malmatta_grahak_yadi_ghar_kar);
        this.router.post('/get-namuna-8-anukramnika', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna8Controller.get_namuna_8_anukramnika);
        this.router.post('/get-namuna-8-vard-new', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna8Controller.get_namuna_8_vard_new);
        this.router.post('/get-namuna-8-1-single-vard', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna8Controller.get_namuna_8_1_single_vard);
        this.router.post('/get-namuna-8-images', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna8Controller.get_namuna_8_1_single_vard_images); // for single and multiple
        this.router.post('/get-namuna-8-ghosvara', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna8Controller.get_namuna_8_ghosvara);
        

        this.router.post('/get-namuna-9-anukramnika', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna9Controller.get_namuna_9_anukramnika);
        // namuna 9
        this.router.post('/get-namuna-9-vard-new', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna9Controller.get_namuna_9_vard_new);
        // namuna 9 new
        this.router.post('/get-namuna-9-new', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna9Controller.get_namuna9_new);
        this.router.post('/get-namuna-9-ghosvara', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna9Controller.get_namuna_9_ghosvara);
        this.router.post('/get-namuna-9-ghosvara-new', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, Namuna9Controller.get_namuna_9_ghosvara_new);

        this.router.post('/search-magniche-bill', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MagnicheBillController.searchMagnicheBill);
        this.router.post('/magniche-bill-129-1', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, MagnicheBillController.getMagnicheBill_129_1_details);
        
        

        this.router.post('/get-tax-generation', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, taxGenerationController.getTaxGeneration);

        this.router.post('/search-customer-vasuli', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.searchVasuliCustomer);
        this.router.post('/save-customer-vasuli', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.savecustonerVasuli);
        this.router.get('/get-customer-vasuli-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.getCustomerVasuliById);
        this.router.put('/update-customer-vasuli-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.getCustomerVasuliUpdateById);
        this.router.delete('/delete-customer-vasuli-by-id/:id', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.getCustomerVasuliDeleteById);
        this.router.post('/get-chalu-kar-data', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.getChaluKArData);
        this.router.post('/get-magil-kar-data', GlobalMiddleware.checkError, GlobalMiddleware.authenticate, vasuliController.getMagilKarData);

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