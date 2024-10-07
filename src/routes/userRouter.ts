import { Router } from "express";
import { body } from 'express-validator';
import { UserController } from "../controllers/userController";
import { GlobalMiddleware } from "../middleware/GlobalMiddleware";
import { AuthController } from "../controllers/authController";
import { upload } from "../config/Multer";

export class userReoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.deleteRoute();
        this.putRoute();
    }


    getRoutes() {

        // this.router.get('/signup',UserValidator.validSignUp(),GlobalMiddleware.checkError,UserController.signUp);
        // this.router.get('/tutorials', TuterialController.getTuterial);

        // this.router.get('/tutorials/:id', TuterialController.getTutDetailsById);

        // this.router.get('/country', Country.fetchCountries)


    }


    postRoutes() {
        this.router.post('/login', UserController.login);
        this.router.post('/resent-otp', GlobalMiddleware.authenticate, UserController.resentOpt);
        this.router.post('/verify-otp', GlobalMiddleware.authenticate, UserController.verifyOtp);
        this.router.post('/change-password', GlobalMiddleware.authenticate, UserController.changePassword);
        this.router.post('/forgot-password', GlobalMiddleware.authenticate, AuthController.forgotPassword);
        this.router.post('/update-profile', upload.array("mediafile"), GlobalMiddleware.authenticate, UserController.updateProfile);
        // this.router.post('/signup', UserValidator.validSignUp(), GlobalMiddleware.checkError, UserController.signUp);
        // this.router.post('/post', uploa    d.array("mediafile"), UserValidator.postVerify(), GlobalMiddleware.checkError, PostController.newPost);

    }

    deleteRoute() {

    }
    putRoute() {


    }
}


export default new userReoutes().router;