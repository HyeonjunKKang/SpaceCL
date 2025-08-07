import { useEffect, useState } from 'react';
import type { MovieDetail } from '../../../../types/movie';
import { toUrlPath } from '../../../../types/movie';
import { useParams } from 'react-router-dom';
import { getDetailMovie } from '../../../../api/movie/movieApi';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);

  const fetchMovieData = async () => {
    try {
      const result = await getDetailMovie(id);
      setMovie(result ?? null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [id]);

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
            {movie?.genres.map(data => (
              <p>{data.name}</p>
            ))}
          </div>
          <div>{movie?.overview}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
