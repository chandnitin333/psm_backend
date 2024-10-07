import { executeQuery } from "../config/db/db";
import { logger } from "../logger/Logger"


export const getExamQuestionDetails = async (qType = '', params: object) => {
    try {
        let queType = (qType != '') ? ' AND vw.question_type_id != 4' : ''
        let sql = `SELECT *, NOW() AS CURRENTDATE from similar_question_mst vw WHERE vw.parent_question_id = ? ${queType}  AND vw.status = 'ENABLE' AND vw.is_deleted = 0		
         LIMIT 1`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(err => {
            console.error("getAllExamQuestion Fetch Data catch error :: ", err);
            return null;
        });
    } catch (err) {
        logger.error("getAllExamQuestion Error :: ", err)
        throw new Error(err)
    }
}

/**
 * @description use for get subject list base on parent question id
 * @param params  provide question id
 * @returns 
 */
export const getAllSubjectList = async (params: object) => {
    try {

        let sql = `SELECT que.subject_id,sub.subject_name from 
        similar_question_mst que,subject_mst sub WHERE que.subject_id = sub.subject_id AND que.parent_question_id = ? AND que.question_type_id != 4 AND que.is_deleted = 0 AND que.status = 'ENABLE'		
        GROUP BY que.subject_id ORDER BY que.subject_id ASC`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(err => {
            console.error("getAllSubjectList Fetch Data catch error :: ", err);
            return null;
        });
    } catch (err) {
        logger.error("getAllSubjectList Error :: ", err)
        throw new Error(err)
    }
}


export const getExamTypeIdDetails = async (params: object) => {
    try {
        let sql = `SELECT que.subject_id,sub.subject_name from 
        similar_question_mst que,subject_mst sub WHERE que.subject_id = sub.subject_id AND que.parent_question_id = ? AND que.question_type_id != 4 AND que.is_deleted = 0 AND que.status = 'ENABLE'		
        GROUP BY que.subject_id ORDER BY que.subject_id ASC`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(err => {
            console.error("getAllSubjectList Fetch Data catch error :: ", err);
            return null;
        });
    } catch (err) {
        logger.error("getAllSubjectList Error :: ", err)
        throw new Error(err)
    }
}




/**
 * QUESTION Hint
 */

export const  getQuestionHintDetails =async (params:object)=>{
    try {
        let sql = `SELECT * FROM question_hint_dtl sub WHERE sub.question_id = ? AND sub.status = 'ENABLE' AND sub.is_deleted = 0`;
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(err => {
            console.error("getQuestionHintDetails Fetch Data catch error :: ", err);
            return null;
        });
    } catch (err) {
        logger.error("getQuestionHintDetails Error :: ", err)
        throw new Error(err)
    }
}