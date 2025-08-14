import { signUpApi, singInApi } from '../api/auth/authApi';
import { tokenStore } from '../utils/auth/token.store';

export const signInUseCase = async (email: string, password: string) => {
  const result = await singInApi(email, password);
  tokenStore.set(result.accessToken);
};

export const signUpUseCase = async (name: string, email: string, password: string) => {
  await signUpApi(name, email, password);
};
