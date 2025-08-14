import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiTrash2, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

const API = import.meta.env.VITE_API_BASE || "";

const Wrap = styled.div`
  padding: 24px 36px;
`;
const Title = styled.h2`
  margin: 0 0 12px;
`;
const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  list-style: none;
  padding: 0;
`;
const Card = styled.li`
  background: #111;
  color: #fff;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  background: #0a0a0a;
`;
const Name = styled.div`
  padding: 8px 10px;
  font-size: 14px;
  line-height: 1.3;
  min-height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const Toolbar = styled.div`
  display: flex;
  gap: 6px;
  padding: 8px 10px 12px;
  margin-top: auto;
  & > a, & > button {
    flex: 1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    font-size: 13px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid #2a2a2a;
    background: #1a1a1a;
    color: #ddd;
    cursor: pointer;
  }
  & > a:hover, & > button:hover { background: #222; }
  & > button { color: #ffb4b4; border-color: #3a1a1a; background: #1a0f0f; }
  & > button:hover { background: #221414; }
`;
const BookMark=() => {
  const { user, token } = useAuth();
  const nav = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 비로그인 → 로그인으로
  useEffect(() => {
    if (!user) {
      nav("/login?next=/mypage/bookmark", { replace: true });
    }
  }, [user, nav]);

  // 내 북마크 불러오기
  useEffect(() => {
    if (!token) return;
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API}/api/bookmarks?mediaType=movie`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ac.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "불러오기 실패");
        setList(data); // [{id, title, posterUrl, externalId, ...}]
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "에러");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [token]);

  // 북마크 해제(토글) → 목록에서 제거
  const unbookmark = async (b) => {
    try {
      const res = await fetch(`${API}/api/bookmarks/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: b.provider || "tmdb",
          mediaType: b.mediaType || "movie",
          externalId: b.externalId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "실패");
      setList((prev) => prev.filter((x) => x.id !== b.id));
    } catch (e) {
      alert(e.message || "해제 실패");
    }
  };

  if (loading) return <Wrap>불러오는 중…</Wrap>;
  if (err) return <Wrap style={{ color: "tomato" }}>오류: {err}</Wrap>;

  return (
    <Wrap>
      <Title>내 북마크</Title>
      {list.length === 0 ? (
        <p>아직 북마크가 없어요. 영화 상세 페이지에서 ‘저장’을 눌러보세요.</p>
      ) : (
        <Grid>
          {list.map((b) => (
            <Card key={b.id}>
              <Link to={`/details/${b.externalId}`} title="상세 보기">
                <Poster
                  src={b.posterUrl || "/placeholder.png"}
                  alt={b.title || "poster"}
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Name title={b.title || ""}>{b.title || "제목 없음"}</Name>
              <Toolbar>
                <Link to={`/details/${b.externalId}`}>
                  <FiExternalLink /> 상세
                </Link>
                <button onClick={() => unbookmark(b)}>
                  <FiTrash2 /> 해제
                </button>
              </Toolbar>
            </Card>
          ))}
        </Grid>
      )}
    </Wrap>
  );
}


export default BookMark
