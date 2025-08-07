// utils/axios.ts
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

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

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async request<T>(endpoint: ApiEndpoint): Promise<T> {
    const config: AxiosRequestConfig = {
      method: endpoint.method,
      url: endpoint.url,
      headers: endpoint.headers,
    };

    if (endpoint.method === HttpMethod.get) {
      config.params = endpoint.params;
    } else {
      config.data = endpoint.body;
    }

    const res = await this.client.request<T>(config);
    return res.data;
  }
}
