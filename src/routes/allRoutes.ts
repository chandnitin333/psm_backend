import { Router } from "express";
import { conceptController } from "../controllers/conceptController";
import { lecturesController } from "../controllers/lecturesController";
import { questionController } from "../controllers/questionController";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";


export class allRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.postRoutes();
    }

    postRoutes() {
        this.router.post('/user-get-course-sub-topic-lecture', GlobalMiddleware.authenticate, lecturesController.getLecturesList);
        this.router.post('/user_get_course_sub_topic_lecture_step', GlobalMiddleware.authenticate, lecturesController.getLectureStep);
        this.router.post('/get_question_hint_list', questionController.getQuestionHint);// GlobalMiddleware.authenticate,
        this.router.post('/user_get_course_topic_lecture_step_result', GlobalMiddleware.authenticate, lecturesController.getLectureStepResult);
        this.router.post('/get-concept-list', GlobalMiddleware.authenticate, conceptController.getConceptList);
        // this.router.post('/user_get_sub_topic_concept', GlobalMiddleware.authenticate, conceptController.getTopicWiseConcept);
        this.router.post('/user_get_sub_topic_concept_list', GlobalMiddleware.authenticate, conceptController.getConceptMstList);
        this.router.post('/user_get_sub_topic_concept', conceptController.getTopicWiseConcept);


    }


}


export default new allRoutes().router;