import React from "react";
import styled from "styled-components";
import movieDetailData from "../movieDetailData.json";


const Container = styled.div`
  padding: 40px;
  display: flex;
  background-color: #eee;
`;
const Poster = styled.img`
  display: flex;
  width: 250px;
  aspect-ratio: 2 / 3;
  margin-right: 50px;
`;
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h1`
  align-items: center;
  font-size: 24px;
  margin: 0;
`;

const Rating = styled.p`
  font-size: 18px;
  margin: 0;
  color: #888;
`;

const Genre = styled.p`
  font-weight: bold;
  margin: 0;
`;

const Overview = styled.p`
  line-height: 1.6;
`;

const MovieDetails = () => {
  const movie = movieDetailData;
  const genreNames = movie.genres.map((g) => g.name).join(", ");
  const posterUrl = `https://image.tmdb.org/t/p/original${movieDetailData.poster_path}`;

  return (
    <Container>
      <Poster src={posterUrl} />
      <InfoSection>
        <TitleRow>
          <Title>{movie.title}</Title>
          <Rating>⭐ {movie.vote_average}</Rating>
        </TitleRow>
        <Genre>장르:{genreNames}</Genre>
        <Overview>설명:{movie.overview}</Overview>
      </InfoSection>
    </Container>
  );
};

export default MovieDetails;
