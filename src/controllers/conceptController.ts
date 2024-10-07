import {logger} from "../logger/Logger";
import {_200, _400, _404} from "../utils/ApiResponse";
import {
    getAssetDetails,
    getConceptDetails, getConceptDtl, getConceptListById, getConceptQuesDtl,
    getConceptTypeDetails, getPracticeResult,
    getQuestionDetails,
    getRecordSessionDetails, getTopicConceptTypeList, getUserContentHistory, getVideoWatchStatus
} from "../services/conceptService";
import {getStudentResult} from "../services/lecturesService";

export class conceptController {

    static async getConceptList(req, res, next) {
        try {
            logger.info("getConceptList request body", res?.body)
            let response = []
            let userId=  req?.body?.user_id
            let courseId=  req?.body?.course_id
            let subjectId=  req?.body?.subject_id
            let topicId=  req?.body?.topic_id
            let questIdSize = 0;
            let topicIdArr = []
            let conceptIdArr = []
            let conceptTypeIdArr = []
            let totalQuesArr = []
            let conceptId =''
            let conceptTypeId
            let conceptFor
            let name = ''
            let isResult = 'No'
            let quesDetails =  await getQuestionDetails([subjectId])
            if(quesDetails) {
                for (let i = 0; i < Object.keys(quesDetails).length; i++) {
                    topicIdArr[questIdSize] = quesDetails[i]?.topic_id
                    conceptIdArr[questIdSize] = quesDetails[i]?.concept_id
                    conceptTypeIdArr[questIdSize] = quesDetails[i]?.concept_type_id
                    totalQuesArr[questIdSize] = quesDetails[i]?.total_question
                    questIdSize++
                }
            }
            let conceptDetails =  await getConceptDetails([subjectId])
            if(conceptDetails){
                for (let i = 0; i < Object.keys(conceptDetails).length; i++) {
                    let data = []
                    data['course_id'] =  conceptDetails[i]?.course_id
                    data['subject_id'] =  conceptDetails[i]?.subject_id
                    data['topic_id'] =  conceptDetails[i]?.topic_id
                    data['concept_id'] =  conceptDetails[i]?.concept_id
                    data['concept_name'] =  conceptDetails[i]?.concept_name
                    topicId =  conceptDetails[i]?.topic_id
                    conceptId = conceptDetails[i]?.concept_id
                    let conceptTypeDtl =  await  getConceptTypeDetails([])
                    if(conceptTypeDtl) {
                        for (let i = 0; i < Object.keys(conceptTypeDtl).length; i++) {
                            name =  conceptTypeDtl[i]?.name || ''
                            conceptTypeId =  conceptTypeDtl[i]?.concept_type_id || ''
                            conceptFor =  conceptTypeDtl[i]?.concept_for || ''

                        }
                    }

                    data['is_result'] =  isResult
                    data['concept_type_id'] =  conceptTypeId
                    data['concept_for'] =  conceptFor
                    data['name'] =  name
                    data['result_id'] =  ''
                    let totalQuestion = 0
                    for(let i = 0; i <questIdSize; i++ ){
                        if(topicIdArr[i] == topicId  && conceptIdArr[i] ==  conceptId && conceptTypeIdArr[i] ==  conceptTypeId ){
                            totalQuestion =  totalQuesArr[i]
                            break
                        }
                    }
                    data['total_question'] =  totalQuestion

                    let recordSessionDtlId
                    let assetId
                    let studyMaterialTitle
                    let assetPath
                    let sessionDtl =  await  getRecordSessionDetails([courseId,subjectId,topicId,conceptId])
                    if(sessionDtl){
                        recordSessionDtlId = sessionDtl?.id
                        studyMaterialTitle =  sessionDtl?.name
                        assetId =  sessionDtl?.asset_id

                    }
                    data['recorded_session_dtl_id'] =  recordSessionDtlId
                    data['study_material_title'] =  studyMaterialTitle
                    let assetDtl =  await getAssetDetails([assetId])
                    assetPath =  assetDtl?.asset_path
                    data['asset_path'] =  assetPath
                    data['asset_id'] =  assetId
                    let endTime = 0;
                    let videoLecDtl =  await  getVideoWatchStatus([courseId,subjectId,topicId,conceptId,assetId,userId])
                    if(videoLecDtl){
                        endTime =  videoLecDtl?.end_time
                    }

                    data['last_duration'] =  endTime
                    let worksheetCount =3
                    let userContentHisDtl =  await getUserContentHistory([subjectId,topicId,conceptId,userId,recordSessionDtlId])
                    let  is_view_recorded = ''
                    if(userContentHisDtl){
                        is_view_recorded = 'Y'
                    }
                    data['is_view_recorded'] =  is_view_recorded

                    response[i]= {...data}
                }
            }else{
                _404(res)
            }

            _200(res,response)
        }catch (e) {
           logger.error("getConceptList Error",e)
            _400(res)
        }

    }

    static  async getTopicWiseConcept  (req,res,next) {
        try {
            logger.info("getTopicWiseConcept request body", res?.body)
            let response = []

            let conceptTypes =  await getTopicConceptTypeList([])
            if(conceptTypes){
                for (let i = 0; i < Object.keys(conceptTypes).length; i++) {
                    let data = []
                    data['concept_type_id'] =  conceptTypes[i]?.concept_type_id
                    data['name'] =  conceptTypes[i]?.name
                    response[i] = {...data}
                }
            }else {
                _404(res,"Data not available")
            }
            _200(res,response)

        } catch (e) {
            logger.error("getTopicWiseConcept Error",e)
            _400(res)
        }
    }


    static  async  getConceptMstList(req,res,next){
        try {
            logger.info("getConceptMstList request body", res?.body)
            let response =[]
            let userId = req?.body?.user_id
            let courseId = req?.body?.course_id
            let subjectId = req?.body?.subject_id
            let topicId = req?.body?.topic_id
            let conceptId = req?.body?.concept_id
            let conceptTypeId = req?.body?.concept_type_id
            let contentId = req?.body?.content_id
            let syncType = req?.body?.sync_type
            let name
            let conceptFor

            let concept =  await getConceptListById([conceptId])
            if(concept){
                name =  concept?.name
                conceptFor =  concept?.concept_for

            }else {
               return  _404(res,"Data not available")
            }
            console.log("concept",conceptFor)
            if(conceptFor == 'DOC'){
                syncType =  syncType.toUpperCase()
                let contentDtl
                if(syncType == 'SINGLE') {
                    contentDtl = await getConceptDtl(syncType, [contentId])
                }else{
                    contentDtl = await getConceptDtl(syncType, [conceptTypeId,courseId,subjectId,topicId,conceptId])
                }
                console.log("contentDtl",contentDtl)
                let INSTRUCTIONS
                for(let i =0 ; i < Object.keys(contentDtl).length; i++){
                    let data = []
                    data['content_id'] = contentDtl[i]?.content_id
                    data['concept_type_id'] = contentDtl[i]?.concept_type_id
                    data['course_id'] = contentDtl[i]?.course_id
                    data['subject_id'] = contentDtl[i]?.subject_id
                    data['topic_id'] = contentDtl[i]?.topic_id
                    data['concept_id'] = contentDtl[i]?.concept_id
                    data['study_material_title'] = contentDtl[i]?.study_material_title
                    data['entry_type'] = contentDtl[i]?.entry_type
                    let assetId =  contentDtl[i]?.asset_id
                    let assetPath = ''
                    let assetDtl = await  getAssetDetails([assetId])
                    if(assetDtl){
                        assetPath =  assetDtl?.asset_path
                    }

                    if(syncType ==  'SINGLE'){

                        INSTRUCTIONS = (contentDtl[i]?.study_material_dtl) ? btoa(contentDtl[i]?.study_material_dtl) : ''
                    }else{
                        data['study_material_dtl'] =  ''
                    }
                        response[i] =  {...data}
                }

            }else{
                let quesDtl =  await  getConceptQuesDtl([subjectId,topicId,conceptId,conceptTypeId])
                for(let i =0 ; i < Object.keys(quesDtl).length; i++) {
                    let data = []
                    data['content_id'] = '1'
                    data['concept_type_id'] = quesDtl[i]?.concept_type_id
                    data['course_id'] = quesDtl[i]?.course_id
                    data['subject_id'] = quesDtl[i]?.subject_id
                    data['topic_id'] = quesDtl[i]?.topic_id
                    data['concept_id'] = quesDtl[i]?.concept_id
                    data['study_material_title'] =name
                    data['study_material_dtl'] = conceptFor
                    data['asset_path'] = ''
                    let resultId= ''
                    let resultDtl =  await getPracticeResult([userId,courseId,subjectId,topicId,conceptId,conceptTypeId])
                    if(resultDtl){
                        resultId =  resultDtl?.result_id
                    }
                    data['result_id'] =  resultId
                    response[i] =  {...data}
                }
            }
            _200(res,response)

        } catch (e) {
            logger.error("getConceptMstList Error",e)
            _400(res)
        }
    }

}