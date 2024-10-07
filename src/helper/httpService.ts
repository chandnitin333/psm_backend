import axios from 'axios';
import {logger} from '../logger/Logger';


export class httpService {

    static async axiosGetCall(apiUrl, header = null) {
        try {
            return await axios.get(apiUrl);
        } catch (err) {
            logger.error("axiosGetCall Error:: ", err)
            throw new Error(err)
        }
    }

    static async axiosPostCall(apiUrl,header=null,data= null) {
        try {
            return await axios.post(apiUrl, data);
        } catch (err) {
            logger.error("axiosGetCall Error:: ", err)
            throw new Error(err)
        }
    }
}