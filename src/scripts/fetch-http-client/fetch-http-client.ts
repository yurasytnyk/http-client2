import { UrlParser } from '../utils/url-parser/url-parser';
import { FetchResponse, RequestConfig } from './fetch-http-client-types';

export class FetchHttpClient {
  private config: RequestConfig;
  private baseURL: string;
  private controller: AbortController;

  constructor(baseURL?: string, config?: RequestConfig) {
    this.baseURL = baseURL;
    this.config = config;
    this.controller = new AbortController();
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

  private controllerDelay() {
    setTimeout(() => {
      const aborted = this.getController.signal.aborted;

      if (aborted) {
        this.setController = new AbortController();
      }
    }, 1000);
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
      this.controllerDelay();
      
      const res = await fetch(requestConfig);
      const data = await res.json();

      return {
        status: res.status,
        statusText: res.statusText,
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
