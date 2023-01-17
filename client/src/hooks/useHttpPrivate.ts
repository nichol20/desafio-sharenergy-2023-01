import { AxiosHeaders } from "axios";
import { useContext, useEffect } from "react";

import { http } from "../utils/http";
import { AuthContext } from "../contexts/AuthContext";
import { UseHttpPrivate } from "../types/hooks";

interface CommonHeaderProperties extends AxiosHeaders {
    Authorization?: string
}

export const useHttpPrivate: UseHttpPrivate = () => {
    const { refresh, user } = useContext(AuthContext)

    useEffect(() => {
        const requestIntercept = http.interceptors.request.use(
            config => {
                if(!(config.headers as CommonHeaderProperties)?.Authorization) {
                    (config.headers as CommonHeaderProperties).Authorization = `Bearer ${user?.accessToken}`
                } 
                return config
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = http.interceptors.response.use(
            response => response,
            async error => {
                const prevRequest = error?.config
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refresh()
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return http(prevRequest)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            // Remove interceptors
            http.interceptors.request.eject(requestIntercept)
            http.interceptors.response.eject(responseIntercept)
        }
    }, [user, refresh])

    return http
}
