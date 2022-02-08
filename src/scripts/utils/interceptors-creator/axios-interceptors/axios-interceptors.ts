import { AxiosInstance } from "axios";

export class AxiosClientInterceptors {
  public static setRequestInterceptor(instance: AxiosInstance) {
    const requestInterceptor = instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return requestInterceptor;
  }

  public static setResponseInterceptor(instance: AxiosInstance) {
    const responseInterceptor = instance.interceptors.response.use(
      (config) => {
        return config;
      },
      async (error) => {
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config;

        if (status === 401 && error.config && !originalRequest.isRetry) {
          originalRequest.isRetry = true;

          try {
            const response = 'QpwL5tke4Pnpja7X4'; // <-- make api call to get valid token
            localStorage.setItem('token', response);

            return instance.request(originalRequest);
          } catch (error) {
            console.log('User is not authorized');
          }
        }

        throw new Error(error);
      }
    );

    return responseInterceptor;
  }
}
