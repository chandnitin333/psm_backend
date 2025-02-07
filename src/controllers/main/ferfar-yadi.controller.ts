import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { addNewFerfarYadiFormInfo, getAnnuKramank, getYearList } from "../../services/main/ferfar-yadi.service";
import { Utils } from "../../utils/util";


// फेरफार यादी (Ferfar Yadi) Module API     
export class FerFarYadi {
   static async getYearList(req: Request, res: Response) {
        try {
            const data: any = await getYearList();
            return _200(res, "From years list fetched successfully", { status: 200, data: data });
        } catch (error) {
            logger.error("Error fetching From years list", error);
            return _400(res, "Error fetching From years list");
        }
   }

   static async getAnnuKramankFerfarYadi(req: Request, res: Response) {
       

        try {
            const anu_details: any = await getAnnuKramank(req.body);
            return _201(res, "Annu Kramank fetch successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }

    static async createNewFerfarYadiInfo(req: Request, res: Response) {
        try {
            const member: any = await addNewFerfarYadiFormInfo(req.body);
            return _201(res, "Successfully added new ferfar yadi in malmatta ferfar form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta ferfar form", error);
            return _400(res, "Error creating new customer in malmatta ferfar form");
        }
    }

}

