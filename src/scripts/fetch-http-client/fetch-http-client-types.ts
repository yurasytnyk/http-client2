import { Method } from "../http-client/enums/enums";
import { FetchInterceptor } from "../utils/fetch-interceptors/fetch-interceptors.types";

export type FetchResponseHeaders = Record<string, string> & {
  "set-cookie"?: string[]
};

type RecordFetch<K extends keyof any, T> = {
  [P in K]: T;
};

export type FetchRequestHeaders = RecordFetch<string, string>;

export interface RequestConfig {
  url?: string;
  method?: Method;
  headers?: Record<string, string>;
  data?: BodyInit | {};
  params?: Record<string, string>;
}

export interface FetchResponse<T = any> {
  status: number;
  statusText: string;
  headers: FetchResponseHeaders,
  config: RequestConfig;
  data: T;
  request?: any;
}

export interface FetchInterceptorsService {
  register: (interceptor: FetchInterceptor) => () => void;
  clear: () => void;
}
