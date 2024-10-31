
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createTower, getTotalTowerCount, getTowerById, getTowerList, softDeleteTower, updateTower } from "../../services/admin/tower.service";

export class Tower {
    static async addTower(req: Request, res: Response) {
        try {
            await createTower(req.body);
            return _201(res, "Tower created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateTowerInfo(req: Request, res: Response) {
        try {
            const { tower_id } = req.body;

            if (!tower_id) {
                return _400(res, "Tower ID is required");
            }
            let isExists = await getTowerById(tower_id);
            if (!isExists) {
                return _404(res, "Tower Details not found.");
            }
            const result = await updateTower(req.body);
            return _200(res, "Tower updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllTower(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getTowerList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalTowerCount(search_text);
            }else{
                response['totalRecords'] = await getTotalTowerCount();
            }
            
            response['data'] = result;
            return _200(res, "Tower list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getTower(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Tower ID is required");
            }
            const result = await getTowerById(Number(id));
            if (!result) {
                return _404(res, "Tower not found");
            }
            response['data'] = result;
            return _200(res,"Tower data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteTower = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Tower ID is required");
            }
            const result = await getTowerById(Number(id));
            if (!result) {
                return _404(res, "Tower not found");
            }
            let response: any = await softDeleteTower(id);
            if (response) {
                return _200(res, "Tower deleted successfully");
            } else {
                return _400(res, "Tower not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





