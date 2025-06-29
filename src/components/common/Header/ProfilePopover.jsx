import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BDS } from "../../../styles/BDS";

function ProfilePopover({ setPopoverOpen, profile }) {
  const navigate = useNavigate();

  // 메뉴 항목 클릭 핸들러
  const handleMenuClick = (path) => {
    setPopoverOpen(false);
    navigate(path);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    setPopoverOpen(false);
    // 실제로는 로그아웃 API 호출 및 상태 초기화 로직 필요
    console.log("로그아웃");
    navigate("/login");
  };

  // 작가용 메뉴 항목
  const authorMenuItems = [
    { label: "계정 정보", path: "/account" },
    { label: "글쓰기", path: "/write" },
    { label: "글 임시 저장 목록", path: "/drafts" },
    { label: "출간된 책", path: "/published-books" },
    { label: "최근 본 책", path: "/recent-books" },
    { label: "구매 목록", path: "/purchase-history" },
    { label: "구독 하기", path: "/subscription" },
  ];

  // 일반 사용자용 메뉴 항목
  const userMenuItems = [
    { label: "계정 정보", path: "/account" },
    { label: "최근 본 책", path: "/recent-books" },
    { label: "구매 목록", path: "/purchase-history" },
    { label: "구독 하기", path: "/subscription" },
  ];

  const menuItems = profile?.is_author ? authorMenuItems : userMenuItems;

  return (
    <>
      <ProfilePopoverContainer>
        <UserInfo>
          {profile?.is_author ? (
            <UserNameWithBadge>
              <UserName>{profile?.name}</UserName>
              <AuthorBadge>작가</AuthorBadge>
            </UserNameWithBadge>
          ) : (
            <UserName>{profile?.name}</UserName>
          )}
        </UserInfo>

        <Divider />

        <MenuList>
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => handleMenuClick(item.path)}>
              {item.label}
            </MenuItem>
          ))}
          <MenuItem onClick={handleLogout} isLogout>
            로그아웃
          </MenuItem>
        </MenuList>
      </ProfilePopoverContainer>
      <ProfilePopoverBackgroundOverlay onClick={() => setPopoverOpen(false)} />
    </>
  );
}

export default ProfilePopover;

const ProfilePopoverContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15rem;
  padding: 1.5rem;
  background-color: ${BDS.palette.white};
  border: 1px solid #e1e5e9;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(100%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfilePopoverBackgroundOverlay = styled.div`
  position: fixed;
  z-index: 90;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserNameWithBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const UserName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${BDS.palette.pointblack};
`;

const AuthorBadge = styled.div`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: ${BDS.palette.black};
  color: ${BDS.palette.white};
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 0.25rem;
  width: fit-content;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e1e5e9;
  margin: 0.5rem 0;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ isLogout }) => (isLogout ? "#dc3545" : BDS.palette.pointblack)};
  background-color: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ isLogout }) =>
      isLogout ? "rgba(220, 53, 69, 0.1)" : "#f8f9fa"};
  }

  &:active {
    transform: translateY(0.0625rem);
  }
`;
