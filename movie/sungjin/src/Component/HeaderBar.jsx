import React,{useState,useEffect,useRef} from "react";
import styled from "styled-components";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMoreHorizontal,
  FiMessageSquare,
  FiExternalLink,
  FiUser 
} from "react-icons/fi"; // 아이콘 예시
import { useAuth } from "../auth/AuthContext";
const ProfileWrap = styled.div`
  position: relative;
`;
const AvatarBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1b1b1b;
  border: 1px solid #2a2a2a;
  color: #fff;
  display: grid;
  place-items: center;
  overflow: hidden;
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Menu = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
  background: #0f0f0f;
  border: 1px solid #262626;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  min-width: 160px;
  padding: 6px;
  z-index: 200;
`;
const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: 0;
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #1a1a1a;
  }
`;

const HeaderBar = styled.header`
  width: 100%; /* 가로 100% */
  background: #111; /* 어두운 배경색 */
  color: #fff; /* 텍스트 색 흰색 */
  display: flex; /* flexbox(가로정렬) */
  align-items: center; /* 세로 가운데정렬 */
  justify-content: space-between; /* 좌우로 끝까지 정렬 */
  padding: 0 36px; /* 좌우 여백 36px */
  height: 60px; /* 세로 60px */
  position: sticky; /* 스크롤해도 위에 붙어있음 */
  top: 0;
  /* 상단 0 */
  z-index: 99; /* 다른 요소보다 위 */
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  text-decoration: none;
  color: #fff;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
`;

const LogoPurple = styled.span`
  color: #a259ff;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  padding: 5px;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: #a259ff;
  }
`;

const Button = styled.button`
  background: #a259ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 8px;

  transition: background 0.15s;
  &:hover {
    background: #763ad8;
  }
`;
const Greeting = styled.span`
  opacity: 0.9;
  margin-left: 8px;
`;

const Header = ({ onOpenSearch }) => {
  const { user, logout } = useAuth();
  const displayName =
    user?.nickname || (user?.email ? user.email.split("@")[0] : "");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <HeaderBar>
      <Logo to="/">
        스페이스무비<LogoPurple>.</LogoPurple>
      </Logo>
      <RightSection>
        <IconButton title="다크모드">
          <span role="img" aria-label="dark">
            🌙
          </span>
        </IconButton>
        <IconButton title="검색" onClick={onOpenSearch}>
          <FiSearch />
        </IconButton>
       {user ? (
          <ProfileWrap ref={menuRef}>
            <AvatarBtn onClick={() => setMenuOpen(v => !v)} aria-label="프로필">
              {/* ✅ 사진 있으면 사진, 없으면 항상 아이콘만 */}
              {user.avatarUrl ? <AvatarImg src={user.avatarUrl} alt="프로필" /> : <FiUser size={20} />}
            </AvatarBtn>

            {menuOpen && (
              <Menu>
                <MenuItem as={Link} to="/mypage">
                  마이페이지
                </MenuItem>
                <MenuItem onClick={logout}>로그아웃</MenuItem>
              </Menu>
            )}
          </ProfileWrap>
        ) : (
          <>
            <Button as={Link} to="/login">
              로그인
            </Button>
            <Button as={Link} to="/register">
              회원가입
            </Button>
          </>
        )}

        <IconButton title="메시지">
          <FiMessageSquare />
        </IconButton>
        <IconButton title="더보기">
          <FiMoreHorizontal />
        </IconButton>
      </RightSection>
    </HeaderBar>
  );
};
export default Header;
