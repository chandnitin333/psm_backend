


import { executeQuery } from "../config/db/db";
import { EMAIL } from "../constants/constant";
import { logger } from "../logger/Logger";




/**
 * @function  getUserDetails use for fetch user details
 * @param params 
 * @returns 
 */

export const getUserDetails = async (params: object) => {
    try {
        let sql = `
            SELECT DISTINCT 
                u.id, u.*, 
                c.name AS country_name, 
                s.name AS state_name, 
                bm.board_name, 
                sm.name AS std_name, 
                ua.password, 
                ua.password_changed, 
                ur.role 
            FROM user u
            INNER JOIN countries c ON c.id = u.country_id 
            INNER JOIN states s ON s.id = u.state_id 
            LEFT JOIN board_mst bm ON bm.board_id = u.board_id 
            LEFT JOIN std_mst sm ON sm.std_id = u.std_id 
            INNER JOIN user_authentication ua ON ua.user_id = u.id 
            INNER JOIN user_role ur ON ur.user_id = u.id 
            WHERE 
                c.status = 'ENABLE' 
                AND s.status = 'ENABLE' 
                AND bm.status = 'ENABLE' 
                AND (u.email = ? OR u.mobile = ?) 
                AND u.is_deleted = 0
        `;
        return executeQuery(sql, params).then(result => {
            return result ? result[0] : null;
        }).catch(error => {
            console.error("checkUserAuth Fetch Data Error: ", error);
            return null;
        });   } catch (error) {
        logger.error("checkUserAuth :: ", error)
        throw new Error(error)
    }
}

/**
 * @function getUserBatch use for fet batch details
 * @param params 
 * @returns 
 */

export const getUserBatch = async (params: object) => {
    try {

        return executeQuery("SELECT allo.batch_id,bat.batch_name FROM `faculty_batch_allocation` allo,batches_mst bat WHERE allo.faculty_id =? AND allo.batch_id = bat.batch_id AND allo.status = 'ENABLE' AND allo.is_deleted = 0 AND bat.status = 'ENABLE' AND bat.is_deleted = 0", params).then(result => {
            return (result) ? result[0] : null;
        }).catch(error => {
            console.error("getUserBatch Fetch Data Error: ", error);
            return null;
        });
    } catch (error) {
        logger.error("getUserBatch :: ", error)
        throw new Error(error)
    }
}


export const checkOtpValidate = async (type: string, params: object) => {
    let otpfield = (type == EMAIL) ? 'otp_email' : 'otp_mobile';
    let sql = `SELECT * FROM user_otp_authentication where user_id =? and ${otpfield} = ?  and is_deleted = 0`;

    return executeQuery(sql, params).then(result => {
        
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("getUserBatch Fetch Data Error: ", error);
        return null;
    });

}

/**
 * 
 * @param type 
 * @param params  passing current email validate, timestamp , user id and otp
 * @returns 
 */
export const updateLoginTime = async (type: string, params: object) => {

    let otpfield = (type == EMAIL) ? 'otp_email' : 'otp_mobile';
    let sql = `UPDATE user_otp_authentication SET email_validate= ? ,email_validation_time = ?  WHERE user_id = ? and ${otpfield} = ? and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        logger.info("updateLoginTime success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateLoginTime Update Error: ", error);
        return null;
    });


}

export const updateDeviceId = async (params: object) => {
    let sql = "UPDATE user SET device_id = ? WHERE id = ?  and is_deleted = 0 ";
    return executeQuery(sql, params).then(result => {
        logger.info("Update device id  success", result)
        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateDeviceId Update Error: ", error);
        return null;
    });
}


export const updateSessionData = async (params: object) => {
    let sql = `UPDATE user SET session_id= '',activated_date= ?,is_login= 1,fcm_id = ? WHERE id = ?`
    return executeQuery(sql, params).then(result => {
        logger.info("Update device id  success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateSessionData Update Error: ", error);
        return null;
    });
}


export const userAppData = async (params: object) => {
    let sql = `UPDATE user SET app_version= ? ,app_code=? WHERE id =? AND is_deleted = 0`

    return executeQuery(sql, params).then(result => {
        logger.info("Update device id  success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("userAppData Update Error: ", error);
        return null;
    });
}


export const addLoginAttempt = async (params: object) => {
    let sql = `INSERT INTO login_attempt( user_id,device_id,login_time,platform,device,app_version,app_code,user_role,ip_address) VALUES(?,?, ?,'A',?,?,?,?,?)`

    return executeQuery(sql, params).then(result => {
        logger.info("addLoginAttempt  success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("addLoginAttempt Update Error: ", error);
        return null;
    });
}


export const getUserDetailsByType = async (type: string, params: object) => {
    let otpfield = (type == EMAIL) ? 'u.email =?' : 'u.country_code = ? and u.mobile= ?';
    let sql = `SELECT u.* , ur.role from user u INNER JOIN user_role ur ON ur.user_id = u.id WHERE ${otpfield} and u.is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
       
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("getUserDetailsByType Fetch Data Error: ", error);
        return null;
    });

}

export const addNewOtpEntry = async (params: object) => {

    let sql = `INSERT INTO user_otp_authentication( user_id,otp_email,otp_mobile) VALUES(?,?,?)`;
    return executeQuery(sql, params).then(result => {
        logger.info("addNewOtpEntry  success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("addNewOtpEntry Update Error: ", error);
        return null;
    });
}

export const getUserOtpAuth = async (params: object) => {

    let sql = `SELECT * FROM user_otp_authentication where user_id =?  and is_deleted = 0`;

    return executeQuery(sql, params).then(result => {
       
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("getUserOtpAuth Fetch Data Error: ", error);
        return null;
    });

}

export const getSignupUser = async (type: string, params: object) => {
    let otpfield = (type == EMAIL) ? 'email = ?' : 'mobile = ?';
    let sql = `SELECT * FROM signup_user where ${otpfield} and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("getSignupUser Fetch Data Error: ", error);
        return null;
    });

}

export const updateNewOtp = async (type: string, params: object) => {

    let otpfield = (type == EMAIL) ? 'otp_email' : 'otp_mobile';
    let sql = `UPDATE user_otp_authentication SET ${otpfield} = ?  WHERE user_id = ? and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        logger.info("updateLoginTime success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateLoginTime Update Error: ", error);
        return null;
    });

}


export const getAuthenticateDetails = async (params: object) => {

    let sql = `SELECT * FROM user_authentication where user_id =?  and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
       
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("getAuthenticateDetails Fetch Data Error: ", error);
        return null;
    });

}

export const isExistUser = async (params: object) => {

    let sql = `SELECT u.* , ur.role from user u INNER JOIN user_role ur ON ur.user_id = u.id where u.id =?  and u.is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("isExistUser Fetch Data Error: ", error);
        return null;
    });

}

export const getAccessTokenOrUpdate = async (params: object) => {
    let sql = `SELECT * from oauth_access_tokens WHERE user_id = ? order by expires desc limit 1`;
    return executeQuery(sql, params).then(result => {
        return (result) ? result[0] : null;
    }).catch(error => {
        logger.error("isExistUser Fetch Data Error: ", error);
        return null;
    });
}

export const updateUserStatus = async (params: object) => {

    let sql = `UPDATE user SET user_status= ? WHERE id =?  and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        logger.info("updateUserStatus success", result)
        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateUserStatus Update Error: ", error);
        return null;
    });

}


export const updateUserRegistrationStatus = async (params: object) => {

    let sql = `UPDATE user_registration SET user_status= ? WHERE user_id =?  and is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        logger.info("updateUserRegistrationStatus success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateUserRegistrationStatus Update Error: ", error);
        return null;
    });

}

export const updatePassword = async (params: object) => {

    let sql = `UPDATE user_authentication SET password= ? ,password_changed = ?, modified_by = ?  WHERE user_id = ? `;
    return executeQuery(sql, params).then(result => {
        logger.info("updateUserRegistrationStatus success", result)

        return (result) ? result : null;
    }).catch(error => {
        logger.error("updateUserRegistrationStatus Update Error: ", error);
        return null;
    });

}


export const addNewPassword = async (params: object) => {

    let sql = `INSERT INTO user_authentication(user_id, password,password_changed,is_deleted,modified_date,modified_by) VALUES(?,?,?,?,?,?)`;
    return executeQuery(sql, params).then(result => {
        logger.info("addNewPassword success", result)
        return (result) ? result : null;
    }).catch(error => {
        logger.error("addNewPassword  Error: ", error);
        return null;
    });

}

export const updateProfilePhoto = async (params: Object) => {
    let sql = `UPDATE user SET profile_photo = ?  WHERE id=? AND is_deleted = 0`;
    return executeQuery(sql, params).then(result => {
        logger.info("addNewPassword success", result)
        return (result) ? result : null;
    }).catch(error => {
        logger.error("addNewPassword  Error: ", error);
    })

}