import { useEffect, useMemo, useState } from 'react';
import type { MovieDetail } from '../../../../types/movie';
import { toUrlPath } from '../../../../types/movie';
import { useParams } from 'react-router-dom';
import { getDetailMovie } from '../../../../api/movie/movieApi';
import {
  addBookmarkUseCase,
  isBookmarkedUseCase,
  removeBookmarkUseCase,
} from '../../../../useCase/movie.usecase';
import { parseNetworkError } from '../../../../utils/network/networkError';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookmarked, setBookmarked] = useState(false); // 현재 북마크 상태
  const [bookmarking, setBookmarking] = useState(false); // 버튼 로딩
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const movieIdStr = useMemo(() => (movie?.id ? String(movie.id) : null), [movie?.id]);

  const fetchMovieData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDetailMovie(id);
      setMovie(result ?? null);
      setBookmarked(!!(result as any)?.bookmarked); // 서버가 안 주면 false로 둠
    } catch (e) {
      console.error(e);
      setError('영화 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchIsBookmarked = async () => {
    const isBookmarked = await isBookmarkedUseCase(String(id));
    console.log(isBookmarked);
    setBookmarked(isBookmarked);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchMovieData();
    fetchIsBookmarked();
  }, [id]);

  const handleBookmarkToggle = async () => {
    if (!movie || !movieIdStr || bookmarking) return;

    const next = !bookmarked;
    setBookmarking(true);
    setBookmarked(next);

    try {
      if (next) {
        await addBookmarkUseCase(String(id));
      } else {
        // ✅ TODO: 북마크 해제 API
        await removeBookmarkUseCase(String(id));
      }
      setToast({ type: 'success', msg: next ? '북마크 추가 완료' : '북마크 해제 완료' });
    } catch (e) {
      const err = parseNetworkError(e);
      console.log(err);
      setToast({ type: 'error', msg: err.message });
      setBookmarked(!next); // 롤백
      // setToast({ type: 'error', msg: '처리 중 오류가 발생했습니다' });
    } finally {
      setBookmarking(false);
      setTimeout(() => setToast(null), 1500);
    }
  };

  if (loading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded mb-6" />
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error ?? '영화 정보를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div className="relative flex gap-6 p-4">
      {/* 토스트 */}
      {toast && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-3 px-4 py-2 rounded text-white shadow
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toast.msg}
        </div>
      )}

      <div className="flex-1">
        <img
          className="rounded-[5px] w-full max-w-[400px]"
          src={toUrlPath(movie.poster_path)}
          alt={movie.title}
        />

        {/* 상세 카드 하단 작은 버튼 */}
        <button
          onClick={handleBookmarkToggle}
          disabled={bookmarking}
          className={`mt-3 w-full max-w-[400px] px-3 py-2 rounded-2xl text-white transition
            ${
              bookmarking
                ? 'bg-gray-400 cursor-not-allowed'
                : bookmarked
                ? 'bg-yellow-500 hover:opacity-90'
                : 'bg-blue-500 hover:opacity-90'
            }`}
        >
          {bookmarking ? '처리 중...' : bookmarked ? '북마크 해제' : '북마크 추가'}
        </button>
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold">{movie.title}</p>
            <p className="text-sm bg-gray-100 px-2 py-1 rounded">{movie.vote_average}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map(g => (
              <span key={g.id} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {g.name}
              </span>
            ))}
          </div>

          <div className="leading-7 text-gray-800">{movie.overview}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
