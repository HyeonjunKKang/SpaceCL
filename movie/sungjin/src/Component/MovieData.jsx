import React, { useEffect, useState } from 'react'
import { fetchModule } from 'vite'


const MovieData = () => {
    const [movieData,setMovieData] = useState(null) 
    useEffect(()=>{
        const fetchMovie=async ()=>{
        try{
            const res =await fetch('https://api.themoviedb.org/3/movie/popular',
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
    <div>
      d
    </div>
  )
}
export default MovieData
