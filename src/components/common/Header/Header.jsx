import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import ProfileAvatarContainer from "./ProfileAvatarContainer";
import { useAuthStore } from "../../../store/auth";
const profile = {
  name: "홍길동",
  email: "hong@example.com",
  avatar: "/profile/profile.svg",
  is_author: true, // 작가 테스트를 위해 true로 설정 (나중에 실제 사용자 정보로 대체)
};

function Header() {
  const navigate = useNavigate();
  // const [isLogin, setIsLogin] = useState(true);
  const { userInfo } = useAuthStore((state) => state);
  return (
    <HeaderContainer>
      <Link to="/">
        <Logo src="/logo/logo.svg" alt="Book Management System" />
      </Link>

      {/* {isLogin ? ( */}
      {userInfo ? (
        <ButtonGroup>
          <ProfileAvatarContainer profile={userInfo} />
        </ButtonGroup>
      ) : (
        <ButtonGroup>
          <SignUpButton onClick={() => navigate("/signup")}>
            회원가입
          </SignUpButton>
          <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
        </ButtonGroup>
      )}
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.header`
  width: calc(100% - 2rem);
  max-width: calc(1280px - 2rem);
  height: 2.75rem;
  padding: 1rem;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  z-index: 100;
`;
const Logo = styled.img`
  height: auto;
  max-height: 3%.75;
  width: auto;
  max-width: 12.5rem;
  object-fit: contain;
`;
const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const SignUpButton = styled.button`
  background-color: ${({ theme }) => theme.palette.white};
  color: ${({ theme }) => theme.palette.black};
  font-weight: 500;
  font-size: 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.palette.black};
    color: ${({ theme }) => theme.palette.white};
    border: none;
    outline: none;
  }
  &:active {
    font-weight: 500;
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;
const LoginButton = styled.button`
  background-color: ${({ theme }) => theme.palette.white};
  color: ${({ theme }) => theme.palette.black};
  font-weight: 500;
  font-size: 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.palette.black};
    color: ${({ theme }) => theme.palette.white};
    border: none;
    outline: none;
  }
  &:active {
    font-weight: 500;
    outline: none;
  }
  &:focus {
    outline: none;
  }
`;
