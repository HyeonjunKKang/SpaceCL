import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const Box = styled.div`
  border: 1px solid black;
  border-radius: 5px;

  margin: auto;
  text-align: center;
  background-color: #eee;
`;
const Minibox = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
`;
const Title = styled.h2`
  background-color: #eee;
  font-size: 20px;
`;
const Average = styled.p`
  font-size: 1rem;
  color: #555;
`;

const MovieCard = ({ movie }) => {
  const posterUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  return (
    <StyledLink to={`/details/${movie.id}`}>
      <Box>
        <Minibox src={posterUrl} />
        <Title>{movie.title}</Title>
        <Average>평점:{movie.vote_average}</Average>
      </Box>
    </StyledLink>
  );
};

export default MovieCard;
