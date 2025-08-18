import styled from "styled-components";
import MovieCard from "./MovieCard";


import React, { useState, useEffect } from "react";
const api = import.meta.env.VITE_MOVIE_API_KEY;
const LoginBox = styled.div

 

const Gride = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
  padding: 10px;

  margin: auto;
`;
const  Main= () => {

    const [movieData,setMovieData] = useState(null) 
    useEffect(()=>{
        const fetchMovie=async ()=>{
        try{
            const res =await fetch('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            method: 'GET',
            headers:{
                accept: 'application/json',
               Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYWU2MTAxOTMzMzRkNmM1N2E1ZTE3ODQ0YTg3ODM0MiIsIm5iZiI6MTcxNjQyNzQ3Ni42ODIsInN1YiI6IjY2NGU5YWQ0ZThkMjJmNTAzY2JiMjQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l3IKQjZSPyodoFDolASLlNROIThw3d0LutLmNN34bog'
                 }
            
             }      
            )
            const data= await res.json()
            
          setMovieData(data);}
          catch(err) {
            console.log('api호출x')
          }
        }
        fetchMovie();
    },[]);



  return (
    <Gride>
      {movieData?.results.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </Gride>
  );
};

export default Main;
