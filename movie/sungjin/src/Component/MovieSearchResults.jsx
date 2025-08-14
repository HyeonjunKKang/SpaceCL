import React, { useEffect, useState } from "react";
import { useLocation,Link } from "react-router-dom";
import styled from "styled-components";

const MiniBox = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

function useQuery() {
  // 쿼리스트링에서 값 파싱하는 헬퍼 함수
  return new URLSearchParams(useLocation().search);
}

function SearchResult() {
  const query = useQuery().get("query") || ""; // 검색어
  const [movies, setMovies] = useState([]);    // 검색 결과 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null);      // 에러 메시지
  const apiKey = import.meta.env.VITE_SEARCH_API_KEY; // TMDB API 키

  useEffect(() => {
    if (!query) {
      setMovies([]);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
      })
      .catch((err) => setError("검색 실패: " + err.message))
      .finally(() => setLoading(false));
  }, [query, apiKey]);

  return (
    <div style={{ padding: 24 }}>
      <h2>“{query}” 검색 결과</h2>
      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <MiniBox>
        {movies.map((movie) => (
          <Link key={movie.id} to={`/details/${movie.id}`} style={{ margin: 8 }}>
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt={movie.title}
                style={{ display: "block", marginBottom: 4 }}
              />
            )}
            <div>{movie.title}</div>
            {movie.release_date && (
              <span style={{ color: "#888", fontSize: 13 }}>
                ({movie.release_date.slice(0, 4)})
              </span>
            )}
          </Link>
        ))}
      </MiniBox>
    </div>
  );
}

export default SearchResult;
