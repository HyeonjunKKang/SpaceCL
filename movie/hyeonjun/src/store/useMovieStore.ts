import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Movie, MovieResponse } from "../types/movie";

interface MovieStore {
  movies: Movie[];
  page: number;
  total_pages: number;
  total_results: number;

  setMovieResponse: (data: MovieResponse) => void;
  getMovieById: (id: number) => Movie | undefined;
  clearMovies: () => void;
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      movies: [],
      page: 0,
      total_pages: 0,
      total_results: 0,

      setMovieResponse: (data) =>
        set({
          movies: data.results,
          page: data.page,
          total_pages: data.total_pages,
          total_results: data.total_results,
        }),

      getMovieById: (id) => get().movies.find((m) => m.id === id),

      clearMovies: () =>
        set({
          movies: [],
          page: 0,
          total_pages: 0,
          total_results: 0,
        }),
    }),
    {
      name: "movie-store", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);