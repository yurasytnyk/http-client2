import {
  Fetch,
  FetchInterceptor,
  FetchInterceptorResponse,
} from './fetch-interceptors.types';

export class FetchClientInterceptors {
  private interceptors: FetchInterceptor[];

  constructor(interceptors: FetchInterceptor[] = []) {
    this.interceptors = interceptors;
  }

  private interceptor = (fetch: Fetch, ...args: any) => {
    const reversedInterceptors = this.interceptors.reduce((array, interceptor) => {
      return [interceptor].concat(array);
    }, []);
    let promise = Promise.resolve(args);
  
    reversedInterceptors.forEach(({ request, requestError }) => { // <-- process request interceptors
      if (request || requestError) {
        promise = promise.then((args) => request(...args), requestError);
      }
    });
  
    promise = promise.then((args: [any]) => { // <-- set proper type instead of any
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

  public fetchIntercept = () => { // <-- function for overriding native fetch function
    const { fetch: origFetch } = window;
  
    window.fetch = ((fetch) => { // <-- override function with IIFE
      return (...args) => {
        return this.interceptor(fetch, ...args); // <-- pass fetch from closure and url with config in rest params
      };
    })(origFetch);
  
    return {
      register: (interceptor: FetchInterceptor) => { // <-- when fetchIntercept is invoke with register method pass object for different
        this.interceptors.push(interceptor);                    // cases such as request, requestError, response, responseError
  
        return () => {
          const index = this.interceptors.indexOf(interceptor);
  
          if (index >= 0) {
            this.interceptors.splice(index, 1);
          }
        };
      },
      clear: function () {
        this.interceptors = [];
      },
    };
  };
}

export const unregister = new FetchClientInterceptors().fetchIntercept().register({
  request(url, config) {
    return [url, config];
  },
  requestError(error) {
    return Promise.reject(error);
  },
  response(response) {
    return response;
  },
  responseError(error) {
    return Promise.reject(error);
  }
});
