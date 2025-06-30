import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { BDS } from "../../styles/BDS";
import Modal from "../../components/common/Modal";
import AdminHeader from "../../components/common/Header/AdminHeader";

const ManageAuthorDetail = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    // 관리자 권한 확인
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/password");
      return;
    }

    // 작가 신청 상세 정보 불러오기 (임시 데이터)
    setTimeout(() => {
      const mockDetailData = {
        user001: {
          userId: "user001",
          authorName: "김소설",
          applicationDate: "2024-01-15",
          introduction:
            "안녕하세요. 저는 10년간 소설을 써온 김소설입니다.\n\n주로 현대 문학과 로맨스 장르를 다루며, 독자들과 깊이 있는 감정을 나누고 싶습니다. 제가 쓴 작품들이 많은 사람들에게 위로와 힐링이 되었으면 좋겠습니다.\n\n앞으로도 꾸준히 좋은 작품을 선보이겠습니다.",
          status: "pending",
        },
        user002: {
          userId: "user002",
          authorName: "이문학",
          applicationDate: "2024-01-14",
          introduction:
            "문학을 사랑하는 이문학입니다.\n\n대학에서 국어국문학을 전공했으며, 여러 문학 동아리에서 활동해왔습니다. 제가 추구하는 것은 일상 속에서 발견할 수 있는 작은 아름다움을 글로 표현하는 것입니다.\n\n독자들이 제 글을 통해 삶의 소중함을 느끼셨으면 합니다.",
          status: "pending",
        },
        user003: {
          userId: "user003",
          authorName: "박시인",
          applicationDate: "2024-01-13",
          introduction:
            "시와 산문을 쓰는 박시인입니다.\n\n자연과 인간의 관계, 그리고 현대 사회의 모순을 주제로 작품을 써왔습니다. 제 글이 독자들에게 잠깐의 사색 시간을 선사했으면 좋겠습니다.\n\n진정성 있는 작품으로 많은 분들과 만나고 싶습니다.",
          status: "pending",
        },
        user004: {
          userId: "user004",
          authorName: "최작가",
          applicationDate: "2024-01-12",
          introduction:
            "다양한 장르의 소설을 쓰는 최작가입니다.\n\n판타지부터 추리, 로맨스까지 폭넓은 장르에 도전하고 있습니다. 독자들이 지루할 틈 없이 몰입할 수 있는 스토리를 만드는 것이 제 목표입니다.\n\n재미있고 의미 있는 이야기로 독자들과 소통하겠습니다.",
          status: "pending",
        },
      };

      const data = mockDetailData[userId];
      if (data) {
        setApplicationData(data);
      }
      setIsLoading(false);
    }, 800);
  }, [userId, navigate]);

  const handleCancel = () => {
    navigate("/admin/authors");
  };

  const handleApprove = async () => {
    setIsProcessing(true);

    // 승인 처리 시뮬레이션
    setTimeout(() => {
      // 실제 환경에서는 서버에 승인 요청을 보냄
      console.log(`작가 승인: ${applicationData.userId}`);

      setIsProcessing(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate("/admin/authors");
  };

  if (isLoading) {
    return (
      <Container>
        <AdminHeader />
        <LoadingMessage>작가 신청 정보를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (!applicationData) {
    return (
      <Container>
        <AdminHeader />
        <ErrorMessage>
          <ErrorTitle>신청 정보를 찾을 수 없습니다</ErrorTitle>
          <BackButton onClick={handleCancel}>목록으로 돌아가기</BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <AdminHeader />

      <Content>
        <HeaderSection>
          <Title>작가 신청 내용</Title>
        </HeaderSection>
        <Section>
          <ApplicationInfo>
            <InfoRow>
              <InfoLabel>유저 아이디</InfoLabel>
              <InfoValue>{applicationData.userId}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>작가명</InfoLabel>
              <InfoValue>{applicationData.authorName}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>신청 일자</InfoLabel>
              <InfoValue>{applicationData.applicationDate}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>작가 소개</InfoLabel>
              <IntroductionValue>
                {applicationData.introduction}
              </IntroductionValue>
            </InfoRow>
          </ApplicationInfo>

          <ActionButtons>
            <CancelButton onClick={handleCancel}>취소하기</CancelButton>
            <ApproveButton onClick={handleApprove} disabled={isProcessing}>
              {isProcessing ? "승인 처리 중..." : "작가 승인하기"}
            </ApproveButton>
          </ActionButtons>
        </Section>
      </Content>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="승인 완료"
      >
        <SuccessContent>
          <SuccessIcon>✓</SuccessIcon>
          <SuccessMessage>작가 승인이 완료되었습니다!</SuccessMessage>
          <SuccessDetail>
            {applicationData.authorName}님이 작가로 승인되었습니다.
          </SuccessDetail>
        </SuccessContent>
      </Modal>
    </Container>
  );
};

export default ManageAuthorDetail;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: 5rem; /* AdminHeader 높이만큼 여백 추가 */
`;

const Content = styled.main`
  max-width: 50rem;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-bottom: 0.0625rem solid #e9ecef;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #101010;
  margin: 0;
`;

const Section = styled.section`
  background-color: #ffffff;
  border: 0.0625rem solid #e9ecef;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
`;

const ApplicationInfo = styled.div`
  margin-bottom: 2.5rem;
`;

const InfoRow = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #101010;
  font-weight: 500;
`;

const IntroductionValue = styled.div`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  white-space: pre-line;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 0.25rem solid #101010;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #6c757d;
  border: 0.0625rem solid #6c757d;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #101010;
  }
`;

const ApproveButton = styled.button`
  background-color: #101010;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #333333;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.125rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  color: #101010;
  margin-bottom: 1rem;
`;

const BackButton = styled.button`
  background-color: #101010;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

const SuccessContent = styled.div`
  text-align: center;
  padding: 1rem 0;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #101010;
  margin-bottom: 0.5rem;
`;

const SuccessDetail = styled.p`
  color: #6c757d;
  margin-bottom: 0;
`;
