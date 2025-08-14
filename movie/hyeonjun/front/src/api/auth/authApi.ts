import { SignUpResultDto, type SignInResDto } from '../../types/auth.type';
import { ApiClient, HttpMethod, type ApiEndpoint } from '../../utils/network/axios';

const client = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/auth',
  withCredentials: false,
});

export const signUpApi = async (
  name: string,
  email: string,
  password: string
): Promise<SignUpResultDto> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.post,
    url: '/signup',
    body: {
      name,
      email,
      password,
    },
  };

  return await client.request(endpoint);
};

export const singInApi = async (email: string, password: string): Promise<SignInResDto> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.post,
    url: '/signin',
    body: {
      email,
      password,
    },
  };

  return await client.request(endpoint);
};
