import { UrlParser } from '../utils/url-parser/url-parser';
import { FetchResponse, RequestConfig } from './fetch-http-client-types';

export class FetchHttpClient {
  private config: RequestConfig;
  private baseURL: string;

  constructor(baseURL?: string, config?: RequestConfig) {
    this.baseURL = baseURL;
    this.config = config;
  }

  set setBaseURL(value: string) {
    this.baseURL = value;
  }

  set setConfig(value: RequestConfig) {
    this.config = value;
  }

  async request(config: RequestConfig): Promise<FetchResponse> {
    const url = UrlParser.parseUrlWithParams(this.baseURL, config);

    const requestConfig = new Request(url, {
      method: config.method,
      headers: this.config.headers,
      body: JSON.stringify(config.data),
    });

    try {
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
