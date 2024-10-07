import { API_KEY, USER_ROLE } from "../constants/constant";
import { logger } from "../logger/Logger";
import { _200, _201, _400, _404 } from "../utils/ApiResponse";
import { isExistUser } from "../services/userService";
import {
    addNewLiveClass,
    getBatchName,
    getConceptName,
    getLiveClasses,
    getLiveClassStatus, getLiveClassStatusDetails,
    getTeacherNameById,
    getTopicName, updateLiveClassStatus
} from "../services/classService";
import { getSubjectNameById } from "../services/courseService";


export class classController {


    static liveClass = async (req, res, next) => {
        let response = {}
        try {
            logger.info("liveClass request body::", req.body)
            let userId = req?.body?.user_id
            let apiKey = req?.body?.api_key
            let currentDate = req?.body?.curr_date

            if (API_KEY == apiKey) {
                let user = await isExistUser([userId]);
                let role = user?.role
                let liveClassDetails = await getLiveClasses(role, [currentDate, userId])
                if (liveClassDetails) {
                    response["course_id"] = liveClassDetails?.course_id
                    response["center_id"] = liveClassDetails?.center_id
                    response["batch_id"] = liveClassDetails?.batch_id
                    response["live_class_id"] = liveClassDetails?.live_class_id
                    response["live_class_name"] = liveClassDetails?.live_class_name
                    response["subject_id"] = liveClassDetails?.subject_id
                    response["user_id"] = liveClassDetails?.user_id
                    response["meeting_id"] = liveClassDetails?.meeting_id
                    response["meeting_passcode"] = liveClassDetails?.meeting_passcode
                    response["zoom_id"] = liveClassDetails?.zoom_id
                    response["class_duration"] = liveClassDetails?.class_duration
                    response["schedule_start_date"] = liveClassDetails?.schedule_start_date
                    response["schedule_end_date"] = liveClassDetails?.schedule_end_date
                    response["start_url"] = liveClassDetails?.start_url
                    response["join_url"] = liveClassDetails?.join_url
                    response["host_id"] = liveClassDetails?.host_id
                    response["instructions"] = liveClassDetails?.instructions
                    response["class_status"] = liveClassDetails?.class_status
                    response["sequence"] = liveClassDetails?.sequence
                    let subjectName
                    if (liveClassDetails?.subject_id) {
                        subjectName = await getSubjectNameById(liveClassDetails.subject_id)
                    }
                    let fullName
                    if (liveClassDetails?.user_id) {
                        fullName = await getTeacherNameById(liveClassDetails.user_id)
                    }
                    let topicName
                    if (liveClassDetails?.topic_id) {
                        topicName = await getTopicName(liveClassDetails.topic_id)
                    }
                    let batchName
                    if (liveClassDetails?.batch_id) {
                        batchName = await getBatchName(liveClassDetails.batch_id)
                    }
                    let conceptName
                    if (liveClassDetails?.concept_id) {
                        conceptName = await getConceptName(liveClassDetails.concept_id)
                    }
                    response['subject_name'] = subjectName;
                    response['user_name'] = fullName;
                    response['concept_name'] = conceptName;
                    response['topic_name'] = topicName;
                    response['batch_name'] = batchName;

                    _200(res, response, 'Live Class Data', 'live_data')
                } else {
                    _404(res, "No live class")
                }
            } else {
                _400(res, 'Something wen wrong.')
            }
        } catch (e) {
            logger.error("liveClass Error :: ", e)
            _400(res, 'Something wen wrong.')
        }

    }

    static liveClassStatus = async (req, res, next) => {
        let response = {}
        try {
            logger.info("liveClassStatus request body::", req.body)
            let userId = req?.body?.user_id
            let apiKey = req?.body?.api_key
            let uniqueId = req?.body?.unique_id
            let scheduleStartDate = req?.body?.schedule_start_date
            let scheduleEndDate = req?.body?.schedule_end_date
            let currentDate = new Date().getTime()
            scheduleStartDate = new Date(scheduleStartDate).getTime()
            scheduleEndDate = new Date(scheduleEndDate).getTime()
            let isExpired = 'NO'
            let isUnique = 'NO'
            if (API_KEY == apiKey) {
                let liveClass = await getLiveClassStatus([userId])

                if (liveClass?.is_device_check == 0) {
                    isUnique = 'YES'
                } else if (liveClass.device_id != null && liveClass.device_id != '' && liveClass.device_id === uniqueId) {
                    isUnique = 'YES'
                } else {
                    isUnique = 'NO'
                }

                if (currentDate < scheduleStartDate || currentDate > scheduleEndDate) {
                    isExpired = 'YES'
                }

            }

            if (isExpired === 'YES') {
                _400(res, 'Class expired')
            } else if (isUnique == 'YES') {

                _200(res, null, 'Join class')
            } else {
                _400(res, 'Login to another device')
            }
        } catch (e) {
            _400(res)
        }

    }

    static addLiveClassMeetingStatus = async (req, res, next) => {
        let response = {}
        try {
            logger.info("addLiveClassMeetingStatus request body::", req.body)
            let userId = req?.body?.user_id
            let apiKey = req?.body?.api_key
            let uniqueId = req?.body?.uniqueId
            let classStartDate = req?.body?.startTime
            let classEndDate = req?.body?.endTimeUpdate
            let liveClassId = req?.body?.liveClassId
            let courseId = req?.body?.courseId
            let classStatus = req?.body?.classStatus
            let liveClassData = await getLiveClassStatusDetails([userId, liveClassId, courseId, uniqueId])

            if (liveClassData) {
                if (classStartDate != null && classEndDate != null) {
                    await updateLiveClassStatus([classStartDate, classEndDate, 'COMPLETED', userId, liveClassId, courseId, uniqueId])
                } else if (classStartDate != null) {
                    await updateLiveClassStatus([classStartDate, null, 'STARTED', userId, liveClassId, courseId, uniqueId])
                } else {
                    await updateLiveClassStatus([null, null, null, userId, liveClassId, courseId, uniqueId])
                }
                _201(res, "", "Live class status details updated")
            } else {

                if (classStartDate != null && classEndDate != null) {
                    await addNewLiveClass([userId, liveClassId, courseId, uniqueId, classStartDate, classEndDate, 'COMPLETED'])
                } else if (classStartDate != null) {
                    await addNewLiveClass([userId, liveClassId, courseId, uniqueId, classStartDate, null, 'STARTED'])
                } else {
                    await addNewLiveClass([userId, liveClassId, courseId, uniqueId, null, null, null])
                }
                _201(res, "", "New live class status details added")
            }


        } catch (e) {
            _400(res)
        }
    }


}