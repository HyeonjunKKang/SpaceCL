import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useDebounce from "../Hook/useDebounce";
import { useNavigate } from "react-router-dom";
const Field=styled.div`
position: relative;
width: 220px;
  
`
const AutoBox = styled.div`
  top: calc(100% + 6px);
  background: #fff;
  border: 1px solid #ddd;
  position: absolute;
  width: 220px;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  top: 80%; /* 입력창 바로 아래 */
  left: 48%; /* 가운데 정렬 기준점 */
  transform: translateX(-50%); /* 정확히 가운데 맞추기 */
`;

function MovieSearch() {
  const [query, setQuery] = useState("");             // query: (질문, 검색어)
  const [suggestions, setSuggestions] = useState([]); // suggestions: (추천, 자동완성 목록)
  const [showAuto, setShowAuto] = useState(false);    // showAuto: (자동완성 박스 표시 여부)
  const apiKey = import.meta.env.VITE_SEARCH_API_KEY; // apiKey: (API 인증키)
  const debouncedQuery = useDebounce(query, 400);     // debouncedQuery: (디바운스된 검색어)
  const navigate = useNavigate();                     // navigate: (페이지 이동 함수)
  const inputRef = useRef();                          // inputRef: (input 직접 참조용)

  // 자동완성 fetch (debouncedQuery가 바뀔 때 실행)
  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }
    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(debouncedQuery)}&language=ko`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => setSuggestions(data.results || []))
      .catch(() => setSuggestions([]));
  }, [debouncedQuery, apiKey]);

  // handleChange: 입력값 변경시 실행
  const handleChange = (e) => {
    setQuery(e.target.value); // query값 변경
    setShowAuto(true);        // 자동완성박스 보여줌
  };

  // handleSearch: 폼 제출(검색 버튼/엔터) 시 실행
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query) return;
    setShowAuto(false); // 자동완성박스 숨김
    navigate(`/search/results?query=${encodeURIComponent(query)}`); // 검색결과 페이지로 이동
  };

  // handleSelect: 자동완성 항목 클릭 시 실행
  const handleSelect = (title) => {
    setQuery(title);          // query값을 클릭한 영화 제목으로 변경
    setShowAuto(false);       // 자동완성박스 숨김
    navigate(`/search/results?query=${encodeURIComponent(title)}`); // 검색결과 페이지로 이동
  };

  // handleBlur: input 포커스 잃을 때 실행
  const handleBlur = () => setTimeout(() => setShowAuto(false), 100);
  return (
    <div style={{ padding: 24 }}>
      <form onSubmit={handleSearch} autoComplete="off" style={{ display:'flex', gap:8 }}>
        <Field>
          <input
            ref={inputRef}
            value={query}
            onChange={handleChange}
            onFocus={() => setShowAuto(true)}
            onBlur={handleBlur}
            placeholder="영화 제목을 입력하세요"
            style={{ width: "100%" }}
          />
          {showAuto && suggestions.length > 0 && (
            <AutoBox role="listbox">
              {suggestions.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onMouseDown={() => handleSelect(item.title)}   // blur보다 먼저 실행
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {item.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w45${item.poster_path}`}
                      alt={item.title}
                      style={{ width: 30 }}
                    />
                  )}
                  <span style={{ flex: 1 }}>
                    {item.title}
                    {item.release_date && (
                      <span style={{ color: "#888", fontSize: 13 }}> ({item.release_date.slice(0, 4)})</span>
                    )}
                  </span>
                </div>
              ))}
            </AutoBox>
          )}
        </Field>

        <button type="submit" disabled={!query}>검색</button>
      </form>
    </div>
  );
}

  

export default MovieSearch;
