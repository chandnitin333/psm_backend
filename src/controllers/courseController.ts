import { logger } from "../logger/Logger";
import { getCourseList } from "../services/courseService"
import { _200, _400, _404 } from "../utils/ApiResponse"
export class courseController {



    static getAllCourses = async (req, res, next) => {
        let response = {};
        try {
            logger.info("getAllCourses  request body:: ", req.body)
            let userId = req?.body?.user_id
            if (userId) {
                let courseList = await getCourseList([userId])


                if (courseList) {
                  
                    response['id'] = courseList.id
                    response['name'] = courseList?.course_name
                    response['description'] = courseList?.description
                    response['category'] = courseList?.course_category_id
                    response['type'] = courseList?.type
                    response['class'] = courseList?.std_id
                    response['is_deleted'] = courseList?.is_deleted
                    _200(res, [response])

                } else {

                    _404(res)
                }
            } else {
                _400(res, 'user id is mandatory')
            }
        } catch (err) {
            logger.error("getAllCourses Error :: ", err)
            _400(res, err.message)
        }


    }

}