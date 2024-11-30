import { executeQuery } from "../../config/db/db";
import { PAGINATION } from "../../constants/constant";
import { logger } from "../../logger/Logger";
// कामकाज कमेटी 
async function addMember(member: any): Promise<void> {
    const query = `
        INSERT INTO MemberMaster (PANCHAYAT_ID, NAME_NAME, MIDDLE_NAME, LAST_NAME, DESIGNATION_ID, MOBILE_NO)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        member.panchayat_id,
        member.member_name,
        member.member_middle_name,
        member.member_last_name,
        member.destination_id,
        member.mobile_number,
    ];
    await executeQuery(query, values);
    logger.info("Member added successfully");
}

async function updateMember(member: any): Promise<void> {
    const query = `
        UPDATE MemberMaster
        SET PANCHAYAT_ID = ?, NAME_NAME = ?, MIDDLE_NAME = ?, LAST_NAME = ?, DESIGNATION_ID = ?, MOBILE_NO = ?
        WHERE MEMBERMASTER_ID = ?
    `;
    const values = [
        member.panchayat_id,
        member.member_name,
        member.member_middle_name,
        member.member_last_name,
        member.destination_id,
        member.mobile_number,
        member.id,
    ];
    logger.info("Member updated successfully");
    return await executeQuery(query, values);

}

async function getMember(memberId: number): Promise<any | null> {
    const query = `
        SELECT * FROM MemberMaster
        WHERE MEMBERMASTER_ID = ? AND DELETED_AT IS NULL
    `;
    const results: any = await executeQuery(query, [memberId]);
    if (results.length > 0) {
        return results[0] as any;
    }
    return null;
}

async function getMembersList(page: number = 1, memberName?: string, panchayat_id?:number): Promise<any[]> {
    let limit: number = PAGINATION.LIMIT;
    const offset = (page - 1) * limit;
    let query = `
        SELECT * FROM MemberMaster
        WHERE DELETED_AT IS NULL
    `;
    const values: any[] = [];
    if (panchayat_id) {
        query += '  AND PANCHAYAT_ID= ?'
        values.push(panchayat_id)
    }

    if (memberName) {
        query += ` AND LOWER(NAME_NAME) LIKE LOWER(?)`;
        values.push(`%${memberName}%`);
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;
    const results = await executeQuery(query, values);
    return results as any[];
}
async function softDeleteMember(memberId: number): Promise<void> {
    const query = `
        UPDATE MemberMaster
        SET DELETED_AT = NOW()
        WHERE MEMBERMASTER_ID = ?
    `;
    logger.info(`Action for Delete Member with ID ${memberId} soft deleted successfully`);
    return await executeQuery(query, [memberId]);

}

//get total count of member
async function getMemberCount(): Promise<number> {
    const result = await executeQuery('SELECT COUNT(*) as count FROM MemberMaster WHERE DELETED_AT IS NULL', []);
    return result[0].count;
}

async function getpanchayatUsers (): Promise<any | null> {
    try {
        return await executeQuery(`SELECT  p.PANCHAYAT_ID, p.PANCHAYAT_NAME FROM membermaster mm
            JOIN panchayat p ON mm.PANCHAYAT_ID = p.PANCHAYAT_ID
           WHERE  mm.DELETED_AT IS NULL GROUP BY mm.PANCHAYAT_ID`, []);
    } catch (err) {
        logger.error('Error getpanchayatUsers::', err);
        throw err;
    }

}

export {
    addMember, getMember, getMemberCount, getMembersList,
    softDeleteMember, updateMember, getpanchayatUsers
};
