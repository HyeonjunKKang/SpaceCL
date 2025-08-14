import { useEffect, useState } from 'react';
import { getBookmarListUseCase } from '../../../../useCase/movie.usecase';
import type { BookmarkResDto } from '../../../../types/bookmarks.type';
import { toUrlPath, type MovieDetail } from '../../../../types/movie';
import { getDetailMovie } from '../../../../api/movie/movieApi';

export default function BookmarkListPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkResDto[]>([]);
  const [details, setDetails] = useState<MovieDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const getBookmarkList = async () => {
    const res = await getBookmarListUseCase();
    setBookmarks(res);
  };

  useEffect(() => {
    getBookmarkList();
  }, []);

  // 2) movieId 목록 → 상세 정보 병렬 로드(동시성 제한)
  useEffect(() => {
    if (bookmarks.length === 0) {
      setDetails([]);
      return;
    }

    let aborted = false;
    setLoading(true);

    const run = async () => {
      const ids = Array.from(new Set(bookmarks.map(b => String(b.movieId))));

      // 동시성 제한 (poolSize = 5)
      const poolSize = 5;
      const results: MovieDetail[] = [];
      let index = 0;

      const worker = async () => {
        while (index < ids.length) {
          const myIndex = index++;
          const id = ids[myIndex];
          try {
            const detail = await getDetailMovie(id);
            if (!aborted) results.push(detail);
          } catch (e) {
            // 한 건 실패해도 전체는 계속
            console.warn('failed id:', id, e);
          }
        }
      };

      await Promise.all(new Array(Math.min(poolSize, ids.length)).fill(0).map(() => worker()));
      if (!aborted) {
        // 북마크 순서 유지하고 싶다면 북마크 순으로 재정렬
        const order = new Map(ids.map((id, i) => [id, i]));
        results.sort((a, b) => (order.get(String(a.id)) ?? 0) - (order.get(String(b.id)) ?? 0));
        setDetails(results);
        setLoading(false);
      }
    };

    run();
    return () => {
      aborted = true;
    };
  }, [bookmarks]);

  if (loading) return <p className="p-5">불러오는 중…</p>;
  if (bookmarks.length === 0) return <p className="p-5">북마크한 영화가 없습니다.</p>;

  return (
    <div className="grid grid-cols-5 gap-5 p-5">
      {details.map(movie => (
        <div key={movie.id} className="">
          <div>
            {/* 사진영역 */}
            <img
              className="rounded-[3px] aspect-[2/3] hover:scale-110 transition-transform duration-150"
              src={toUrlPath(movie.poster_path)}
              alt=""
            />
            {/* title area */}
            <p className="text-[14px] [overflow-wrap:anywhere]">{movie.title}</p>
            <p className="text-end text-[13px]">{movie.vote_average}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
