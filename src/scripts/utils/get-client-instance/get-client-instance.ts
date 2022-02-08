import axios from 'axios';
import { HttpClientInstance } from '../../http-client/types/typedef';
import { getAxiosInstance } from '../type-checkers/type-checkers';

export const getClientInstance = (
  client: HttpClientInstance,
  baseURL?: string
) => {
  if (getAxiosInstance(client)) {
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return instance;
  } else {
    client.setBaseURL = baseURL;

    client.setConfig = {
      url: baseURL,
      headers: { 'Content-Type': 'application/json' },
    };

    return client;
  }
};
