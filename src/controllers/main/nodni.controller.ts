import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { _200, _201, _400 } from "../../utils/ApiResponse";

import { openConstructionTaxAssessment, otherTaxCalculation, saveBandhKam, saveKhaliBhuKhand, saveNondni, saveTaxPayers, taxAssessmentForConstruction, taxAssessmentForTowers } from "../../services/admin/nodni.service";


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
            return _201(res, "Nodani  successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveNondniFrom ::", error);
            return _400(res, "Error saveNondniFrom");
        }
    }

    static saveKhaliBhuKhand = async (req: Request, res: Response) => {
        try {
            const anu_details: any = await saveKhaliBhuKhand(req.body);
            return _201(res, "Khali Bhu Khand successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveKhaliBhuKhand ::", error);
            return _400(res, "Error saveKhaliBhuKhand");
        }
    }
    static saveBandhKamFrm = async (req: Request, res: Response) => {
        try {
            const anu_details: any = await saveBandhKam(req.body);
            return _201(res, "Bandh Kam successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveBandhKam ::", error);
            return _400(res, "Error saveBandhKam");
        }
    }



    static saveTaxPeryers = async (req: Request, res: Response) => {
        try {
            const anu_details: any = await saveTaxPayers(req.body);
            return _201(res, "Tax Payers successfully added", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error saveTaxPeryers ::", error);
            return _400(res, "Error saveTaxPeryers");
        }
    }
   
}

