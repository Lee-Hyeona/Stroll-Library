import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BDS } from "../../styles/BDS";

const BookContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    // 테스트용 가상 데이터 (실제 API 대신 사용)
    const mockBook = {
      id: id,
      title: "가상의 책 제목",
      author: "홍길동",
      fullContent: `제1장 시작의 이야기

이것은 책의 전체 내용입니다. 
실제로는 훨씬 긴 내용이 여기에 들어갑니다.

여러 문단으로 구성되어 있으며,
각 문단은 줄바꿈으로 구분됩니다.

이 책은 독자들에게 깊은 감동을 주는 이야기를 담고 있습니다.
주인공의 여정을 통해 우리는 삶의 의미를 되돌아보게 됩니다.

제2장 전개와 갈등

이야기가 계속 진행됩니다. 주인공은 여러 어려움에 직면하게 되고,
이를 해결해 나가는 과정에서 성장하게 됩니다.

갈등의 순간들이 이야기에 긴장감을 더하며,
독자들은 주인공과 함께 감정의 기복을 경험하게 됩니다.

제3장 절정과 해결

드디어 이야기의 절정에 도달합니다.
모든 갈등이 한 곳으로 모이며, 주인공은 중요한 선택을 해야 합니다.

이 선택이 이야기의 방향을 결정하며,
독자들에게 깊은 여운을 남기게 됩니다.

제4장 결말과 성찰

마지막 장입니다. 모든 것이 해결되고,
주인공은 자신의 여정을 돌아보며 성찰하게 됩니다.

독자들 또한 이 이야기를 통해 무언가를 배우고,
새로운 시각을 갖게 되는 계기가 될 것입니다.

이것으로 이야기가 마무리됩니다.
긴 여정을 함께해 주셔서 감사합니다.`,
    };
    setBook(mockBook);

    // 실제 API 연동 시 아래 주석 해제하고 위 mockBook 삭제하세요.
    /*
    axios
      .get(`http://localhost:8080/api/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => {
        console.error("책 정보를 불러오는 데 실패했습니다!!", err);
      });
    */
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  if (!book) return <LoadingWrapper>로딩 중...</LoadingWrapper>;

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={handleGoBack}>← 뒤로가기</BackButton>
        <BookInfo>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>저자: {book.author}</BookAuthor>
        </BookInfo>
      </Header>

      <ContentWrapper>
        <BookContentText>{book.fullContent}</BookContentText>
      </ContentWrapper>
    </Wrapper>
  );
};

export default BookContent;

// Styled Components
const Wrapper = styled.div`
  margin-top: 6.25rem;
  padding: 2rem;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
`;

const LoadingWrapper = styled.div`
  margin-top: 6.25rem;
  text-align: center;
  font-size: 1.1rem;
  color: ${BDS.palette.pointblack};
`;

const Header = styled.div`
  border-bottom: 0.125rem solid #eee;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${BDS.palette.pointblack};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const BookInfo = styled.div`
  text-align: center;
`;

const BookTitle = styled.h1`
  color: ${BDS.palette.pointblack};
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const BookAuthor = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
`;

const ContentWrapper = styled.div`
  background-color: ${BDS.palette.white};
  border-radius: 0.5rem;
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.05);
`;

const BookContentText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${BDS.palette.pointblack};
  font-weight: 400;
  padding: 2rem;
  text-align: justify;
`;
