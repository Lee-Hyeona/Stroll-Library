import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { BDS } from "../../styles/BDS";
import Modal from "../../components/common/Modal";
import AdminHeader from "../../components/common/Header/AdminHeader";
import apiClient from "../../service/axios";
import { useUserInfo } from "../../store/auth";

const ManageAuthorDetail = () => {
  const [applicationData, setApplicationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const userInfo = useUserInfo();

  useEffect(() => {
    // 관리자 권한 확인
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/password");
      return;
    }

    const fetchAuthorDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.get(`/admin/requests/${userId}`);
        console.log(response.data); // 응답 데이터 구조 확인

        // response.data가 배열인지 객체인지 확인
        const authorRequest = Array.isArray(response.data)
          ? response.data.find((request) => request.userId === parseInt(userId))
          : response.data.userId === parseInt(userId)
          ? response.data
          : null;

        if (authorRequest) {
          setApplicationData({
            id: authorRequest.userId,
            user: authorRequest.accountId,
            authorName: authorRequest.authorNickname,
            introduction: authorRequest.authorProfile,
          });
        } else {
          setError("신청 정보를 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("작가 신청 정보 조회 실패:", error);
        setError("작가 신청 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorDetail();
  }, [userId, navigate]);

  const handleCancel = () => {
    navigate("/admin/authors");
  };

  const handleApprove = async () => {
    try {
      const requestData = {
        userId: userId,
      };
      setIsProcessing(true);

      // 작가 승인 API 호출
      const response = await apiClient.post(
        `/admin/requests/${userId}/approve`,
        requestData
      );

      // 성공 여부 체크 (선택)
      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        throw new Error("승인 실패: 서버 응답 오류");
      }
    } catch (error) {
      console.error("작가 승인 처리 실패:", error);
      alert("작가 승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
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

  if (error || !applicationData) {
    return (
      <Container>
        <AdminHeader />
        <ErrorMessage>
          <ErrorTitle>{error || "신청 정보를 찾을 수 없습니다"}</ErrorTitle>
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
              <InfoValue>{applicationData.user}</InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>작가명</InfoLabel>
              <InfoValue>{applicationData.authorName}</InfoValue>
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
