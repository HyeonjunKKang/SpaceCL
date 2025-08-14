import {
  addBookmarkApi,
  getBookmarkListApi,
  isBookmarkedApi,
  removeBookmarkApi,
} from '../api/movie/movie.server.api';

export const addBookmarkUseCase = async (movieId: string) => {
  return await addBookmarkApi(movieId);
};

export const isBookmarkedUseCase = async (movieId: string): Promise<boolean> => {
  const res = await isBookmarkedApi(movieId);

  return res.isBookmarked;
};

export const removeBookmarkUseCase = async (movieId: string) => {
  return await removeBookmarkApi(movieId);
};

export const getBookmarListUseCase = async () => {
  return await getBookmarkListApi();
};
