import { AxiosInstance } from "axios";
import { FetchHttpClient } from "../../fetch-http-client/fetch-http-client";

export const getAxiosInstance = (client: AxiosInstance | FetchHttpClient): client is AxiosInstance => {
  return (client as AxiosInstance).interceptors !== undefined;
};