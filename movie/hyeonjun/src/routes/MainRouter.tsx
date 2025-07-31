// MainRouter.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main/Main';
import MainMovieGrid from './pages/home/MainMovieGrid';
import MovieDetail from './pages/movie/detail/MovieDetail';
import { useEffect } from 'react';
import { useMovieStore } from '../store/useMovieStore';

import movieJson from "../data/movieListData.json"
import type { MovieResponse } from '../types/movie';

const NotFound = () => <div>Not Found</div>;

const MainRouter = () => {

  const { setMovieResponse, movies } = useMovieStore()

  useEffect(() => { 
    const data = movieJson as MovieResponse
    setMovieResponse(data)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<MainMovieGrid movies={movies} />} />
          <Route path="detail/:id" element={<MovieDetail></MovieDetail>} />
          {/* <Route path="movies" element={<MainMovieGrid />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
