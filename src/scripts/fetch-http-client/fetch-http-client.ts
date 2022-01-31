import { FetchClientInterceptors } from '../utils/fetch-interceptors/fetch-interceptors';
import { FetchInterceptor } from '../utils/fetch-interceptors/fetch-interceptors.types';
import { UrlParser } from '../utils/url-parser/url-parser';
import {
  FetchInterceptorsService,
  FetchResponse,
  RequestConfig,
} from './fetch-http-client-types';

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

  public get getController() {
    return this.controller;
  }

  public set setController(value: AbortController) {
    this.controller = value;
  }

  public set setBaseURL(value: string) {
    this.baseURL = value;
  }

  public set setConfig(value: RequestConfig) {
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

  public registrateInterceptors(config: FetchInterceptor) {
    this.interceptorsService.register(config);
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
