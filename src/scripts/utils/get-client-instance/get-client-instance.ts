import axios from "axios";
import { HttpClientInstance } from "../../http-client/types/typedef";
import { getAxiosInstance } from "../type-checkers/type-checkers";

export const getClientInstance = (client: HttpClientInstance) => {
  if (getAxiosInstance(client)) {
    const instance = axios.create({
      baseURL: '', // <-- don't forget
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  
    instance.interceptors.response.use((config) => {
        return config;
      }, async (error) => {
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config;
  
        if (status === 401 && error.config && !originalRequest.isRetry) {
          originalRequest.isRetry = true;
  
          try {
            const response = "QpwL5tke4Pnpja7X4"; // <-- make api call to get valid token
            
            localStorage.setItem('token', response);
  
            return instance.request(originalRequest);
          } catch (error) {
            console.log('User is not authorized');
          }
        }
  
        throw new Error(error);
      }
    );

    return instance;
  } else {
    return client;
  }
}