import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FiBookmark } from "react-icons/fi";           // ✅ 아이콘
import { useAuth } from "../auth/AuthContext";        // ✅ 토큰/유저

const API = import.meta.env.VITE_API_BASE || "";

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
  object-fit: cover;
  border-radius: 8px;
`;
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;
const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;
const Rating = styled.p`
  font-size: 18px;
  margin: 0;
  color: #888;
`;
const Overview = styled.p`
  line-height: 1.6;
`;

/* ✅ 북마크 버튼 스타일 */
const BookmarkBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${({ $saved }) => ($saved ? "#a259ff" : "#ccc")};
  background: ${({ $saved }) => ($saved ? "rgba(162,89,255,.1)" : "#fff")};
  color: ${({ $saved }) => ($saved ? "#a259ff" : "#333")};
  cursor: pointer;
  &:disabled { opacity: .6; cursor: default; }
`;

 const MovieDetails =() => {
  const { id } = useParams();
  const { user, token } = useAuth();                 // ✅ 로그인/토큰
  const [movie, setMovie] = useState(null);
  const [saved, setSaved] = useState(false);         // ✅ 북마크 상태
  const [loading, setLoading] = useState(false);     // ✅ 토글 중

  // TMDB 포스터 URL 조립
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : "/placeholder.png";

  // 1) 영화 상세 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYWU2MTAxOTMzMzRkNmM1N2E1ZTE3ODQ0YTg3ODM0MiIsIm5iZiI6MTcxNjQyNzQ3Ni42ODIsInN1YiI6IjY2NGU5YWQ0ZThkMjJmNTAzY2JiMjQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l3IKQjZSPyodoFDolASLlNROIThw3d0LutLmNN34bog",
            },
          }
        );
        const data = await res.json();
        if (!alive) return;
        setMovie(data);
      } catch (err) {
        console.error("영화상세 불러오기 오류:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // 2) 로그인 상태면, 북마크 여부 초기 체크
  useEffect(() => {
    if (!user || !movie?.id) return;
    let abort = new AbortController();
    (async () => {
      try {
        const url = new URL(`${API}/api/bookmarks/exists`);
        url.searchParams.set("provider", "tmdb");
        url.searchParams.set("mediaType", "movie");
        url.searchParams.set("externalId", String(movie.id));
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abort.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setSaved(!!data.saved);
      } catch (e) {
        // 무시 (로그인 만료 등은 상위에서 처리)
      }
    })();
    return () => abort.abort();
  }, [user, token, movie?.id]);

  // 3) 토글 핸들러
  const toggleBookmark = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!movie) return;
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/bookmarks/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: "tmdb",
          mediaType: "movie",
          externalId: movie.id,
          title: movie.title,
          posterUrl, // ✅ 마이페이지에서 바로 사용가능하게 풀 URL 저장
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "북마크 실패");
      setSaved(!!data.saved);
    } catch (e) {
      console.error(e);
      alert("북마크 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!movie) return <div>로딩중…</div>;
 
  return (
    <Container>
      <Poster src={posterUrl} alt={movie.title} />
      <InfoSection>
        <TitleRow>
          <Title>{movie.title}</Title>

          {/* ✅ 북마크 버튼 + 평점 나란히 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookmarkBtn
              onClick={toggleBookmark}
              disabled={loading}
              $saved={saved}
              aria-pressed={saved}
              title={saved ? "북마크 해제" : "북마크"}
            >
              <FiBookmark />
              <span>{saved ? "저장됨" : "저장"}</span>
            </BookmarkBtn>
            <Rating>⭐ {movie.vote_average?.toFixed?.(1) ?? movie.vote_average}</Rating>
          </div>
        </TitleRow>

        <Overview>설명: {movie.overview}</Overview>
      </InfoSection>
    </Container>
  );
}

export default MovieDetails;
