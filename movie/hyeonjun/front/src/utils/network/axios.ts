// utils/axios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenStore } from '../auth/token.store';

export enum HttpMethod {
  get = 'GET',
  post = 'POST',
  put = 'PUT',
  delete = 'DELETE',
}

export interface ApiEndpoint<P = unknown, B = unknown> {
  method: HttpMethod;
  url: string;
  params?: P;
  body?: B;
  headers?: Record<string, string>;
}

export interface ApiClientOptions {
  baseURL: string;
  withCredentials?: boolean;
  timeoutMs?: number;
  useAccessToken?: boolean;
  onUnauthorized?: () => Promise<void>;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(options: ApiClientOptions) {
    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeoutMs || 10000,
      withCredentials: options.withCredentials || false,
    });

    if (options.useAccessToken) {
      this.client.interceptors.request.use(config => {
        const token = tokenStore.get();
        if (token) {
          const newConfig = { ...config };

          if (!newConfig.headers['Authorization']) {
            newConfig.headers.Authorization = `Bearer ${token}`;
          }

          return newConfig;
        }
        return config;
      });

      this.client.interceptors.response.use(
        response => response,
        async error => {
          if (error.response?.status === 401 && options.onUnauthorized) {
            await options.onUnauthorized();
          }
          return Promise.reject(error);
        }
      );
    }
  }

  async request<T>(endpoint: ApiEndpoint): Promise<T> {
    const config: AxiosRequestConfig = {
      method: endpoint.method,
      url: endpoint.url,
      params: endpoint.params,
      headers: endpoint.headers,
      data: endpoint.body,
    };

    return (await this.client.request<T>(config)).data;
  }
}
