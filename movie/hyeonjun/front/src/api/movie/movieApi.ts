import { ApiClient, HttpMethod, type ApiEndpoint } from '../../utils/network/axios';
import { type MovieDetail, type MovieResponse } from '../../types/movie';

const client = new ApiClient({
  baseURL: 'https://api.themoviedb.org/3',
});

export const getPopularMovies = async (page: number): Promise<MovieResponse> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.get,
    url: 'movie/popular',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
    params: {
      language: 'ko-KR',
      page: page,
    },
  };

  return await client.request(endpoint);
};

export const getDetailMovie = async (movieId?: string): Promise<MovieDetail> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.get,
    url: `movie/${movieId}`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
    params: {
      language: 'ko-KR',
    },
  };

  return await client.request(endpoint);
};

export const getSearchMovie = async (keyword: string, page: number = 1): Promise<MovieResponse> => {
  const endPoint: ApiEndpoint = {
    method: HttpMethod.get,
    url: `search/movie`,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
    params: {
      query: keyword,
      language: 'ko-KR',
      page: page,
    },
  };

  return await client.request(endPoint);
};
