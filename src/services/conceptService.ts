import {executeQuery} from "../config/db/db";
import {logger} from "../logger/Logger";


export const getQuestionDetails =async (params:object)=>{  // subject id
    try {
        let sql = `SELECT vw.subject_id,vw.topic_id,vw.concept_id,vw.concept_type_id,COUNT(vw.question_id) as total_question from question_mst vw WHERE vw.subject_id= ?  AND vw.practice_type = 'CONCEPTWISE' AND vw.question_type_id != 4 AND vw.status = 'ENABLE' AND vw.is_deleted = 0 GROUP BY  vw.subject_id,vw.topic_id,vw.concept_id,vw.concept_type_id`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getQuestionDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getQuestionDetails Error::", err)
    }
}

export const getConceptDetails =async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM topic_concept_mst ct WHERE  ct.subject_id= ?   AND  ct.is_deleted = 0 AND ct.status = 'ENABLE'`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getConceptDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptDetails Error::", err)
    }
}

export const getConceptTypeDetails = async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM concept_type_mst res WHERE res.concept_for = 'TEST_POST' AND  res.status = 'ENABLE' AND res.is_deleted = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getConceptTypeDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptTypeDetails Error::", err)
    }
}

export const getRecordSessionDetails =async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM recorded_session_dtl res WHERE res.course_id= ?  AND res.subject_id=? AND res.topic_id=? AND res.concept_id=? AND res.status = 'ENABLE' AND res.is_deleted = 0 limit 1`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getRecordSessionDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getRecordSessionDetails Error::", err)
    }
}

export const getVideoWatchStatus =async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM student_video_watch_status  WHERE course_id = ? AND subject_id = ? AND topic_id = ? AND concept_id = ? AND  asset_id = ? AND user_id = ? `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getVideoWatchStatus Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getVideoWatchStatus Error::", err)
    }
}


export const getUserContentHistory = async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM  user_content_history  sub WHERE  sub.subject_id = ? AND sub.topic_id = ? AND sub.concept_id = ? AND sub.student_id = ? AND sub.recorded_session_dtl_id = ?  AND sub.status = 'ENABLE' AND sub.is_deleted = 0 LIMIT 1 `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getUserContentHistory Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getUserContentHistory Error::", err)
    }
}

export const getAssetDetails =async (params:object)=>{  // subject id
    try {
        let sql = `SELECT * FROM asset WHERE id = ? `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getAssetDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getAssetDetails Error::", err)
    }
}


export const getTopicConceptTypeList = async (params:object)=>{
    try {
        let sql = `SELECT * FROM concept_type_mst ct WHERE ct.is_deleted = 0 AND ct.status = 'ENABLE' `
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getTopicConceptTypeList Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getTopicConceptTypeList Error::", err)
    }
}


export const getConceptListById = async (params:object)=>{

    try {
        let sql = `SELECT * FROM concept_type_mst ct WHERE ct.concept_type_id = ? AND ct.is_deleted = 0 AND ct.status = 'ENABLE'`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getConceptListById Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptListById Error::", err)
    }
}

export const getConceptDtl = async (type:string, params:object)=>{

    try {
        let sql
        if(type == 'SINGLE') {
            sql = `SELECT * FROM content_dtl ct WHERE ct.content_id = ? `
        }else {
            sql = `SELECT * FROM content_dtl ct WHERE ct.concept_type_id =  ?  AND ct.course_id= ?  AND ct.subject_id= ?  AND ct.topic_id= ?  AND ct.concept_id= ?  AND ct.status = 'ENABLE' AND ct.is_deleted = 0`
        }
        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getConceptListById Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptListById Error::", err)
    }
}


export const getConceptQuesDtl= async (params:object)=>{

    try {
        let sql =`SELECT lec.course_id, lec.subject_id, lec.topic_id, lec.concept_id, lec.concept_type_id FROM  question_mst  lec WHERE lec.subject_id= ?  AND lec.topic_id= ?  AND lec.concept_id= ?  AND lec.concept_type_id = ? AND lec.is_deleted = 0  ORDER BY  lec.concept_type_id`


        return executeQuery(sql, params).then(result => {
            return (result) ? result : null;
        }).catch(error => {
            console.error("getConceptQuesDtl Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptQuesDtl Error::", err)
    }
}

export const getPracticeResult= async (params:object)=>{

    try {
        let sql =`SELECT * FROM student_practice_result res WHERE res.student_id = ? AND res.course_id= ?  AND res.subject_id=? AND res.topic_id= ?  AND res.concept_id=? AND res.concept_type_id= ?  AND res.status = 'ENABLE' AND res.is_deleted = 0 AND res.sel_activity = 'ACTIVITY_CLASSROOM'`


        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getConceptQuesDtl Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptQuesDtl Error::", err)
    }
}

