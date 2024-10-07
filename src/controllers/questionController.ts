import { logger } from "../logger/Logger"
import {getAllSubjectList, getExamQuestionDetails, getQuestionHintDetails} from "../services/questionService"
import {_200, _400, _401, _404} from "../utils/ApiResponse"
import {API_KEY} from "../constants/constant";



export class questionController {



    static getAllExamQuestion = async (req, res, next) => {
        let response = {}
        try {
            let courseId = req?.body?.COURSE_ID
            let userID = req?.body?.user_id
            let subjectId = req?.body?.SUBJECT_ID
            let topicId = req?.body?.TOPIC_ID
            let stepId = req?.body?.STEP_ID
            let stepType = req?.body?.STEP_TYPE
            let setActivity = req?.body?.SEL_ACTIVITY
            let examId = req?.body?.EXAM_ID
            let examName = req?.body?.EXAM_NAME
            let conceptId = req?.body?.CONCEPT_ID
            let subConceptId = req?.body?.SUB_CONCEPT_ID
            let conceptTypeId = req?.body?.CONCEPT_TYPE_ID
            let questionId = req?.body?.QUESTION_ID
            let apiKey = req?.body?.api_key

            let IS_PRACTICE = "YES";
            let IS_SECTION_AVAILABLE = "YES";
            let NUMBER_OF_QUESTIONS = "";
            let ALLOCATION_TIME = "";
            let ORDERING = "";
            let SUBJECT_ID_ARRAY = "";
            let SUBJECT_NAME_ARRAY = "";
            let QUESTION_RESTRICTED_COUNT_ARRAY = "";
            let examTypeId
            let subjectIdArr
            let subjectNameArr
            if (setActivity === 'ACTIVITY_SIMILAR_QUESTION') {
                if (stepType === 0) {
                    let questionDetails = await getExamQuestionDetails('', [questionId])
                    examTypeId = questionDetails?.exam_type_id
                    if (examTypeId == 1) {
                        IS_PRACTICE = 'YES'
                        ALLOCATION_TIME = ''
                    }

                    let subjectDetails = await getAllSubjectList([questionId])
                    subjectIdArr = subjectDetails?.subject_id.slice(0, -1)
                    subjectNameArr = subjectDetails?.subject_name.slice(0, -1)
                }


            } else if (setActivity === 'ACTIVITY_CLASSROOM') {
                let ADDSUB_CONCEPT_ID
                let ALISADDSUB_CONCEPT_ID

                if (subConceptId == '0' || subConceptId == '' || subConceptId == 'NULL') {

                    if (stepType === 0) {
                    }
                }

            }


            _200(res, response)
        } catch (err) {
            logger.error("getAllExamQuestion Error", err)
            _400(res)
        }

    }

    static getQuestionHint = async (req,res,next)=>{
        try {
            logger.info("getQuestionHint request body ::",res?.body)
            let response=[]
            let questionId =  req?.body?.question_id
            if(API_KEY == req?.body?.api_key){
                const questionDetails =  await  getQuestionHintDetails([questionId])
                if(questionDetails){

                   for (let i = 0 ; i < Object.keys(questionDetails).length ; i++ ){
                       let data = [];
                       data['HINT_ID'] = questionDetails[i]?.hint_id || ''
                       data['QUESTION_ID'] = questionDetails[i]?.question_id || ''
                       data['FILE_NAME'] = questionDetails[i]?.file_name || ''
                       data['FILE_PATH'] = questionDetails[i]?.file_path || ''
                       data['FILE_EXT'] = questionDetails[i]?.file_ext || ''

                       response[i]= {...data}
                   }

                }else{
                    _404(res,"No Question Details Found")
                }
                // console.log("questionDetails",questionDetails)
            }else {
                _401(res)
            }
            _200(res,response)
        }catch (e) {

            logger.error("getQuestionHint Error",e)
            _400(res)
        }
    }

}