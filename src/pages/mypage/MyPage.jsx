import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { getCurrentUser } from "../../service/api";
import { getAccessToken } from "../../service/axios";

function MyPage() {
  const navigate = useNavigate();
  const { userInfo, isAuthenticated, accessToken } = useAuthStore(
    (state) => state
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    // 컴포넌트가 언마운트되면 상태 업데이트 방지
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isMounted.current) return;

      try {
        if (!isAuthenticated) {
          if (isMounted.current) {
            setError("로그인이 필요합니다.");
            setLoading(false);
          }
          navigate("/login");
          return;
        }

        if (userInfo && !userData) {
          if (isMounted.current) {
            console.log("Zustand에서 사용자 정보 먼저 설정:", userInfo);
            setUserData(userInfo);
            setLoading(false);
          }
        }

        const response = await getCurrentUser();
        console.log("getCurrentUser API 응답:", response);

        if (!isMounted.current) return;

        if (response.success) {
          console.log("✅ 사용자 정보 성공적으로 가져옴:", response.data);
          setUserData(response.data);
          setError(null);
        } else {
          console.error("❌ API 호출 실패:", response);

          if (!userInfo) {
            setError(response.message || "사용자 정보를 불러올 수 없습니다.");
          }

          if (response.status === 401) {
            console.log("토큰 만료, 로그인 페이지로 이동");
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("❌ 예외 발생:", err);
        if (isMounted.current) {
          if (!userInfo) {
            setError("사용자 정보를 불러올 수 없습니다.");
          }
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    } else {
      setLoading(false);
      setError("로그인이 필요합니다.");
    }
  }, [isAuthenticated, userInfo, userData, navigate]);

  const handleSubscribe = () => {
    navigate("/subscription");
  };

  const handleAuthorRegister = () => {
    navigate("/author/register");
  };

  // 로딩 중일 때만 로딩 화면 표시
  if (loading && !userData) {
    return (
      <Container>
        <Title>마이페이지</Title>
        <LoadingMessage>로딩 중...</LoadingMessage>
      </Container>
    );
  }

  // 에러가 있고 사용자 데이터가 없는 경우에만 에러 화면 표시
  if (error && !userData) {
    return (
      <Container>
        <Title>마이페이지</Title>
        <ErrorMessage>{error}</ErrorMessage>
        <ActionButton onClick={() => navigate("/login")}>
          로그인 페이지로
        </ActionButton>
      </Container>
    );
  }

  // 데이터가 없는 경우
  if (!userData) {
    return (
      <Container>
        <Title>마이페이지</Title>
        <ErrorMessage>사용자 정보가 없습니다.</ErrorMessage>
        <ActionButton onClick={() => navigate("/login")}>
          로그인 페이지로
        </ActionButton>
      </Container>
    );
  }

  // 작가 상태 확인 - authorshipStatus 속성 사용
  const authorshipStatus = userData?.authorshipStatus || "DEFAULT";

  return (
    <Container>
      <Title>마이페이지</Title>
      {error && (
        <ErrorMessage style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
          ⚠️ 일부 정보를 업데이트하지 못했습니다.
        </ErrorMessage>
      )}
      <Section>
        <Row>
          <Label>닉네임</Label>
          <Value>{userData?.nickname || "정보 없음"}</Value>
        </Row>

        <Row>
          <Label>계정 ID</Label>
          <Value>{userData?.accountId || "정보 없음"}</Value>
        </Row>

        <Label>구독 정보</Label>
        <Row>
          <Value>{userData?.subscriber ? "구독 중" : "미구독"}</Value>
          {!userData?.subscriber && (
            <ActionButton onClick={handleSubscribe}>구독하기</ActionButton>
          )}
        </Row>

        <Label>작가 인증 상태</Label>
        <Row>
          <Value>
            {authorshipStatus === "DEFAULT" && "미신청"}
            {authorshipStatus === "PENDING" && "승인 대기"}
            {authorshipStatus === "ACCEPTED" && "인증 완료"}
          </Value>
          {authorshipStatus === "DEFAULT" && (
            <ActionButton onClick={handleAuthorRegister}>
              작가 등록하기
            </ActionButton>
          )}
          {authorshipStatus === "PENDING" && <Value>승인 대기 중</Value>}
          {authorshipStatus === "ACCEPTED" && <Value>인증 완료</Value>}
        </Row>

        {authorshipStatus === "ACCEPTED" && userData?.authorNickname && (
          <Row>
            <Label>작가명</Label>
            <Value>{userData.authorNickname}</Value>
          </Row>
        )}

        {authorshipStatus === "ACCEPTED" && userData?.authorsProfile && (
          <>
            <Label>작가 소개</Label>
            <AuthorProfileContainer>
              <AuthorProfile>{userData.authorsProfile}</AuthorProfile>
            </AuthorProfileContainer>
          </>
        )}
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

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #dc3545;
  margin-top: 2rem;
`;

const AuthorProfileContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

const AuthorProfile = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  color: #495057;
  white-space: pre-wrap;
`;
