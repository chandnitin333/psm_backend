import {API_KEY} from "../constants/constant";
import {
    getLectureDetails,
    getLectureList, getLectureStepResult,
    getQuestionAttempt,
    getQuestionCount, getQuestionCountByStepId,
    getStepCount, getStepDetails, getStepId, getStudentResult, getSubStepId
} from "../services/lecturesService";
import {_200, _400, _401, _403, _404} from "../utils/ApiResponse";
import {logger} from "../logger/Logger";
import {getTopicName} from "../services/classService";


export class lecturesController {

    static async  getLecturesList(req,res,next){
        try {
            let response = {}
            let userId = req?.body?.user_id
            let courseId = req?.body?.course_id
            let subjectId = req?.body?.subject_id
            let topicId = req?.body?.topic_id
            let apiKey = req?.body?.api_key
            let lectureCount = 0
            if(apiKey === API_KEY){
                let lectureList =  await  getLectureList([subjectId,topicId])
                let lectureDetails  = await  getLectureDetails([lectureList?.lecture_id])
                let questionCount=  await  getQuestionCount([subjectId,topicId,lectureList?.lecture_id])
                let attemptQuestions =  await  getQuestionAttempt([courseId,subjectId,topicId,lectureList?.lecture_id,userId])
                let stepCount =  await  getStepCount([subjectId,topicId,lectureList?.lecture_id])

                response['subject_id'] =  lectureList?.subject_id
                response['topic_id'] =  lectureList?.topic_id
                response['lecture_id'] =  lectureList?.lecture_id
                response['lecture_name'] =  lectureDetails?.lecture_name
                response['description'] =  lectureDetails?.description
                response['total_questions'] =  questionCount?.total_questions
                response['step_count'] = stepCount?.step_count
                lectureCount  = (attemptQuestions/response['total_questions']) * 100;
                response['lecture_count'] = Math.round(lectureCount);
                _200(res,[response])

            }else{
                _403(res,"Invalid API Key.")
            }
        }catch (e) {
            logger.log("getLecturesList Error", e)
            _400(res)
        }


    }


    static async  getLectureStep(req,res,next){
        try {
            let response = []
            let  resultObject
            let userId = req?.body?.user_id
            let courseId = req?.body?.course_id
            let subjectId = req?.body?.subject_id
            let topicId = req?.body?.topic_id
            let lectureId = req?.body?.lecture_id
            let apiKey = req?.body?.api_key
            let stepQuId = ''
            let STEP_ID_QUE_ARRAY
            let STEP_ID_SUB_ARRAY
            let isResult ='NO'
            let isResultComplete ='NA'
            let stepIdList  =  await  getStepId([subjectId,topicId])
            let stepSubIds =  await  getSubStepId([subjectId,topicId])
            for (let i =0; i < Object.keys(stepIdList).length ; i++) {
                if(stepQuId != '') {
                    stepQuId = `${stepQuId},${stepIdList[i].step_id}`
                 }else{
                    stepQuId = stepIdList[i].step_id
                }

            }

            STEP_ID_QUE_ARRAY =  stepQuId.split(',')
            stepQuId = ''
            for(let i = 0;  i < Object.keys(stepSubIds).length ; i++){
                if(stepQuId != '') {
                    stepQuId = `${stepQuId},${stepSubIds[i]?.step_id}`
                }else{
                    stepQuId = stepSubIds[i].step_id
                }

            }
            STEP_ID_SUB_ARRAY =  stepQuId.split(',')
            let newArr =  [...STEP_ID_QUE_ARRAY,...STEP_ID_SUB_ARRAY]
            let uniqueArr = newArr.filter((element, index) => newArr.indexOf(element) === index);
            if(uniqueArr){
                let i = 0
                for (const stepId of uniqueArr) {
                    let data = []
                    if(stepId) {
                        data['course_id'] =  courseId
                        data['subject_id'] =  subjectId
                        data['topic_id'] =  topicId
                        data['lecture_id'] =  lectureId
                        data['step_id'] =  stepId
                        let stepDetails = await getStepDetails([stepId])

                        data['step_name'] =  stepDetails?.step_name || ''

                        if(STEP_ID_QUE_ARRAY.includes(stepId) && STEP_ID_SUB_ARRAY.includes(stepId)){
                            data['step_type'] =  'B'
                        }else if(STEP_ID_QUE_ARRAY.includes(stepId)){
                            data['step_type'] =  'Q'
                        }else if(STEP_ID_SUB_ARRAY.includes(stepId)){
                            data['step_type'] =  'S'
                        }
                         isResult ='NO'
                         isResultComplete ='NA'
                        let studResult =  await  getStudentResult([userId,courseId,subjectId,topicId,stepId])

                        if(studResult?.total_questions  == studResult?.total_correct_answer){
                            isResultComplete ='YES'
                        }else{
                            isResultComplete='NO'
                        }
                        data['is_result'] = isResult
                        data['is_result_complete'] =  isResultComplete
                        data['result_id'] =  studResult?.result_id || ''

                        const quesCount = await getQuestionCountByStepId([subjectId,topicId,stepId])

                        if(quesCount){
                            data['total_question'] = quesCount?.total_questions
                        }


                    }
                    response[i++]= {...data}

                }
                _200(res,response)
            }else{
                _400(res)
            }





        }catch (e) {
            console.log(e)
            logger.log("getLectureStep Error", e)
            _400(res)
        }


    }

    static getLectureStepResult  =  async (req,res,next) =>{
            try {
                logger.info("getLectureStepResult request body :: ", req?.body)
                let response = []
                let questionId =  req?.body?.question_id
                let topicId =  req?.body?.topic_id
                let subjectId =  req?.body?.subject_id
                let courseId =  req?.body?.course_id
                let stepId =  req?.body?.step_id
                let lectureId =  req?.body?.lecture_id
                let SEL_ACTIVITY =  req?.body?.SEL_ACTIVITY
                let userId =  req?.body?.user_id
                if(API_KEY ==  req?.body?.api_key) {
                    let result = await getLectureStepResult([courseId,subjectId,topicId,lectureId,userId,stepId])

                    if(Object.keys(result).length > 0){

                        for (let i =0; i < Object.keys(result).length ; i++) {
                            let data = []
                            data['student_result_id'] =  result[i]?.student_result_id || ''
                            data['result_id'] =  result[i]?.result_id || ''
                            data['total_questions'] =  result[i]?.total_questions || ''
                            data['topic_name'] =  await  getTopicName([result[i]?.topic_id])
                            response[i]= {...data}
                        }
                    }else{
                        return _404(res,"No result found.")
                    }

                    _200(res, response)
                }else{
                    _401(res)
                }
            }catch (e){
                logger.error("getLectureStepResult Error :: ", e)
                _400(res)
            }
    }

}