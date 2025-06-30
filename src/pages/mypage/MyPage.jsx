import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();
  // 가상의 사용자 정보 (실제로는 API에서 가져와야 함)
  const [userInfo, setUserInfo] = useState({
    name: "홍길동",
    id: "hong123",
    points: 15000,
    isSubscribed: false,
    authorStatus: "미인증", // "미인증", "승인 대기", "인증 완료"
    subscriptionEndDate: null,
  });

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  const handleAuthorRegister = () => {
    navigate("/author/register");
  };

  return (
    <Container>
      <Title>마이페이지</Title>
      <Section>
        <Row>
          <Label>이름</Label>
          <Value>{userInfo.name}</Value>
        </Row>

        <Row>
          <Label>아이디</Label>
          <Value>{userInfo.id}</Value>
        </Row>

        <Row>
          <Label>보유 포인트</Label>
          <Value>{userInfo.points.toLocaleString()}P</Value>
        </Row>

        <Label>구독 정보</Label>
        <Row>
          <Value>
            {userInfo.isSubscribed
              ? `구독중 (${userInfo.subscriptionEndDate || "만료일 미정"})`
              : "미구독"}
          </Value>
          {!userInfo.isSubscribed && (
            <ActionButton onClick={handleSubscribe}>구독하기</ActionButton>
          )}
        </Row>

        <Label>작가 인증</Label>
        <Row>
          <Value>{userInfo.authorStatus}</Value>
          {userInfo.authorStatus === "미인증" && (
            <ActionButton onClick={handleAuthorRegister}>
              작가 등록하기
            </ActionButton>
          )}
        </Row>
      </Section>
    </Container>
  );
}

export default MyPage;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rem 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Label = styled.label`
  margin: 1rem 0 0.25rem;
  font-weight: bold;
  text-align: left;
  display: block;
`;

const Value = styled.div`
  font-size: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  ${Label} {
    margin: 0;
    border-bottom: 1px solid #eee;
    padding: 0.5rem 0;
    flex: 1;
  }

  ${Value} {
    border-bottom: 1px solid #eee;
    text-align: right;
  }
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;

  &:hover {
    background-color: #333;
  }
`;
