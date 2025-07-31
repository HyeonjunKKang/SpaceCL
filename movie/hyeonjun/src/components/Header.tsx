import { FaMoon } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const navigate = useNavigate()

  return (
    <div className="flex h-[50px] items-center justify-between px-3 bg-black">
      <div
        onClick={() => {
          navigate('')
        }}
        className="text-[35px] text-white hover:cursor-pointer"
      >
        HJMOVIE
      </div>
      <div className="flex items-center gap-3">
        <button className="text-white">asdfafda</button>
        <FaMoon style={{ color: 'white' }}></FaMoon>
        <CiSearch style={{ color: 'white' }}></CiSearch>
        <div className="flex gap-1 items-center">
          <button className="bg-purple-400 px-1 text-white text-[15px] rounded-[3px]">
            로그인
          </button>
          <button className="bg-purple-400 px-1 text-white text-[15px] rounded-[3px]">
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
