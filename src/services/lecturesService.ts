import {executeQuery} from "../config/db/db";
import {logger} from "../logger/Logger";


export const getLectureList = (params:object)=>{
    try {
        let sql = `SELECT lec.subject_id, lec.topic_id,lec.lecture_id FROM question_mst lec WHERE lec.subject_id= ?  AND lec.topic_id=? AND lec.lecture_id != 0 AND lec.is_deleted = 0 GROUP BY lecture_id ORDER BY lec.lecture_id`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getLectureList Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getLectureList Error::", err)
    }
}

/**
 * @function getLectureDetails
 * @description   use for getting lectures details passing lecture id
 * @param params
 */
export  const getLectureDetails = (params:object) =>{
    try {
        let sql = `SELECT * FROM lecture_mst WHERE lecture_id = ? AND status = 'ENABLE' AND is_deleted = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getLectureDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getLectureDetails Error::", err)
    }
}


export const getQuestionCount =(params:object)=>{
    try {
        let sql = `SELECT COUNT(question_id) AS total_questions from question_mst  vw WHERE  vw.subject_id= ?  AND vw.topic_id=? AND vw.lecture_id = ? AND vw.is_deleted = 0 AND vw.status = 'ENABLE' `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getQuestionCount Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getQuestionCount Error::", err)
    }
}

export const getQuestionAttempt = async  (params:object)=>{
    try {

        let sql = `SELECT MAX(attempted_questions) AS attempted_questions from student_practice_result vw WHERE vw.course_id= ? AND vw.subject_id= ? AND vw.topic_id=? AND vw.lecture_id = ? AND vw.student_id = ? AND vw.is_deleted = 0 AND vw.status = 'ENABLE' AND vw.sel_activity = 'ACTIVITY_PRACTICE'  GROUP BY step_id `
        return executeQuery(sql, params).then(result => {

            return (result) ? result[0]?.attempted_questions || 0 : 0;
        }).catch(error => {
            console.error("getQuestionAttempt Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getQuestionAttempt Error::", err)
    }
}

export const getStepCount = async (params:object)=>{
    try {
        let sql = `SELECT count(step_id) as step_count FROM question_mst lec WHERE lec.subject_id= ?  AND lec.topic_id= ?  AND lec.lecture_id= ?  AND lec.question_type_id != 4 AND lec.status = 'ENABLE' AND lec.is_deleted = 0 GROUP BY step_id `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getStepCount Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getStepCount Error::", err)
    }
}


export const getStepId = async (params:object) =>{
    try {
        let sql = `SELECT step_id FROM question_mst lec WHERE lec.step_id != 0 AND lec.subject_id= ?  AND lec.topic_id= ?  AND lec.question_type_id != 4 AND lec.status = 'ENABLE' AND lec.is_deleted = 0 GROUP BY step_id`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getStepId Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getStepId Error::", err)
    }
}

export const getSubStepId = async (params:object) =>{
    try {
        let sql = `SELECT step_id FROM question_mst lec WHERE  lec.subject_id= ?  AND lec.topic_id= ?  AND lec.question_type_id != 4 AND lec.status = 'ENABLE' AND lec.is_deleted = 0 GROUP BY step_id`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            logger.error("getSubStepId Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getSubStepId Error::", err)
    }
}
export const  getStepDetails =async (params:object) => {
    try {
        let sql = `SELECT * FROM step_mst  WHERE step_id = ? AND status = 'ENABLE' AND is_deleted = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getStepDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getStepDetails Error::", err)
    }
}

export  const getStudentResult =async (params:object) =>{
    try {

        let sql = `SELECT * FROM student_practice_result res WHERE res.student_id = ? AND res.course_id= ? AND res.subject_id= ?  AND res.topic_id= ? AND res.step_id= ? AND res.status = 'ENABLE' AND res.is_deleted = 0 AND res.sel_activity = 'ACTIVITY_PRACTICE' ORDER BY student_result_id ASC`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getStudentResult Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getStudentResult Error::", err)
    }
}

export const getQuestionCountByStepId = async (params:object) =>{
    try {

        let sql = `SELECT COUNT(question_id) AS total_questions from question_mst vw WHERE  vw.subject_id=? AND vw.topic_id=? AND vw.step_id=? AND vw.is_deleted = 0 AND vw.status = 'ENABLE'`
        return executeQuery(sql, params).then(result => {

            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getQuestionCountByStepId Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getQuestionCountByStepId Error::", err)
    }
}

export const getLectureStepResult = (params:object) =>{
    try {

        let sql = `SELECT * FROM student_practice_result vw WHERE vw.course_id=? AND vw.subject_id=? AND vw.topic_id=? AND vw.lecture_id = ? AND vw.student_id = ? AND vw.step_id = ? AND vw.is_deleted = 0 AND vw.status = 'ENABLE' AND vw.sel_activity = 'ACTIVITY_PRACTICE' ORDER BY student_result_id DESC LIMIT 10`
        return executeQuery(sql, params).then(result => {

            return (result) ? result || null : null;
        }).catch(error => {
            console.error("getLectureStepResult Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getLectureStepResult Error::", err)
    }
}

