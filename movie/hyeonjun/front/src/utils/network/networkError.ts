import { AxiosError } from 'axios';

export interface NetworkError {
  status: number;
  message: string;
}

export function parseNetworkError(error: any): NetworkError {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data.message,
    };
  } else {
    return {
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}
