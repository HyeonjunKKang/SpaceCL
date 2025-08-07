import type { Movie } from '../../../types/movie';
import MovieCard from '../../../components/movies/MovieCard';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { useMovieStore } from '../../../store/useMovieStore';
import { getPopularMovies } from '../../../api/movie/movieApi';
interface Props {
  movies: Movie[];
}

const MainMovieGrid = ({ movies }: Props) => {
  const navigate = useNavigate();
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);

  const { page, total_pages, addMovie } = useMovieStore();

  const getMovie = async (page: number) => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const respnose = await getPopularMovies(page);
      addMovie(respnose);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reachedBottom = async () => {
    if (page < total_pages) {
      getMovie(page + 1);
    }
  };

  const handleClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  useEffect(() => {
    if (inView) {
      reachedBottom();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-2xl font-bold">영화목록</p>
      <div className="grid grid-cols-4 gap-3">
        {movies.map(movie => (
          <div onClick={() => handleClick(movie.id)} key={movie.id}>
            <MovieCard movie={movie}></MovieCard>
          </div>
        ))}
        <div ref={ref}>bottom</div>
      </div>
    </div>
  );
};

export default MainMovieGrid;
