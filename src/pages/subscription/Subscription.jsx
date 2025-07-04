import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/auth";
import apiClient from "../../service/axios";

function Subscription() {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useUserInfo();

  const handleSubscribe = async () => {
    if (!userInfo?.id) {
      alert("사용자 정보를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post(`/users/${userInfo.id}/subscribe`);

      // 구독 완료 처리
      setIsSubscribed(true);
    } catch (error) {
      console.error("구독 처리 중 오류:", error);

      // 에러 메시지 처리
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  const handleGoHome = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  if (isSubscribed) {
    return (
      <Container>
        <SuccessCard>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>구독이 완료되었습니다!</SuccessTitle>
          <SuccessMessage>
            이제 모든 책을 자유롭게 읽으실 수 있습니다.
          </SuccessMessage>
          <ButtonGroup>
            <ActionButton onClick={handleGoHome} variant="primary">
              메인으로 이동
            </ActionButton>
            <ActionButton onClick={handleGoBack} variant="secondary">
              이전 페이지
            </ActionButton>
          </ButtonGroup>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <SubscriptionCard>
        <Title>구독 서비스</Title>

        <PlanSection>
          <BenefitsList>
            <BenefitItem>📚 모든 책 무제한 읽기</BenefitItem>
            <BenefitItem>📱 모든 기기에서 동기화</BenefitItem>
            <BenefitItem>🔄 언제든지 구독 해지 가능</BenefitItem>
          </BenefitsList>
        </PlanSection>

        <PricingSection>
          <PricingCard>
            <PriceInfo>
              <CurrentPrice>월 9,900원</CurrentPrice>
            </PriceInfo>
            <PriceDescription>
              월 9,900원으로 모든 책을 자유롭게 읽으세요.
            </PriceDescription>
          </PricingCard>
        </PricingSection>

        <ButtonGroup>
          <SubscribeButton onClick={handleSubscribe} disabled={isLoading}>
            {isLoading ? "처리 중..." : "구독하기"}
          </SubscribeButton>
          <CancelButton onClick={handleGoBack}>취소</CancelButton>
        </ButtonGroup>
      </SubscriptionCard>
    </Container>
  );
}

export default Subscription;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 1rem;
`;

const SubscriptionCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
`;

const SuccessCard = styled(SubscriptionCard)`
  text-align: center;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.75rem;
  color: #000;
  font-weight: bold;
`;

const PlanSection = styled.div`
  margin-bottom: 2rem;
`;

const PlanTitle = styled.h3`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BenefitItem = styled.li`
  padding: 0.75rem 0;
  font-size: 1rem;
  color: #555;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const PricingSection = styled.div`
  margin-bottom: 2rem;
`;

const PricingCard = styled.div`
  border: 2px solid #000;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  position: relative;
`;

const PriceInfo = styled.div`
  margin-bottom: 1rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 0.5rem;
`;

const PriceDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubscribeButton = styled.button`
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #333;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
    border-color: #999;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background-color: #000;
        color: #fff;
        
        &:hover {
          background-color: #333;
        }
      `
      : `
        background-color: transparent;
        color: #666;
        border: 1px solid #ddd;
        
        &:hover {
          background-color: #f8f9fa;
        }
      `}
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #000;
  margin-bottom: 1rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const SuccessMessage = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 2rem;
`;
