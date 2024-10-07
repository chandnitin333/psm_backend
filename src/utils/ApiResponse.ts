

export const _200 = (res, data = null, msg = '', dataKey = 'data') => {
    var resData = {
        status: 200,
        SUCCESS: 1,
        message: msg,
    };
    if (data) {
        resData[dataKey] = data
    }
    return res.status(200).json(resData);
}

export const _202 = (res, data = null, msg = '', dataKey = 'data') => {
    var resData = {
        status: 202,
        SUCCESS: 1,
        message: msg,
    };
    if (data) {
        resData[dataKey] = data
    }
    return res.status(202).json(resData);
}

export const _201 = (res, data = null, msg = '', dataKey = 'data') => {
    var resData = {
        status: 201,
        SUCCESS: 1,
        message: msg,
    };
    if (data) {
        resData[dataKey] = data
    }
    return res.status(201).json(resData);
}

export const _500 = (res, msg) => {
    var data = {
        SUCCESS: 0,
        status: 500,
        message: msg,
    };
    return res.status(500).json(data);
};

export const _404 = (res, msg = 'No data Found') => {
    var data = {
        status: 404,
        SUCCESS: 0,
        message: msg || 'No Data Found..!',
    };
    return res.status(404).json(data);
};

export const _400 = (res, msg = '') => {
    var resData = {
        status: 400,
        SUCCESS: 0,
        message: msg || 'Something went wrong',

    };
    return res.status(400).json(resData);
};

export const _401 = (res, msg = '') => {

    var data = {
        status: 401,
        SUCCESS: 0,
        message: msg || 'Unauthorized',
    };
    return res.status(401).json(data);
};

export const _402 = (res, msg = '') => {

    var data = {
        status: 402,
        SUCCESS: 0,
        message: msg || 'Something went wrong',
    };
    return res.status(402).json(data);
};
export const _408 = (res, msg = '') => {
    var data = {
        status: 408,
        SUCCESS: 0,
        message: msg || 'Something went wrong',
    };
    return res.status(408).json(data);
}

export const _403 = (res, msg = '') => {
    var data = {
        status: 403,
        SUCCESS: 0,
        message: msg || 'Something went wrong',
    };
    return res.status(403).json(data);
}
