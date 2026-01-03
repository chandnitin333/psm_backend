import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { _200, _201, _400 } from "../../utils/ApiResponse";

import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
import { deleteKhaliBhukhand, deleteKhulaBhukhandBySession, deleteManoraKarAkaraniRecord, delete_buildingKarAkarniSession, delete_manoraKarBySession, deletebandkamKarAkkarniRecord, getAnnualRateAkarniDar, getBhandkamModalData, getBharankDar_buildingModal, getBharankFromMalmattecheDDL, getBuildingAnnuRateAndAkaranidar, getKhulabhukhandModalData, getManoraKarAkaraniRecortds, getYearIdAndYearName, get_AllWardNoList, get_buildingKar_MalmattechePrakar, get_buildingKar_MalmattecheVarnan, get_buildingKar_bandkamachaMajla, get_khulaBhukhandKar_Gavthan, get_khulaBhukhandKar_MalmattechePrakar, get_monoraKar_MalmattechePrakar, get_monoraKar_MalmattecheVarnan, get_monoraKar_ManoracheBhag, openConstructionTaxAssessment, otherTaxCalculation, saveBandhKam, saveKhaliBhuKhand, saveNondni, saveTaxPayers, taxAssessmentForConstruction, taxAssessmentForTowers, updateBandkamModalRecords, updateKhaliBhukhand, updateManoraKarAkaraniRecords, updateNodniForm, checkAnnuKramankExists, checkWardNumberExists } from "../../services/admin/nodni.service";
import { getConstructionBynew_userid, getManoraBynew_userid, getTaxationBynew_userid } from "../../services/main/customer.service";

// फेरफार यादी (Ferfar Yadi) Module API     
export class Nodni {

    static getOpenConstructionTaxAssessment = async (req: Request, res: Response) => {
        try {

            const data: any = await openConstructionTaxAssessment(req.body);
            return _200(res, "From openConstructionTaxAssessment successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching From years list", error);
            return _400(res, "Error fetching From years list");
        }
    }
    static getTaxAssessmentForConstruction = async (req: Request, res: Response) => {
        try {
            const anu_details: any = await taxAssessmentForConstruction(req.body);
            return _201(res, "taxAssessmentForConstructionfetch successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }


    static getTaxAssessmentForTowers = async (req: Request, res: Response) => {
        try {
            const anu_details: any = await taxAssessmentForTowers(req.body);
            return _201(res, "taxAssessmentForTowers successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }
    static getOtherTaxCalculation = async (req: Request, res: Response) => {
        try {
            console.log("Request body for otherTaxCalculation:", req.body);
            const anu_details: any = await otherTaxCalculation(req.body);
            return _201(res, "taxAssessmentForTowers successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error taxAssessmentForTowers", error);
            return _400(res, "Error taxAssessmentForTowers");
        }
    }

    static saveNondniFrom = async (req: Request, res: Response) => {
        try {

            const anu_details: any = await saveNondni(req.body);
            console.log("anu_details:", anu_details);
            if(!anu_details || anu_details.status === 200) {
                return _201(res, anu_details.message, { status: 201, data: anu_details });
            }else if(!anu_details && anu_details.status === 409) {
                return _400(res, anu_details.message);
            }
            else{
                return _400(res, anu_details.message);
            }
        } catch (error) {
            logger.error("Error saveNondniFrom ::", error);
            return _400(res, "Error saveNondniFrom");
        }
    }
    // 
    static async updateNondniFrom( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Khula Bhukhand
            const data: any = await updateNodniForm(updatedData, id );
            return _200(res, "Nodni form updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating Nodni form", error);
            return _400(res, "Error updating Nodni form");
        }
    }

    static saveKhaliBhuKhand = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveKhaliBhuKhand(req.body,'taxationland_temp');
            return _201(res, "Khali Bhu Khand successfully added",anu_details);
        } catch (error) {
            logger.error("Error saveKhaliBhuKhand ::", error);
            return _400(res, "Error saveKhaliBhuKhand");
        }
    }
    static saveKhaliBhuKhandFromOriginalTable = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveKhaliBhuKhand(req.body,'taxationland');
            return _201(res, "Khali Bhu Khand successfully added",anu_details);
        } catch (error) {
            logger.error("Error saveKhaliBhuKhand ::", error);
            return _400(res, "Error saveKhaliBhuKhand");
        }
    }
    static saveBandhKamFrm = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveBandhKam(req.body,'constructiontax_temp');
            return _201(res, "Bandh Kam successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveBandhKam ::", error);
            return _400(res, "Error saveBandhKam");
        }
    }

static saveBandhKamFrmFromOriginalTable = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveBandhKam(req.body,'constructiontax');
            return _201(res, "Bandh Kam successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveBandhKam ::", error);
            return _400(res, "Error saveBandhKam");
        }
    }

    static saveTaxPeryers = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveTaxPayers(req.body,'taxpayers_temp');
            return _201(res, "Tax Payers successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveTaxPayers ::", error);
            return _400(res, "Error saveTaxPayers");
        }
    }
    static saveTaxPeryersFromOriginalTable = async (req: Request, res: Response) => {
        try {
            // if(req.body.annu_kramank == null || req.body.annu_kramank == undefined || req.body.annu_kramank == '' || req.body.vard_number == null || req.body.vard_number == undefined || req.body.vard_number == '') {
            //     return _400(res, "अनु क्रमांक आणि वॉर्ड क्रमांक आवश्यक आहे.");
            // }
            const anu_details: any = await saveTaxPayers(req.body,'taxpayers');
            return _201(res, "Tax Payers successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveTaxPeryers ::", error);
            return _400(res, "Error saveTaxPeryers");
        }
    }

    static async khulaBhukhandKar_MalmattechePrakar( req: Request, res: Response) {
        try {
            const data: any = await get_khulaBhukhandKar_MalmattechePrakar();
            return _200(res, "Khula Bhukhand Kar Malmatteche Prakar List successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching Khula Bhukhand Kar Malmatteche Prakar", error);
            return _400(res, "Error fetching Khula Bhukhand Kar Malmatteche Prakar");
        }
    }
   
    static async khulaBhukhandKar_Gavthan( req: Request, res: Response) {
        try {
            const id = Number(req.params.panchayat_id);
            if (!id) {
                return _400(res, "Invalid or missing panchayat ID");
            }
            const data: any = await get_khulaBhukhandKar_Gavthan(id);
            return _200(res, "खुला भूखंडाची कर गावठाण/गावठाण बाहेरचे List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching Khula Bhukhand Kar Gavthan", error);
            return _400(res, "Error fetching Khula Bhukhand Kar Gavthan");
        }
    }

    static async buildingKar_MalmattechePrakar( req: Request, res: Response) {
        try {
            const data: any = await get_buildingKar_MalmattechePrakar();
            return _200(res, "Building Kar Malmatteche Prakar List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching Building Kar Malmatteche Prakar", error);
            return _400(res, "Error fetching Building Kar Malmatteche Prakar");
        }
    }

    static async buildingKar_MalmattecheVarnan( req: Request, res: Response) {
        try {
            const data: any = await get_buildingKar_MalmattecheVarnan();
            return _200(res, "बिल्डिंग कर आकारणी मालमत्तेचे वर्णन List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching बिल्डिंग कर आकारणी मालमत्तेचे वर्णन", error);
            return _400(res, "Error fetching बिल्डिंग कर आकारणी मालमत्तेचे वर्णन");
        }
    }

    static async buildingKar_bandkamachaMajla( req: Request, res: Response) {
        try {
            const data: any = await get_buildingKar_bandkamachaMajla();
            return _200(res, "बिल्डिंग कर आकारणी बांधकामाचा मजला List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching बिल्डिंग कर आकारणी बांधकामाचा मजला", error);
            return _400(res, "Error fetching बिल्डिंग कर आकारणी बांधकामाचा मजला");
        }
    }

    static async monoraKar_MalmattechePrakar( req: Request, res: Response) {
        try {
            const data: any = await get_monoraKar_MalmattechePrakar();
            return _200(res, "मनोरा कर आकारणी मालमत्तेचे प्रकार List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी मालमत्तेचे प्रकार", error);
            return _400(res, "Error fetching मनोरा कर आकारणी मालमत्तेचे प्रकार");
        }
    }

    static async monoraKar_MalmattecheVarnan( req: Request, res: Response) {
        try {
            const data: any = await get_monoraKar_MalmattecheVarnan();
            return _200(res, "मनोरा कर आकारणी मालमत्तेचे वर्णन List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी मालमत्तेचे वर्णन", error);
            return _400(res, "Error fetching मनोरा कर आकारणी मालमत्तेचे वर्णन");
        }
    }

    static async monoraKar_ManoracheBhag( req: Request, res: Response) {
        try {
            const data: any = await get_monoraKar_ManoracheBhag();
            return _200(res, "मनोरा कर आकारणी मनोऱ्याचे भाग List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी मनोऱ्याचे भाग", error);
            return _400(res, "Error fetching मनोरा कर आकारणी मनोऱ्याचे भाग");
        }
    }

    static async getAllWardNoList( req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            console.log("Decoded User:", decoded_user);
            const data: any = await get_AllWardNoList(Number(decoded_user['userId']));
            return _200(res, "वार्ड नं. List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching वार्ड नं.", error);
            return _400(res, "Error fetching वार्ड नं.");
        }
    }
    static async getJaminicheVarshikMulyAndAkarniRate( req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const district_id = Number(decoded_user['DISTRICT_ID']);
            const taluka_id = Number(decoded_user['TALUKA_ID']);
            const panchayat_id = Number(decoded_user['PANCHAYAT_ID']);

            const id = Number(req.params.id);
            const data: any = await getAnnualRateAkarniDar(id, district_id, taluka_id, panchayat_id);
            return _200(res, "जमिनीचे वार्षिक मूल्य आणि आकारणी दर List fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching जमिनीचे वार्षिक मूल्य आणि आकारणी दर", error);
            return _400(res, "Error fetching जमिनीचे वार्षिक मूल्य आणि आकारणी दर");
        }
    }
    static async getYearIdAndYearName(req: Request, res: Response) {
        try {
            const data: any = await getYearIdAndYearName(); // Assuming this function exists in your service
            return _200(res, "Year ID and Year Name fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching Year ID and Year Name", error);
            return _400(res, "Error fetching Year ID and Year Name");
        }
    }

    static async getBharankFromMalmattechDDLSelect( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data: any = await getBharankFromMalmattecheDDL(id);
            return _200(res, "भारांक value fetch successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching भारांक", error);
            return _400(res, "Error fetching भारांक");
        }
    }

    static async getBuildingAnnualRateAkaraniDar( req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            const district_id = Number(decoded_user['DISTRICT_ID']);
            const malmatta_id = Number(req.params.malmatta_id);
            const milkat_vapar_id = Number(req.params.milkat_vapar_id);
            const data: any = await getBuildingAnnuRateAndAkaranidar(malmatta_id,milkat_vapar_id, district_id);
            return _200(res, "इमारतीचे वार्षिक मुल्य and आकारणी दर value fetch successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching इमारतीचे वार्षिक मुल्य and आकारणी दर", error);
            return _400(res, "Error fetching इमारतीचे वार्षिक मुल्य and आकारणी दर");
        }
    }
    static async getGhasaraDarBuildingModal( req: Request, res: Response) {
        try {
            const malmatta_varnan_id = Number(req.params.malmatta_varnan_id);
            const vayoman = Number(req.params.vayoman);
            const data: any = await getBharankDar_buildingModal(malmatta_varnan_id,vayoman);
            return _200(res, "घसारा दर value fetch successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching घसारा दर", error);
            return _400(res, "Error fetching घसारा दर");
        }
    }
    // taxationland_temp
    static async editKhulaBhukhand_modal( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const data: any = await getKhulabhukhandModalData(id,'taxationland_temp');
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार List fetched successfully",  {data: data} );
        } catch (error) {
            logger.error("Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    
    static async getKhulaBhukhandRecordFromoriginalTable( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const taxationData: any = await getTaxationBynew_userid(Number(id));
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार List fetched successfully",  {data: taxationData} );
        } catch (error) {
            logger.error("Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    static async editKhulaBhukhand_modal_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const data: any = await getKhulabhukhandModalData(id,'taxationland');
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार List fetched successfully",  {data: data} );
        } catch (error) {
            logger.error("Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error fetching खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    static async updateKhulaBhukhand( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Khula Bhukhand
            const data: any = await updateKhaliBhukhand(updatedData, id,'taxationland_temp' );
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error updating खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    
    static async updateKhulaBhukhand_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Khula Bhukhand
            const data: any = await updateKhaliBhukhand(updatedData, id,'taxationland' );
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error updating खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    static async deleteKhulaBhukhandModal( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Khula Bhukhand
            const data: any = await deleteKhaliBhukhand(id,'taxationland_temp');
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार deleted successfully");
        } catch (error) {
            logger.error("Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    
    static async deleteKhulaBhukhandModal_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Khula Bhukhand
            const data: any = await deleteKhaliBhukhand(id,'taxationland');
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार deleted successfully", data);
        } catch (error) {
            logger.error("Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    static async editbandkamkarAakaraniModal( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const data: any = await getBhandkamModalData(id,'constructiontax_temp');
            return _200(res, "बांधकाम कर आकारणी modal data fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching बांधकाम कर आकारणी modal data", error);
            return _400(res, "Error fetching बांधकाम कर आकारणी modal data");
        }
    }
    static async getbandkamkarAakaraniModalFromOriginalTable( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const constructionData: any = await getConstructionBynew_userid(Number(id));
            return _200(res, "बांधकाम कर आकारणी modal data fetched successfully", { status: 200, data: constructionData });
        } catch (error) {
            logger.error("Error fetching बांधकाम कर आकारणी modal data", error);
            return _400(res, "Error fetching बांधकाम कर आकारणी modal data");
        }
    }

static async editbandkamkarAakaraniModal_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const data: any = await getBhandkamModalData(id,'constructiontax');
            return _200(res, "बांधकाम कर आकारणी modal data fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching बांधकाम कर आकारणी modal data", error);
            return _400(res, "Error fetching बांधकाम कर आकारणी modal data");
        }
    }
    static async updateBandhKam( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Bandh Kam
            const data: any = await updateBandkamModalRecords(updatedData, id,'constructiontax_temp');
            return _200(res, "बांधकाम कर आकारणी updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating बांधकाम कर आकारणी", error);
            return _400(res, "Error updating बांधकाम कर आकारणी");
        }
    }
    static async updateBandhKamFromOriginalTable( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Bandh Kam
            const data: any = await updateBandkamModalRecords(updatedData, id,'constructiontax');
            return _200(res, "बांधकाम कर आकारणी updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating बांधकाम कर आकारणी", error);
            return _400(res, "Error updating बांधकाम कर आकारणी");
        }
    }

    static async deleteBandhKamModal( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Bandh Kam
            const data: any = await deletebandkamKarAkkarniRecord(id,'constructiontax_temp');
            return _200(res, "बांधकाम कर आकारणी deleted successfully");
        } catch (error) {
            logger.error("Error deleting बांधकाम कर आकारणी", error);
            return _400(res, "Error deleting बांधकाम कर आकारणी");
        }
    }

static async deleteBandhKamModal_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Bandh Kam
            const data: any = await deletebandkamKarAkkarniRecord(id,'constructiontax');
            return _200(res, "बांधकाम कर आकारणी deleted successfully", data);
        } catch (error) {
            logger.error("Error deleting बांधकाम कर आकारणी", error);
            return _400(res, "Error deleting बांधकाम कर आकारणी");
        }
    }
    static async editManoraKarAkarniModal( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to get the Manora Kar Akarni modal data
            const data: any = await getManoraKarAkaraniRecortds(id,'taxpayers_temp');
            return _200(res, "मनोरा कर आकारणी modal data fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी modal data", error);
            return _400(res, "Error fetching मनोरा कर आकारणी modal data");
        }
    }
    
    static async getManoraKarAkarniModalFromOriginalTable( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const manoraData: any = await getManoraBynew_userid(Number(id));
            return _200(res, "मनोरा कर आकारणी modal data fetched successfully", { status: 200, data: manoraData });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी modal data", error);
            return _400(res, "Error fetching मनोरा कर आकारणी modal data");
        }
    }
    static async editManoraKarAkarniModal_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to get the Manora Kar Akarni modal data
            const data: any = await getManoraKarAkaraniRecortds(id,'taxpayers');
            return _200(res, "मनोरा कर आकारणी modal data fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching मनोरा कर आकारणी modal data", error);
            return _400(res, "Error fetching मनोरा कर आकारणी modal data");
        }
    }
    static async updateManoraKarAkaraniData( req: Request, res: Response) { 
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Manora Kar Akarani data
            const data: any = await updateManoraKarAkaraniRecords(updatedData, id,'taxpayers_temp');
            return _200(res, "मनोरा कर आकारणी updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating मनोरा कर आकारणी", error);
            return _400(res, "Error updating मनोरा कर आकारणी");
        }
    }
    static async updateManoraKarAkaraniDataFromOriginaltable( req: Request, res: Response) { 
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            const updatedData = req.body;
            // Assuming there's a service function to update the Manora Kar Akarani data
            const data: any = await updateManoraKarAkaraniRecords(updatedData, id,'taxpayers');
            return _200(res, "मनोरा कर आकारणी updated successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error updating मनोरा कर आकारणी", error);
            return _400(res, "Error updating मनोरा कर आकारणी");
        }
    }
    
    static async deleteManoraKarAkaraniRecord( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Manora Kar Akarani record
            const data: any = await deleteManoraKarAkaraniRecord(id,'taxpayers_temp');
            return _200(res, "मनोरा कर आकारणी deleted successfully");
        } catch (error) {
            logger.error("Error deleting मनोरा कर आकारणी", error);
            return _400(res, "Error deleting मनोरा कर आकारणी");
        }
    }
    
    static async deleteManoraKarAkaraniRecord_original_table( req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing ID");
            }
            // Assuming there's a service function to delete the Manora Kar Akarani record
            const data: any = await deleteManoraKarAkaraniRecord(id,'taxpayers');
            return _200(res, "मनोरा कर आकारणी deleted successfully", data);
        } catch (error) {
            logger.error("Error deleting मनोरा कर आकारणी", error);
            return _400(res, "Error deleting मनोरा कर आकारणी");
        }
    }
    static async delete_khulabhukahnd_by_session_wise( req: Request, res: Response) {
        try {
            const payload = req.body;
            // Assuming there's a service function to delete the Khula Bhukhand by session
            const data: any = await deleteKhulaBhukhandBySession(payload);
            return _200(res, "खुला भूखंडाची कर मालमत्तेचे प्रकार deleted successfully");
        } catch (error) {
            logger.error("Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार", error);
            return _400(res, "Error deleting खुला भूखंडाची कर मालमत्तेचे प्रकार");
        }
    }
    static async delete_buildingKarKarano_by_session_wise( req: Request, res: Response) {
        try {
            const payload = req.body;
            // Assuming there's a service function to delete the Building Kar by session
            const data: any = await delete_buildingKarAkarniSession(payload);
            return _200(res, "बिल्डिंग कर आकारणी deleted successfully");
        } catch (error) {
            logger.error("Error deleting बिल्डिंग कर आकारणी", error);
            return _400(res, "Error deleting बिल्डिंग कर आकारणी");
        }
    }
    static async delete_manoraKarAkarani_by_session_wise( req: Request, res: Response) {
        try {
            const payload = req.body;
            // Assuming there's a service function to delete the Manora Kar Akarani by session
            const data: any = await delete_manoraKarBySession(payload);
            return _200(res, "मनोरा कर आकारणी deleted successfully");
        } catch (error) {
            logger.error("Error deleting मनोरा कर आकारणी", error);
            return _400(res, "Error deleting मनोरा कर आकारणी");
        }
    }

    // Check if अनु क्रमांक already exists for the user
    static async checkAnnuKramankExists(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            const payload = {
                annu_kramank: req.body.annu_kramank,
                user_id: Number(decoded_user['userId'])
            };
            // console.log("kundan-----", Number(decoded_user['userId']))

            const result: any = await checkAnnuKramankExists(payload);
            return _200(res, result.message, { status: 200, data: result });
        } catch (error) {
            logger.error("Error checking अनु क्रमांक existence", error);
            return _400(res, "Error checking अनु क्रमांक existence");
        }
    }

    // Check if वॉर्ड क्रमांक already exists for the user
    static async checkWardNumberExists(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);

            const payload = {
                ward_number: req.body.ward_number,
                annu_kramank: req.body.annu_kramank,
                user_id: Number(decoded_user['userId'])
            };

            const result: any = await checkWardNumberExists(payload);
            return _200(res, result.message, { status: 200, data: result });
        } catch (error) {
            logger.error("Error checking वॉर्ड क्रमांक existence", error);
            return _400(res, "Error checking वॉर्ड क्रमांक existence");
        }
    }
}

