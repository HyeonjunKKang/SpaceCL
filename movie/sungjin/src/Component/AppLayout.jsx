import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "./HeaderBar";
import MovieSearch from "./MovieSearch";

const Overlay = styled.div`
  position: fixed;
  inset: 0;                     /* top:0; right:0; bottom:0; left:0 */
  display: grid;
  place-items: center;          /* 중앙 정렬 */
  z-index: 100;                 /* Header(99) 위에 */
  pointer-events: none;         /* 배경 스크롤/클릭 가능 */
`;

const SearchPanel = styled.div`
  pointer-events: auto;         /* 이 안은 상호작용 가능 */
  width: min(720px, calc(100% - 32px));
  background: #111;
  color: #fff;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.5);
`;

export default function AppLayout() {
  const [openSearch, setOpenSearch] = useState(false);
  const location = useLocation();

  // 검색 결과 페이지 들어가면 모달 닫기
  useEffect(() => {
    if (location.pathname.startsWith("/search/results")) {
      setOpenSearch(false);
    }
  }, [location]);

  // ESC로 닫기
  useEffect(() => {
    if (!openSearch) return;
    const onKey = (e) => e.key === "Escape" && setOpenSearch(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <>
      <Header onOpenSearch={() => setOpenSearch(true)} />

      {openSearch && (
        <Overlay>
          <SearchPanel>
            {/* 필요하면 닫기 버튼 */}
            { <button onClick={() => setOpenSearch(false)}>닫기</button>}
            <MovieSearch />
          </SearchPanel>
        </Overlay>
      )}

      <Outlet />
    </>
  );
}
