
import { logger } from "../../logger/Logger";
import { Request, response, Response } from "express";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { createFloor, getFloorById, getFloorList, getTotalFloorCount, softDeleteFloor, updateFloor } from "../../services/admin/floor.service";

export class Floor {
    static async addFloor(req: Request, res: Response) {
        try {
            await createFloor(req.body);
            return _201(res, "Floor created successfully");
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async updateFloorInfo(req: Request, res: Response) {
        try {
            const { floor_id } = req.body;

            if (!floor_id) {
                return _400(res, "Floor ID is required");
            }
            let isExists = await getFloorById(floor_id);
            if (!isExists) {
                return _404(res, "Floor Details not found.");
            }
            const result = await updateFloor(req.body);
            return _200(res, "Floor updated successfully", result);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getAllFloor(req: Request, res: Response) {
        try {
            let response = [];
            const { page_number, search_text } = req.body;

            const result = await getFloorList(Number(page_number - 1), search_text as string);
            if(search_text){
                response['totalRecords'] = await getTotalFloorCount(search_text);
            }else{
                response['totalRecords'] = await getTotalFloorCount();
            }
            
            response['data'] = result;
            return _200(res, "Floor list retrieved successfully", response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async getFloor(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Floor ID is required");
            }
            const result = await getFloorById(Number(id));
            if (!result) {
                return _404(res, "Floor not found");
            }
            response['data'] = result;
            return _200(res,"Floor data fetch successfully",response);
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static deleteFloor = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) {
                return _400(res, "Floor ID is required");
            }
            const result = await getFloorById(Number(id));
            if (!result) {
                return _404(res, "Floor not found");
            }
            let response: any = await softDeleteFloor(id);
            if (response) {
                return _200(res, "Floor deleted successfully");
            } else {
                return _400(res, "Floor not deleted,Something went wrong.");
            }
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

}





