import { FetchRequestHeaders } from '../fetch-http-client/fetch-http-client-types';
import { UrlParser } from '../utils/url-parser/url-parser';
import { getClientInstance } from '../utils/get-client-instance/get-client-instance';
import { HTTP_METHODS, Method } from './enums/enums';
import { HttpClientInstance } from './types/typedef';
import { HttpClientOptions } from './types/typedef';
import { MethodOptions } from './types/typedef';
import { ResponseType } from './types/typedef';
import { getAxiosInstance } from '../utils/type-checkers/type-checkers';

export class HttpClient {
  private baseURL: string = '';
  private client: HttpClientInstance;
  private options: HttpClientOptions;
  private customHeaders: FetchRequestHeaders = {};

  constructor(baseURL: string, client: HttpClientInstance, options: HttpClientOptions = {}) {
    this.baseURL = baseURL;
    this.options = options;
    this.customHeaders = options.customHeaders;
    this.client = getClientInstance(client, this.baseURL);
  }

  public get<T>(
    url: string,
    options?: MethodOptions<T>
  ): Promise<ResponseType> {
    return this.invoke<T>(url, HTTP_METHODS.GET, options);
  }

  public post<T>(
    url: string,
    options?: MethodOptions<T>
  ): Promise<ResponseType> {
    return this.invoke<T>(url, HTTP_METHODS.POST, options);
  }

  public put<T>(
    url: string,
    options?: MethodOptions<T>
  ): Promise<ResponseType> {
    return this.invoke<T>(url, HTTP_METHODS.PUT, options);
  }

  public delete<T>(
    url: string,
    options?: MethodOptions<T>
  ): Promise<ResponseType> {
    return this.invoke<T>(url, HTTP_METHODS.DELETE, options);
  }

  public setCustomHeaders(headers: FetchRequestHeaders) {
    this.customHeaders = headers;

    return this;
  }

  public async settleRequests<T>(promises: Promise<T>[]) {
    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter((result): result is PromiseFulfilledResult<Awaited<T>> => {
      return result.status === 'fulfilled';
    });

    if (!fulfilled.length) {
      const error = results.find((result): result is PromiseRejectedResult => {
        return result.status === 'rejected';
      });

      throw new Error(error.reason.message);
    }

    return fulfilled.map((data) => data.value);
  }

  public clearInterceptors() {
    if (!getAxiosInstance(this.client)) {
      this.client.clearInterceptors(); // <-- don't forget about axios interceptors
    }
  }

  private async invoke<T>(
    url: string,
    method: Method,
    options: MethodOptions<T> = {}
  ): Promise<ResponseType> {
    const { headers, body } = options;

    if (headers) {
      this.setCustomHeaders(headers);
    }

    try {
      const processedParams = UrlParser.parseData(window.location.search);

      const req = {
        method,
        url,
        headers: this.customHeaders,
        params: processedParams,
        data: body
      };

      const { data }: ResponseType = await this.client.request(req);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
