import styled from "styled-components";
import MovieCard from "./MovieCard";
import movieListData from "../movieListData.json";

const Gride = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  padding: 10px;

  margin: auto;
`;
const Main = () => {
  return (
    <Gride>
      {movieListData.results.slice(0, 20).map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Gride>
  );
};

export default Main;
