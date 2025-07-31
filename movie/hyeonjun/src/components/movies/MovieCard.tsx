import React from 'react';
import { toUrlPath, type Movie } from '../../types/movie';

export interface MovieCardProps {
  show?: {
    rank?: boolean;
    ranking: number;
    title?: boolean;
  };
  movie: Movie;
}

const MovieCard = ({ show, movie }: MovieCardProps) => {
  return (
    <div className="flex flex-col">
      {/* 사진영역 */}
      <img
        className="rounded-[3px] aspect-[2/3] hover:scale-110 transition-transform duration-150"
        src={toUrlPath(movie.poster_path)}
        alt=""
      />
      {/* title area */}
      <p className="text-[14px]">{movie.title}</p>
      <p className="text-end text-[13px]">{movie.vote_average}</p>
    </div>
  );
};

export default MovieCard;
