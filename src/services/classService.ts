import { logger } from "../logger/Logger";
import { executeQuery } from "../config/db/db";
import { USER_ROLE } from "../constants/constant";


export const getLiveClasses = async (role: string, params: object) => {
    try {
        let sql = ''
        if (role === USER_ROLE.ROLE_USER_STUDENT) {
            sql = `select * from online_live_class_dtl where DATE_FORMAT(schedule_start_date, '%Y-%m-%d') = ? and schedule_end_date >= NOW() and is_deleted = 0 and batch_id in (select batch_id from student_course_batch_allocation where student_id = ?) order by schedule_start_date asc`
        } else if (role === USER_ROLE.ROLE_USER_TEACHER) {
            sql = `select * from online_live_class_dtl where DATE_FORMAT(schedule_start_date, '%Y-%m-%d') = ? and schedule_end_date >= NOW() and is_deleted = 0 and user_id = ? order by schedule_start_date asc`
        } else {
            sql = `select * from online_live_class_dtl  where DATE_FORMAT(schedule_start_date, '%Y-%m-%d') = ?  and schedule_end_date >= NOW() and is_deleted = 0 and batch_id in (select batch_id from student_course_batch_allocation  where student_id = ? ) order by schedule_start_date asc`
        }
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null
        }).catch(err => {
            logger.error("getLiveClasses  Fetch Error ::", err)
        })

    } catch (err) {
        logger.error("getLiveClasses Error ::", err)
    }

}


export const getTeacherNameById = async (params: object) => {
    try {
        let sql = `SELECT firstname,lastname FROM user WHERE id= ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0]['firstname'] + ' ' + result[0]['lastname'] : null;
        }).catch(error => {
            console.error("getTeacherNameById Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getTeacherNameById Error ::", err)
    }
}


export const getConceptName = async (params: object) => {
    try {
        let sql = `SELECT concept_id,concept_name FROM topic_concept_mst WHERE concept_id = ?`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0]['concept_name'] : null;
        }).catch(error => {
            console.error("getConceptName Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getConceptName Error ::", err)
    }
}

export const getTopicName = async (params: object) => {
    try {
        let sql = `SELECT topic_name FROM topic_mst  WHERE topic_id = ? `
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0]['topic_name'] : null;
        }).catch(error => {
            console.error("getTopicName Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getTopicName Error ::", err)
    }
}


export const getBatchName = async (params: object) => {
    try {
        let sql = `SELECT batch_name FROM batches_mst WHERE batch_id = ? AND status = 'ENABLE' AND is_deleted = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0]['batch_name'] : null;
        }).catch(error => {
            console.error("getBatchName Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getBatchName Error ::", err)
    }
}


export const getLiveClassStatus = async (params: object) => {
    try {
        let sql = `SELECT device_id,is_device_check FROM user WHERE id = ? AND user_status = 'ACTIVE' AND is_deleted = 0`
        return executeQuery(sql, params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getLiveClassStatus Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getLiveClassStatus Error ::", err)
    }
}

export const addNewLiveClass = async (params: object) => {
    try {
        let sql = `INSERT INTO live_class_attempt_status(student_id,class_id,course_id,device_id,class_start_time,class_end_time,class_status) VALUES(?,?,?,?,?,?,?)`
        return executeQuery(sql, params).then(result => {
            logger.info("addNewLiveClass status: ", result);
            return (result) ? result[0] : null;
        }).catch(error => {
            logger.error("addNewLiveClass insertion Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("addNewLiveClass Error ::", err)
    }
}

export const getLiveClassStatusDetails = async (params: object) => {
    try {

        let sql = `SELECT * FROM live_class_attempt_status WHERE student_id = ? AND class_id = ? AND course_id = ?  AND device_id = ? `
        return executeQuery(sql, params).then(result => {

            return (result) ? result[0] : null;
        }).catch(error => {
            logger.error("getLiveClassStatusDetails Fetch Data Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("getLiveClassStatusDetails Error ::", err)
    }
}

export const updateLiveClassStatus = async (params: object) => {
    try {
        let sql = `UPDATE live_class_attempt_status SET class_start_time = ? ,class_end_time = ? ,class_status =? WHERE student_id = ? AND class_id = ? AND course_id = ? AND device_id = ?`
        return executeQuery(sql, params).then(result => {
            logger.info("updateLiveClassStatus status: ", result);
            return (result) ? result[0] : null;
        }).catch(error => {
            logger.error("updateLiveClassStatus update Error: ", error);
            return null;
        });
    } catch (err) {
        logger.error("updateLiveClassStatus Error ::", err)
    }
}