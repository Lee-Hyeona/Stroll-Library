import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BDS } from "../../styles/BDS";
import apiClient from "../../service/axios";

const BookContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get(`/products/${id}/content`);
        console.log("책 내용 응답:", response.data);

        // API 응답 구조에 맞게 데이터 매핑
        const bookData = {
          id: response.data.id,
          title: response.data.title,
          author: response.data.authorNickname, // API의 authorNickname을 author로 매핑
          fullContent: response.data.content, // API의 content를 fullContent로 매핑
          isBestseller: response.data.isBestseller,
        };

        setBook(bookData);
      } catch (err) {
        console.error("책 내용을 불러오는 데 실패했습니다:", err);
        setError("책 내용을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookContent();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  if (loading) return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  if (error) return <ErrorWrapper>{error}</ErrorWrapper>;
  if (!book)
    return <LoadingWrapper>책 정보를 찾을 수 없습니다.</LoadingWrapper>;

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={handleGoBack}>← 뒤로가기</BackButton>
        <BookInfo>
          <BookTitle>{book?.title || "제목 없음"}</BookTitle>
          <BookAuthor>저자: {book?.author || "작가 정보 없음"}</BookAuthor>
        </BookInfo>
      </Header>

      <ContentWrapper>
        <BookContentText>
          {book?.fullContent || "내용이 없습니다."}
        </BookContentText>
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

const ErrorWrapper = styled.div`
  margin-top: 6.25rem;
  text-align: center;
  font-size: 1.1rem;
  color: #e74c3c;
  padding: 2rem;
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
