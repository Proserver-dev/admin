import axios from "axios";
import {getLoginToken, handleTokenRefreshError, reqRefreshLoginToken} from "./Auth";
import LocalStorageKeys from "../constants/LocalStorageKeys";
import RoutesPath from "../constants/RoutesPath";

const axiosWithToken = axios.create()

axiosWithToken.interceptors.request.use(
    (config) => {
        const token = getLoginToken();
        if (token) {
            config.headers[LocalStorageKeys.LOGIN_TOKEN] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosWithToken.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const token = await reqRefreshLoginToken()

                originalRequest.headers[LocalStorageKeys.LOGIN_TOKEN] = `${token}`;
                return axios(originalRequest);
            } catch (err) {
                return handleTokenRefreshError(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosWithToken;