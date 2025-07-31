import { useEffect, useState } from 'react';
import type { Movie } from '../../../../types/movie';
import { toUrlPath } from '../../../../types/movie';
import { useParams } from 'react-router-dom';
import { useMovieStore } from '../../../../store/useMovieStore';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const { getMovieById } = useMovieStore();

  useEffect(() => {
    const movieData = getMovieById(Number(id));
    setMovie(movieData ?? null);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <img className="rounded-[5px]" src={toUrlPath(movie?.poster_path)} alt="" />
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <p>{movie?.title}</p>
            <p>{movie?.vote_average}</p>
          </div>
          <div className="flex gap-2">
            {movie?.genre_ids.map(id => (
              <p>{id}</p>
            ))}
          </div>
          <div>{movie?.overview}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
