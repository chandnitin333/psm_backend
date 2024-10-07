
import { executeQuery } from "../config/db/db";
import { logger } from "../logger/Logger"




export const getCourseList = async (params: object) => {
    try {
        let sql = `SELECT * FROM course_mst, user_subscribed_courses WHERE course_mst.course_id = user_subscribed_courses.course_id 
        AND user_subscribed_courses.user_id =?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getCourseList Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getCourseList::", err)
    }

}


export const getSubjectNameById = async (params: object) => {
    try {
        let sql = `SELECT subject_name FROM subject_mst WHERE subject_id = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getSubjectNameById Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getSubjectNameById::", err)
    }
}