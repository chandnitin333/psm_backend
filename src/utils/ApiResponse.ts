import { Response } from 'express';
import { DATA_KEY } from "../constants/constant";


export const _200 = (res: Response, msg: string = '', data: any = null,) => {
    var resData = {
        status: 200,
        message: msg,
    };
    if (data) {
        resData[DATA_KEY] = data
    }
    resData = { ...resData, ...data }
    return res.status(200).json(resData);
}

export const _202 = (res: Response, msg: string = '', data: any = null,) => {

    var resData = {
        status: 202,
        message: msg,
    };
    if (data) {
        resData[DATA_KEY] = data
    }
    resData = { ...resData, ...data }
    // console.log('resDatahere ====', resData)
    return res.status(202).json(resData);
}
export const _201 = (res: Response, msg = '', data = null,) => {

    var resData = {
        status: 201,
        message: msg,
    };
    if (data) {
        resData[DATA_KEY] = data
    }
    resData = { ...resData, ...data }
    return res.status(201).json(resData);
}
export const _500 = (res: Response, msg: string) => {

    var data = {

        status: 500,
        message: msg,
    };

    return res.status(500).json(data);
};
export const _404 = (res: Response, msg = 'No data Found') => {

    var data = {
        status: 404,
        message: msg || 'No Data Found..!',
    };
    return res.status(404).json(data);
};
export const _400 = (res: Response, msg: string = '') => {

    var resData = {
        status: 400,
        message: msg || 'Something went wrong',

    };

    return res.status(400).json(resData);
};
export const _401 = (res: Response, msg: string = '') => {
    var data = {
        status: 401,
        message: msg || 'Unauthorized',
    };
    return res.status(401).json(data);
}
export const _402 = (res: Response, msg = '') => {


    var data = {
        status: 402,
        message: msg || 'Something went wrong',
    };
    return res.status(402).json(data);
}
export const _408 = (res: Response, msg = '') => {

    var data = {
        status: 408,
        message: msg || 'Something went wrong',
    };
    return res.status(408).json(data);
}
export const _403 = (res: Response, msg = '') => {

    var data = {
        status: 403,
        message: msg || 'Something went wrong',
    };
    return res.status(403).json(data);
}
