import { FetchClientInterceptors } from '../utils/fetch-interceptors/fetch-interceptors';
import { UrlParser } from '../utils/url-parser/url-parser';
import { FetchInterceptorsService, FetchResponse, RequestConfig } from './fetch-http-client-types';

export class FetchHttpClient {
  private config: RequestConfig;
  private baseURL: string;
  private controller: AbortController;
  private interceptorsService: FetchInterceptorsService;

  constructor(baseURL?: string, config?: RequestConfig) {
    this.baseURL = baseURL;
    this.config = config;
    this.controller = new AbortController();
    this.interceptorsService = FetchClientInterceptors.fetchIntercept;
  }

  get getController() {
    return this.controller;
  }

  set setController(value: AbortController) {
    this.controller = value;
  }

  set setBaseURL(value: string) {
    this.baseURL = value;
  }

  set setConfig(value: RequestConfig) {
    this.config = value;
  }

  private setControllerOnAbort() {
    setTimeout(() => {
      const aborted = this.getController.signal.aborted;

      if (aborted) {
        this.setController = new AbortController();
      }
    }, 1000);
  }

  public clearInterceptors() {
    this.interceptorsService.clear();
  }

  async request(config: RequestConfig): Promise<FetchResponse> {
    const url = UrlParser.parseUrlWithParams(this.baseURL, config);

    const requestConfig = new Request(url, {
      method: config.method,
      headers: this.config.headers,
      body: JSON.stringify(config.data),
      signal: this.controller.signal,
    });

    try {
      this.setControllerOnAbort();
      
      this.interceptorsService.register({
        request(url, config) {
          return [url, config];
        },
        requestError(error) {
          return Promise.reject(error);
        },
        response(response) {
          if (response.status) {
            console.log('hello from error');
          }
      
          return response;
        },
        responseError(error) {
          return Promise.reject(error);
        }
      });
      
      const response = await fetch(requestConfig);
      const data = await response.json();

      return {
        status: response.status,
        statusText: response.statusText,
        headers: config.headers,
        config,
        data,
        request: requestConfig,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
