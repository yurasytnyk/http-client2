import {
  Fetch,
  FetchInterceptor,
  FetchInterceptorResponse,
} from './fetch-interceptors.types';

export class FetchClientInterceptors {
  private static interceptors: FetchInterceptor[] = [];

  private static interceptor = (fetch: Fetch, ...args: any): Promise<any> => {
    const reversedInterceptors = FetchClientInterceptors.interceptors.reduce((array, interceptor) => {
      return [interceptor].concat(array);
    }, []);
    let promise = Promise.resolve(args);
  
    reversedInterceptors.forEach(({ request, requestError }) => { // <-- process request interceptors
      if (request || requestError) {
        promise = promise.then((args) => request(...args), requestError);
      }
    });
  
    promise = promise.then((args: [any]) => { // <-- if interceptors not provided than work like native fetch api
      const request = new Request(...args);
  
      return fetch(request)
        .then((response: FetchInterceptorResponse) => {
          response.request = request;
          return response;
        })
        .catch((error: any) => {
          error.request = request;
          return Promise.reject(error);
        });
    });
  
    reversedInterceptors.forEach(({ response, responseError }) => { // <-- process response interceptors
      if (response || responseError) {
        promise = promise.then(response, responseError);
      }
    });
  
    return promise;
  }

  public static get fetchIntercept() {
    const { fetch: origFetch } = window;
  
    window.fetch = ((fetch) => { // <-- override fetch with IIFE
      return (...args) => {
        return FetchClientInterceptors.interceptor(fetch, ...args);
      };
    })(origFetch);
  
    return {
      register: (interceptor: FetchInterceptor) => { // <-- when fetchIntercept is invoke with register method pass object for different
        FetchClientInterceptors.interceptors.push(interceptor);         // cases such as request, requestError, response, responseError
  
        return () => {
          const index = FetchClientInterceptors.interceptors.indexOf(interceptor);
  
          if (index >= 0) {
            FetchClientInterceptors.interceptors.splice(index, 1);
          }
        };
      },
      clear: () => {
        FetchClientInterceptors.interceptors = [];
      },
    };
  };
}

