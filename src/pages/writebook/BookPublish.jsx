import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

function BookPublish() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookData = location.state?.bookData;

  const [publishData, setPublishData] = useState({
    title: "",
    content: "",
    category: "",
    expectedPoints: 0,
    summary: "",
    coverImage: "",
    coverModification: "",
  });

  const [isGenerating, setIsGenerating] = useState(true);
  const [isRegeneratingCover, setIsRegeneratingCover] = useState(false);

  // 카테고리 옵션
  const categories = ["문학", "경제", "자기계발", "라이프스타일", "기타"];

  useEffect(() => {
    if (!bookData) {
      alert("잘못된 접근입니다.");
      navigate("/write");
      return;
    }

    // AI API 호출 시뮬레이션
    generateBookData();
  }, [bookData]);

  const generateBookData = async () => {
    setIsGenerating(true);

    // AI API 호출 시뮬레이션 (실제로는 실제 API 호출)
    setTimeout(() => {
      const aiGeneratedData = {
        title: bookData.title,
        content: bookData.content,
        category: categories[Math.floor(Math.random() * categories.length)], // AI가 분류
        expectedPoints: Math.floor(Math.random() * 2000) + 500, // AI가 산정 (500-2500)
        summary: `이 책은 "${bookData.title}"라는 제목으로, 독자들에게 깊은 감동과 인사이트를 전달하는 작품입니다. 작가는 세심한 관찰력과 뛰어난 표현력으로 인간의 내면을 섬세하게 그려내었으며, 현대 사회의 복잡한 문제들을 새로운 시각으로 조명합니다. 책의 내용은 일상에서 마주하는 다양한 상황들을 통해 삶의 의미를 찾아가는 여정을 담고 있습니다.`, // AI가 요약
        coverImage: `https://picsum.photos/300/400?random=${Date.now()}`, // AI가 생성한 표지
        coverModification: "",
      };

      setPublishData(aiGeneratedData);
      setIsGenerating(false);
    }, 3000); // 3초 로딩 시뮬레이션
  };

  const handleSummaryChange = (e) => {
    setPublishData({
      ...publishData,
      summary: e.target.value,
    });
  };

  const handleCoverModificationChange = (e) => {
    setPublishData({
      ...publishData,
      coverModification: e.target.value,
    });
  };

  const handleRegenerateCover = async () => {
    if (!publishData.coverModification.trim()) {
      alert("표지 수정사항을 입력해주세요.");
      return;
    }

    setIsRegeneratingCover(true);

    // AI API 호출 시뮬레이션
    setTimeout(() => {
      setPublishData({
        ...publishData,
        coverImage: `https://picsum.photos/300/400?random=${Date.now()}`,
        coverModification: "",
      });
      setIsRegeneratingCover(false);
      alert("표지가 재생성되었습니다!");
    }, 2000);
  };

  const handlePublishRequest = () => {
    if (window.confirm("정말로 출간 신청하시겠습니까?")) {
      // 출간된 책 목록에 추가 (localStorage 사용)
      const publishedBooks = JSON.parse(
        localStorage.getItem("publishedBooks") || "[]"
      );
      const newBook = {
        id: Date.now(),
        title: publishData.title,
        content: publishData.content,
        author: "홍길동", // 실제로는 현재 사용자 정보
        categoryName: publishData.category,
        createDate: new Date().toISOString(),
        updateDate: new Date().toISOString(),
        coverImgUrl: publishData.coverImage,
        price: publishData.expectedPoints,
        summary: publishData.summary,
      };

      publishedBooks.push(newBook);
      localStorage.setItem("publishedBooks", JSON.stringify(publishedBooks));

      alert("출간 신청이 완료되었습니다!");
      navigate("/");
    }
  };

  if (!bookData) {
    return <Container>로딩 중...</Container>;
  }

  return (
    <Container>
      <PageTitle>책 출간 준비</PageTitle>

      {isGenerating ? (
        <LoadingContainer>
          <LoadingText>AI가 책 정보를 생성하고 있습니다...</LoadingText>
          <LoadingSpinner />
        </LoadingContainer>
      ) : (
        <ContentWrapper>
          <Section>
            <SectionTitle>책 제목</SectionTitle>
            <ReadOnlyField>{publishData.title}</ReadOnlyField>
          </Section>

          <Section>
            <SectionTitle>책 내용</SectionTitle>
            <ContentScrollBox>{publishData.content}</ContentScrollBox>
          </Section>

          <Section>
            <SectionTitle>카테고리</SectionTitle>
            <CategoryText>{publishData.category}</CategoryText>
          </Section>

          <Section>
            <SectionTitle>예상 포인트</SectionTitle>
            <PointsText>{publishData.expectedPoints}p</PointsText>
          </Section>

          <Section>
            <SectionTitle>책 줄거리</SectionTitle>
            <SummaryDescription>
              AI가 생성한 줄거리입니다. 내용을 직접 수정할 수 있습니다.
            </SummaryDescription>
            <SummaryTextarea
              value={publishData.summary}
              onChange={handleSummaryChange}
              placeholder="AI가 생성한 줄거리를 수정할 수 있습니다."
            />
          </Section>

          <Section>
            <SectionTitle>책 표지</SectionTitle>
            <CoverContainer>
              <CoverImageWrapper>
                <CoverImage src={publishData.coverImage} alt="책 표지" />
              </CoverImageWrapper>
              <CoverControls>
                <CoverModificationInput
                  value={publishData.coverModification}
                  onChange={handleCoverModificationChange}
                  placeholder="표지 수정사항을 입력하세요 (예: 더 밝은 색상으로, 글씨 크기를 크게)"
                />
                <RegenerateCoverButton
                  onClick={handleRegenerateCover}
                  disabled={isRegeneratingCover}
                >
                  {isRegeneratingCover ? "생성 중..." : "표지 재생성하기"}
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

const ReadOnlyField = styled.div`
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #333;
  font-size: 1rem;
  text-align: left;
`;

const ContentScrollBox = styled.div`
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
  font-size: 0.95rem;
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
    padding-bottom: 150%; /* 3:2 비율 (BookDetail과 동일) */
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
  max-width: calc(100% - 240px - 2rem); /* 전체에서 이미지 너비와 gap 제외 */
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
  min-height: 300px;
  max-height: 300px;
  resize: none;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const RegenerateCoverButton = styled.button`
  align-self: flex-end; /* 🔥 부모 안에서 오른쪽 끝 정렬 */
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
