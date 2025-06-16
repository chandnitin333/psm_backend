import { Request, Response } from "express";
import { logger } from "../../logger/Logger";
import { signIn } from "../../services/admin/users.service";
import { addNewCustomerInNodniFormInfo, countConstructiontax, countTaxPayer, countTaxationLand, getAnnuKramank, getConstructionForsarkari8, getConstructionTaxDetails, getCustomerDetailsById, getEntriesDetails, getEntriesDetailsForNamuna8Sarkari, getMalmattaNotdniList, getNewDistinctUserDetails, getNewUserDetails, getNewUserSevakarDetails, getTaxPayerDetails, getTaxationLandDetails, getTaxationandMilkat, getYear, gettaxationLandDetails, insertUpdateSillakJoda, softDeleteMalmattaNodniInfo, updateMalmattaNodniInfo } from "../../services/main/customer.service";
import { _200, _201, _400, _404 } from "../../utils/ApiResponse";
import { Utils } from "../../utils/util";
import * as jwt from 'jsonwebtoken';
import { getEnvironmentVariable } from "../../environments/env";
// import { getEnvironmentVariable } from "../environments/env";


// मालमत्ता धारकाची यादी (Customer List) Module API
export class CustomerController {
    static async createCustomerInfo(req: Request, res: Response) {
        const validationError = Utils.validateRequestBody(req.body, ["annu_kramank","malmatta_no","ward_no","khate_dharkache_name","address"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const member: any = await addNewCustomerInNodniFormInfo(req.body);
            return _201(res, "Successfully added new customer in malmatta nodni form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta nodni form", error);
            return _400(res, "Error creating new customer in malmatta nodni form");
        }
    }

    static async getAnnuKramank(req: Request, res: Response) {
        //  console.log("console", req.body)
        const validationError = Utils.validateRequestBody(req.body, ["ward_no","user_id"]); // Add required fields here
        if (validationError) {
            return _400(res, validationError);
        }

        try {
            const anu_details: any = await getAnnuKramank(req.body);
            return _201(res, "Annu Kramank fetch successfully", { status: 201, data: anu_details });
        } catch (error) {
            logger.error("Error fetching annu kramank", error);
            return _400(res, "Error fetching annu kramank");
        }
    }

    static async getCustomerById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing User ID");
            }
            const customers: any = await getCustomerDetailsById(Number(id));
            if (!customers) {
                return _404(res, "customer details not found");
            }
            return _200(res, "Customer details fetched successfully", { status: 200, data: customers });
        } catch (error) {
            logger.error("Error fetching customer details", error);
            return _400(res, "Error fetching customer details");
        }
    }

    static async getMalmattaNodniInfoList(req: Request, res: Response) {
        try {
            let page_number: number = req.body.page_number ? Number(req.body.page_number) : 1;
            let search: string = req.body.search_text ? req.body.search_text : "";
            let user_id: number = req.body.user_id ? Number(req.body.user_id) : 0;
            if(user_id == 0) {
                return _400(res, "Invalid or missing User ID");
            }
            console.log("console", page_number, search, user_id)
            const data: any = await getMalmattaNotdniList(page_number, search, user_id);
            return _200(res, "Malmatta nodni list fetched successfully", { status: 200, data: data.data, total_count: data.total_count });
        } catch (error) {
            logger.error("Error fetching getMalmattaNodniInfoList", error);
            return _400(res, "Error fetching malmatta nodni list");
        }
    }

    static async createUpdateSillakJoda(req: Request, res: Response) {
        try {
            const member: any = await insertUpdateSillakJoda(req.body);
            console.log("console", member)
            return _201(res, "Successfully added new customer in malmatta nodni form", { status: 201, data: member });
        } catch (error) {
            logger.error("Error creating new customer in malmatta nodni form", error);
            return _400(res, "Error creating new customer in malmatta nodni form");
        }
    }

    static async updateMalmattaNodniInfo(req: Request, res: Response) {
        try {
            const id = Number(req.body.new_user_id);
            if (!id) {
                return _400(res, "Invalid or missing NEW USER ID");
            }
            await updateMalmattaNodniInfo(req.body);

            return _200(res, "मालमत्ता धारकाची यादी updated successfully");
        } catch (error) {
            logger.error("Error updating मालमत्ता धारकाची यादी", error);
            return _400(res, "Error updating मालमत्ता धारकाची यादी");
        }
    }

    static async deleteMalmattaNodniInfo(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                return _400(res, "Invalid or missing मालमत्ता धारकाची यादी ID");
            }
            await softDeleteMalmattaNodniInfo(id);

            return _200(res, "मालमत्ता धारकाची यादी deleted successfully");
        } catch (error) {
            logger.error("Error deleting मालमत्ता धारकाची यादी", error);
            return _400(res, "Error deleting मालमत्ता धारकाची यादी");
        }
    }

    static async verifyUser(req: Request, res: Response) {
        try {
            let response: any = {};

            const { user_type, district_id, taluka_id, panchayat_id, username, password } = req.body;
            const result: any = await signIn(user_type as string, Number(district_id), Number(taluka_id), Number(panchayat_id), username, password);

            if (result?.data?.length === 0) {
                return _400(res, "Invalid username or password");
            }

            if (result?.data?.length > 0) {      
                response['data'] = {"is_success": true};
                return _200(res, "User logged in successfully", response);
            }


        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }
    static async namuna_8_1(req: Request, res: Response) {
        try {
            const new_user_id = Number(req.params.new_user_id);
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            // console.log(decoded_user['userId']);
            const currentYear = new Date().getFullYear();
            const previousYear = currentYear - 1;
            const nextYear = currentYear + 1;
            const year_3 = currentYear + 3;
            const year_4 = currentYear + 4;
            const years = [
                {
                    "currentYear": currentYear,
                    "previousYear": previousYear,
                    "nextYear": nextYear,
                    "year_3": year_3,
                    "year_4": year_4

                }
            ];

            const newUserDataDB: any = await getNewUserDetails(Number(new_user_id),Number(decoded_user['userId']));
            
            const entriesParam = {
                'district_id': Number(decoded_user['DISTRICT_ID']),
                'taluka_id': Number(decoded_user['TALUKA_ID']),
                'panchayat_id': Number(decoded_user['PANCHAYAT_ID']),
                'gatgrampanchayat_id': Number(decoded_user['GATGRAMPANCHAYAT_id']),
                'user_id': Number(decoded_user['userId'])
            }
            const entriesDetailsDB: any = await getEntriesDetails(entriesParam);

            const taxationlandDB =  await gettaxationLandDetails(Number(decoded_user['userId']), Number(new_user_id));
            const constructionTaxDetailsDB =  await getConstructionTaxDetails(Number(decoded_user['userId']), Number(new_user_id));
            const taxPayerDB =  await getTaxPayerDetails(Number(decoded_user['userId']), Number(new_user_id));

            // console.log(taxationlandDB);
            // Use the decoded token as needed
            const all_data = {
                newUserDataDBrs3: newUserDataDB,
                entriesDetailsDBrs2: entriesDetailsDB,
                taxationlandDBrs4: taxationlandDB,
                constructionTaxDetailsDBrs5: constructionTaxDetailsDB,
                taxPayerDBrrs6: taxPayerDB,
                years: years
            }
           

            // console.log("token", token);
            // console.log("authHeader", authHeader);
            // if (!new_user_id) {
            //     return _400(res, "Invalid or missing New User ID");
            // }
            // const customers: any = await getCustomerDetailsById(Number(new_user_id));
            // if (!customers) {
            //     return _404(res, "customer details not found");
            // }
            return _200(res, "Customer details fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }
    }

    static async namuna_9_1(req: Request, res: Response) {
        const new_user_id = Number(req.params.new_user_id);
        const ward_number = Number(req.params.ward_number);
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
        const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
        const years_response = await getYear()
        const years = [
            {
                "currentYear": Number(years_response[0].yyy),
                "previousYear": Number(years_response[0].yyy) - 1,
                "previousYear_id": Number(years_response[0].Year_id) - 1,
                "nextYear": Number(years_response[0].yyy) + 1,
                "year_3": Number(years_response[0].yyy) + 3,
                "year_4": Number(years_response[0].yyy) + 4

            }
        ];
        console.log(years);
        const newUserDataDB: any = await getNewUserDetails(Number(new_user_id),Number(decoded_user['userId']));
        const entriesParam = {
            'district_id': Number(decoded_user['DISTRICT_ID']),
            'taluka_id': Number(decoded_user['TALUKA_ID']),
            'panchayat_id': Number(decoded_user['PANCHAYAT_ID']),
            'gatgrampanchayat_id': Number(decoded_user['GATGRAMPANCHAYAT_id']),
            'user_id': Number(decoded_user['userId'])
        }
        const entriesDetailsDB: any = await getEntriesDetails(entriesParam);
        const sevakarParam = {
            'user_id': Number(decoded_user['userId']),
            "previousYear_id": Number(years_response[0].Year_id) - 1,
            "vard_number": newUserDataDB[0].VARD_NUMBER,
            "newuser_id":newUserDataDB[0].NEWUSER_ID,
        }
        const newUserSevakarDB = await getNewUserSevakarDetails(sevakarParam);
        newUserDataDB.forEach((userData: any) => {
            // Perform operations on each userData object
            // For example:
            console.log(userData);
        });
        const ls1 = 0;
        const pl1 = 0;
        const etar = 0;
        const notice = 0;
        const alphabets = {
            "a": Math.round(
                    newUserDataDB[0].BHUMIKAR +
                    newUserDataDB[0].VIZ_DIVVABATTIKAR +
                    newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                    newUserDataDB[0].SAFAI_KAR
                ),
            "b": Math.round(newUserSevakarDB[0].bhumi + newUserDataDB[0].BHUMIKAR),
            "d": newUserSevakarDB[0].diva +  newUserDataDB[0].VIZ_DIVVABATTIKAR,
            "e": newUserSevakarDB[0].aarogya +  newUserDataDB[0].AAROGYA_RAKSHAN_KAR,
            "f": newUserSevakarDB[0].safai +  newUserDataDB[0].SAFAI_KAR,
            "g": newUserSevakarDB[0].samanya +  newUserDataDB[0].SAMANYA_PANI_KAR,
            "h": newUserSevakarDB[0].vishesh +  newUserDataDB[0].VISHESH_PANI_KAR,
            "i": newUserSevakarDB[0].total +  newUserDataDB[0].EKUN,
            "n": newUserSevakarDB[0].etar + etar,
            "o": newUserSevakarDB[0].notice + notice,
            "ls": newUserSevakarDB[0].less + ls1,
            "pl": newUserSevakarDB[0].plus + pl1,
            "magilnewpl": Math.round((newUserSevakarDB[0].bhumi / 100) * newUserSevakarDB[0].plus),
            "totalnewpl": Math.round(Math.round((newUserSevakarDB[0].bhumi / 100) * newUserSevakarDB[0].plus) + pl1), // pl1 should be declared
            "k": Math.round(newUserSevakarDB[0].total),
            //  "k": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].samanya + newUserSevakarDB[0].vishesh + newUserSevakarDB[0].etar + newUserSevakarDB[0].notice),
            "l": Math.round(
                newUserDataDB[0].BHUMIKAR +
                newUserDataDB[0].VIZ_DIVVABATTIKAR +
                newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                newUserDataDB[0].SAFAI_KAR +
                newUserDataDB[0].SAMANYA_PANI_KAR +
                newUserDataDB[0].VISHESH_PANI_KAR
            ),
            'm': Math.round(newUserSevakarDB[0].total) + Math.round(
                newUserDataDB[0].BHUMIKAR +
                newUserDataDB[0].VIZ_DIVVABATTIKAR +
                newUserDataDB[0].AAROGYA_RAKSHAN_KAR +
                newUserDataDB[0].SAFAI_KAR +
                newUserDataDB[0].SAMANYA_PANI_KAR +
                newUserDataDB[0].VISHESH_PANI_KAR
            ),
            "s": Math.round(newUserSevakarDB[0].bhumi + newUserSevakarDB[0].diva + newUserSevakarDB[0].aarogya + newUserSevakarDB[0].safai + newUserSevakarDB[0].less) + Math.round((newUserSevakarDB[0].bhumi / 100) * newUserSevakarDB[0].plus),
            "j": Math.round(newUserSevakarDB[0].bhumi + newUserDataDB[0].BHUMIKAR) + Math.round(newUserSevakarDB[0].diva +  newUserDataDB[0].VIZ_DIVVABATTIKAR) +
            Math.round(newUserSevakarDB[0].aarogya +  newUserDataDB[0].AAROGYA_RAKSHAN_KAR) + Math.round(newUserSevakarDB[0].safai +  newUserDataDB[0].SAFAI_KAR) +Math.round(newUserSevakarDB[0].less + ls1) + Math.round(Math.round((newUserSevakarDB[0].bhumi / 100) * newUserSevakarDB[0].plus) + pl1)
        }

        const all_data = {
                newUserDataDBrs3: newUserDataDB,
                entriesDetailsDBrs2: entriesDetailsDB,
                newUserSevakarDBrs4: newUserSevakarDB,
                alphabets: alphabets,
                years: years
            }
        return _200(res, "Customer details fetched successfully", { status: 200, data: all_data });

    }

    static async namuna_8_sarkari(req: Request, res: Response) {
        try {
            const new_user_id = Number(req.params.new_user_id);
            const authHeader = req.headers.authorization;
            const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
            const decoded_user = jwt.verify(token, getEnvironmentVariable().jwt_secret);
            // console.log(decoded_user['userId']);

            const newUserDataDBrs14: any = await getNewDistinctUserDetails(Number(new_user_id),Number(decoded_user['userId']));
             
            const entriesParam = {
                'district_id': Number(decoded_user['DISTRICT_ID']),
                'taluka_id': Number(decoded_user['TALUKA_ID']),
                'panchayat_id': Number(decoded_user['PANCHAYAT_ID']),
                'gatgrampanchayat_id': Number(decoded_user['GATGRAMPANCHAYAT_id']),
                'user_id': Number(decoded_user['userId'])
            }
            const entriesDetailsRs66 = await getEntriesDetailsForNamuna8Sarkari(entriesParam);
            const countTaxationland = await countTaxationLand(Number(new_user_id),Number(decoded_user['userId']));
            const countConstructionTaxRs1 = await countConstructiontax(Number(new_user_id),Number(decoded_user['userId']));
            const taxPayerDB = await countTaxPayer(Number(new_user_id),Number(decoded_user['userId']));
            const all_counts = {
                "count": countTaxationland[0].count,
                "count1": countConstructionTaxRs1[0].count1,
                "count2": taxPayerDB[0].count2
            }
            let a: any;
            if(all_counts.count1 == 0 || all_counts.count2 == 0){
                a = 1 + all_counts.count1 + all_counts.count2;
            }else{
                a = 3
            }
            all_counts['a'] = a;
            const taxationLandDetailsDbRs4 = await getTaxationLandDetails(Number(new_user_id),Number(decoded_user['userId']))
            const taxandMilkatDetailsRs10 = await getTaxationandMilkat(Number(new_user_id),Number(decoded_user['userId']))
            const newUserDataDBRs3: any = await getNewUserDetails(Number(new_user_id),Number(decoded_user['userId']));
            const s = newUserDataDBRs3[0].BHUMIKAR + newUserDataDBRs3[0].VIZ_DIVVABATTIKAR + newUserDataDBRs3[0].AAROGYA_RAKSHAN_KAR + newUserDataDBRs3[0].SAFAI_KAR;
            all_counts['s'] = s;
            const getConstructionForsarkari8Rs7 = await getConstructionForsarkari8(Number(new_user_id),Number(decoded_user['userId']));
            const taxPayerDetailsRs6 =  await getTaxPayerDetails(Number(decoded_user['userId']), Number(new_user_id));
            const all_data = {
                newUserDataDBrs14: newUserDataDBrs14,
                entriesDetailsRs66: entriesDetailsRs66,
                all_counts: all_counts,
                taxationLandDetailsDbRs4: taxationLandDetailsDbRs4,
                taxandMilkatDetailsRs10:taxandMilkatDetailsRs10,
                newUserDataDBRs3:newUserDataDBRs3,
                getConstructionForsarkari8Rs7: getConstructionForsarkari8Rs7,
                taxPayerDetailsRs6: taxPayerDetailsRs6


            }
            return _200(res, "Customer details fetched successfully", { status: 200, data: all_data });
        } catch (error) {
            logger.error(error);
            return _400(res, error.message);
        }

    }
}


