import type { Movie } from '../../../types/movie';
import MovieCard from '../../../components/movies/MovieCard';
import { useNavigate } from 'react-router-dom';

interface Props {
  movies: Movie[];
}

const MainMovieGrid = ({ movies }: Props) => {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-2xl font-bold">영화목록</p>
      <div className="grid grid-cols-4 gap-3">
        {movies.map(movie => (
          <div onClick={() => handleClick(movie.id)} key={movie.id}>
            <MovieCard movie={movie}></MovieCard>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainMovieGrid;
