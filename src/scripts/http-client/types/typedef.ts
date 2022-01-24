import { AxiosInstance, AxiosRequestHeaders } from 'axios';
import { FetchHttpClient } from '../../fetch-http-client/fetch-http-client';
import { AxiosResponse } from 'axios';
import { FetchResponse } from '../../fetch-http-client/fetch-http-client-types';

export type HttpClientInstance = AxiosInstance | FetchHttpClient;

export type ResponseType = FetchResponse | AxiosResponse;

export interface MethodOptions<T> {
  headers?: {};
  body?: T;
}

export interface HttpClientOptions {
  customHeaders?: AxiosRequestHeaders;
}
