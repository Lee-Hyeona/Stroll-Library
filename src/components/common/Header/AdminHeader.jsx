import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    // 비밀번호 페이지에서는 새로고침
    if (location.pathname === "/admin/password") {
      window.location.reload();
      return;
    }
    // 작가 목록 페이지로 이동
    navigate("/admin/authors");
  };

  return (
    <HeaderContainer>
      <LogoContainer onClick={handleLogoClick} clickable={true}>
        <Logo src="/logo/manage_logo.svg" alt="관리자 시스템" />
      </LogoContainer>
    </HeaderContainer>
  );
};

export default AdminHeader;

const HeaderContainer = styled.header`
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  /* box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); */
  border-bottom: 0.0625rem solid #e9ecef;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`;

const LogoContainer = styled.div`
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: ${(props) => (props.clickable ? "0.8" : "1")};
  }
`;

const Logo = styled.img`
  height: 2.5rem;
  width: auto;
  object-fit: contain;
`;
