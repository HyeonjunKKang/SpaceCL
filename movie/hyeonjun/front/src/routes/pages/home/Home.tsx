import React from 'react';
import MainMovieGrid from './MainMovieGrid';
import { useMovieStore } from '../../../store/useMovieStore';
import SliderSwiper from '../../../components/SlideSwiper';
import MovieCard from '../../../components/movies/MovieCard';

const Home = () => {
  const { movies } = useMovieStore();

  return (
    <div>
      <p className="text-[30px] font-bold">인기순위</p>
      <SliderSwiper>
        {movies.slice(0, 20).map(movie => (
          <div className="w-[250px] m-4">
            <MovieCard movie={movie}></MovieCard>
          </div>
        ))}
      </SliderSwiper>
      <MainMovieGrid movies={movies}></MainMovieGrid>
    </div>
  );
};

export default Home;
