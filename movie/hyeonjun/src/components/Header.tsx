import { FaMoon } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSearchMovie } from '../api/movie/movieApi';
import { useDebounce } from '../hook/useDebounce';
import type { MovieResponse } from '../types/movie';

const Header = () => {
  const navigate = useNavigate();

  // search props

  const [isSearching, setIsSearching] = useState<boolean>(true);
  const [keyWord, setKeyWord] = useState<string>('');
  const debouncedValue = useDebounce(keyWord, 150);

  // search reault
  const [searchResult, setSearchResult] = useState<MovieResponse | null>(null);

  const resetSearchState = () => {
    setKeyWord('');
    setSearchResult(null);
    setIsSearching(false);
  };

  const onClickSearch = () => setIsSearching(prev => !prev);

  const onClickSearchResultClick = (movieId: number) => {
    resetSearchState();
    navigate(`detail/${movieId}`);
  };

  const handleChangeDebouncedValue = async () => {
    if (debouncedValue !== '') {
      const result = await getSearchMovie(debouncedValue);
      setSearchResult(result);
    } else {
      setSearchResult(null);
    }

    console.log(searchResult);
  };

  useEffect(() => {
    handleChangeDebouncedValue();
  }, [debouncedValue]);

  return (
    <div className="flex h-[50px] gap-3 items-center justify-between px-3 bg-black">
      <div onClick={() => navigate('/')} className="text-[35px] text-white hover:cursor-pointer">
        HJMOVIE
      </div>

      <div className="relative flex-1">
        <div
          className={`transition-all duration-300 ease-in-out transform ${
            isSearching
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <input
            className="bg-white w-full rounded-full py-1 px-3 min-w-0"
            type="text"
            value={keyWord}
            onChange={e => setKeyWord(e.target.value)}
          />

          <div
            className={`
              absolute top-full mt-1 bg-gray-50 left-0 w-full z-10 rounded-[3px] max-h-[200px] overflow-y-auto break-words p-2
              transition-all duration-200 ease-in-out transform
              ${searchResult && searchResult.results.length > 0 ? 'opacity-100' : 'opacity-0'}
              `}
          >
            {searchResult?.results?.map(movie => (
              <div
                key={movie.id}
                onClick={() => onClickSearchResultClick(movie.id)}
                className="hover:cursor-pointer"
              >
                {movie.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-white">asdfafda</button>
        <div className="flex gap-3">
          <FaMoon style={{ color: 'white' }}></FaMoon>
          <CiSearch onClick={onClickSearch} style={{ color: 'white' }}></CiSearch>
        </div>
        <div className="flex gap-1 items-center">
          <Link
            to="/login"
            className="bg-purple-400 px-2 py-1 text-white text-[15px] rounded-[3px]"
          >
            로그인
          </Link>
          <Link
            to={'/signup'}
            className="bg-purple-400 px-2 py-1 text-white text-[15px] rounded-[3px]"
          >
            <p>회원가입</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
