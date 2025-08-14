import type { BookmarkResDto, IsBookmarkedResDto } from '../../types/bookmarks.type';
import { ApiClient, HttpMethod, type ApiEndpoint } from '../../utils/network/axios';

const client = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/bookmarks',
  useAccessToken: true,
});

export const addBookmarkApi = async (movieId: string): Promise<void> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.post,
    url: '/add',
    body: {
      movieId,
    },
  };

  return await client.request(endpoint);
};

export const isBookmarkedApi = async (movieId: string): Promise<IsBookmarkedResDto> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.get,
    url: `/${movieId}`,
  };

  return await client.request(endpoint);
};

export const removeBookmarkApi = async (movieId: string): Promise<void> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.delete,
    url: '',
    body: {
      movieId,
    },
  };

  return await client.request(endpoint);
};

export const getBookmarkListApi = async (): Promise<BookmarkResDto[]> => {
  const endpoint: ApiEndpoint = {
    method: HttpMethod.get,
    url: '',
  };

  return await client.request(endpoint);
};
