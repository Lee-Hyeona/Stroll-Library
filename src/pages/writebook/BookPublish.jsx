import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../service/axios";

function BookPublish() {
  const navigate = useNavigate();
  const { draftId } = useParams();

  // 상태 관리 - 단순화
  const [isLoading, setIsLoading] = useState(true);
  const [aiData, setAiData] = useState(null);

  // 표지 재생성 관련 상태
  const [coverModification, setCoverModification] = useState("");
  const [isRegeneratingCover, setIsRegeneratingCover] = useState(false);

  // AI 데이터 폴링 (1초마다)
  useEffect(() => {
    if (!draftId) {
      alert("잘못된 접근입니다.");
      navigate("/write");
      return;
    }

    const pollAiData = async () => {
      try {
        const response = await apiClient.get(`/ai/${draftId}`);
        console.log("AI 데이터 응답:", response.data);

        // API 성공시 데이터 설정하고 로딩 종료
        setAiData(response.data);
        setIsLoading(false);
      } catch (error) {
        // 실패시 계속 로딩 상태 유지 (1초 후 재시도)
        console.error("AI 데이터 로딩 실패:", error);
      }
    };

    // 즉시 첫 호출
    pollAiData();

    // 1초마다 폴링 (성공할 때까지)
    const interval = setInterval(() => {
      if (!isLoading) {
        clearInterval(interval);
        return;
      }
      pollAiData();
    }, 1000);

    // 컴포넌트 언마운트시 폴링 정리
    return () => clearInterval(interval);
  }, [draftId, navigate, isLoading]);

  // 요약 내용 수정 핸들러
  const handleSummaryChange = (e) => {
    setAiData({
      ...aiData,
      summary: e.target.value,
    });
  };

  // 표지 수정사항 입력 핸들러
  const handleCoverModificationChange = (e) => {
    setCoverModification(e.target.value);
  };

  // 표지 재생성 핸들러
  const handleRegenerateCover = async () => {
    if (!coverModification.trim()) {
      alert("표지 수정사항을 입력해주세요.");
      return;
    }

    setIsRegeneratingCover(true);

    // 재생성 요청
    try {
      await apiClient.post(`/ai/${draftId}/regenerate`, {
        userPrompt: coverModification,
      });
      console.log("표지 재생성 요청 전송됨");
    } catch (error) {
      console.error("표지 재생성 요청 실패:", error);
      // 요청 실패해도 폴링을 시작함 (이미 처리 중일 수 있음)
    }

    // 재생성 폴링 시작 (1초마다)
    const pollRegeneratedData = async () => {
      try {
        const response = await apiClient.get(`/ai/${draftId}`);
        console.log("재생성 폴링 응답:", response.data);

        // 성공시 coverImageUrl만 업데이트 (summary는 유지)
        setAiData((prevData) => ({
          ...prevData,
          coverImageUrl: response.data.coverImageUrl,
          // summary는 사용자가 수정했을 수 있으므로 유지
        }));

        setIsRegeneratingCover(false);
        setCoverModification(""); // 입력 필드 초기화
        alert("표지가 재생성되었습니다!");
      } catch (error) {
        // 실패시 계속 재생성 로딩 상태 유지
        console.error("재생성 폴링 실패:", error);
      }
    };

    // 즉시 첫 폴링
    pollRegeneratedData();

    // 1초마다 폴링 (성공할 때까지)
    const regenerateInterval = setInterval(() => {
      if (!isRegeneratingCover) {
        clearInterval(regenerateInterval);
        return;
      }
      pollRegeneratedData();
    }, 1000);

    // 폴링 정리는 isRegeneratingCover 상태 변경시 자동으로 처리됨
  };

  // 출간 신청 핸들러
  const handlePublishRequest = async () => {
    if (!aiData) {
      alert("AI 데이터가 준비되지 않았습니다.");
      return;
    }

    if (window.confirm("정말로 출간 신청하시겠습니까?")) {
      try {
        const requestData = {
          summary: aiData.summary,
        };

        const response = await apiClient.post(
          `/ai/${draftId}/complete`,
          requestData
        );

        // 201 응답 확인
        if (response.status === 200) {
          alert("출간 신청이 완료되었습니다!");
          navigate("/");
        }
      } catch (error) {
        console.error("출간 신청 실패:", error);
        alert("출간 신청에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Container>
      <PageTitle>책 출간 준비</PageTitle>

      {isLoading ? (
        <LoadingContainer>
          <LoadingText>AI가 책 정보를 생성하고 있습니다...</LoadingText>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <ContentWrapper>
          <Section>
            <CategoryText>{aiData.category}</CategoryText>
          </Section>

          <Section>
            <SectionTitle>예상 포인트</SectionTitle>
            <PointsText>{aiData.price}p</PointsText>
          </Section>

          <Section>
            <SectionTitle>책 줄거리</SectionTitle>
            <SummaryDescription>
              AI가 생성한 줄거리입니다. 내용을 직접 수정할 수 있습니다.
            </SummaryDescription>
            <SummaryTextarea
              value={aiData.summary}
              onChange={handleSummaryChange}
              placeholder="AI가 생성한 줄거리를 수정할 수 있습니다."
            />
          </Section>

          <Section>
            <SectionTitle>책 표지</SectionTitle>
            <CoverContainer>
              <CoverImageWrapper>
                <CoverImage src={aiData.coverImageUrl} alt="책 표지" />
              </CoverImageWrapper>
              <CoverControls>
                <SectionTitle style={{ marginBottom: "0.5rem" }}>
                  책 표지 수정 사항
                </SectionTitle>
                <CoverModificationInput
                  value={coverModification}
                  onChange={handleCoverModificationChange}
                  placeholder="표지 수정사항을 입력하세요 (예: 더 밝은 색상으로, 글씨 크기를 크게)"
                  disabled={isRegeneratingCover}
                />
                <RegenerateCoverButton
                  onClick={handleRegenerateCover}
                  disabled={isRegeneratingCover || !coverModification.trim()}
                >
                  {isRegeneratingCover ? "재생성 중..." : "표지 재생성하기"}
                </RegenerateCoverButton>
              </CoverControls>
            </CoverContainer>
          </Section>

          <PublishButtonContainer>
            <PublishButton onClick={handlePublishRequest}>
              출간 신청
            </PublishButton>
          </PublishButtonContainer>
        </ContentWrapper>
      )}
    </Container>
  );
}

export default BookPublish;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 1rem 2rem 1rem;
  min-height: 100vh;
`;

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-align: left;
`;

const SummaryDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  font-style: italic;
  text-align: left;
`;

const CategoryText = styled.div`
  display: block;
  width: fit-content;
  padding: 0.5rem 1rem;
  background-color: #000;
  color: white;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  margin: 0;
`;

const PointsText = styled.div`
  padding: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-align: left;

  &::before {
    content: "💰 ";
    margin-right: 0.25rem;
  }
`;

const SummaryTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 200px;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  overflow-y: auto;
  text-align: left;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const CoverContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  width: 100%;
`;

const CoverImageWrapper = styled.div`
  width: 240px;
  position: relative;
  flex-shrink: 0;
  &::after {
    content: "";
    display: block;
    padding-bottom: 150%; /* 3:2 비율 */
  }
`;

const CoverImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #ccc;
`;

const CoverControls = styled.div`
  flex: 1;
  max-width: calc(100% - 240px - 2rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CoverModificationInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
  box-sizing: border-box;
  min-height: 120px;
  max-height: 200px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const RegenerateCoverButton = styled.button`
  align-self: flex-end;
  padding: 0.75rem 2rem;
  background-color: #a3a5a7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 48px;

  &:hover:not(:disabled) {
    background-color: #8f9194;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PublishButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const PublishButton = styled.button`
  padding: 1rem 3rem;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }
`;
