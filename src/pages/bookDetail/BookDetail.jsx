import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ModalButton } from "../../components/bookDetail/ModalButton";
import Modal from "../../components/common/Modal";
import { BDS } from "../../styles/BDS";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  // 권한 관련 상태
  const [hasAccess, setHasAccess] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 가상의 사용자 권한 상태 (실제 구현시 전역 상태나 API에서 가져옴)
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [ownedBooks, setOwnedBooks] = useState([]);

  useEffect(() => {
    // 테스트용 가상 데이터 (실제 API 대신 사용)
    const mockBook = {
      id: id,
      coverImgUrl:
        "https://cdn.openai.com/API/docs/images/sunlit_lounge_result.png", // 이미지 없으면 테두리만 보임
      title: "가상의 책 제목",
      author: "홍길동",
      categoryName: "테스트 카테고리",
      createDate: "2024-01-01T10:00:00Z",
      updateDate: "2024-05-01T12:00:00Z",
      content:
        "이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n이것은 가상의 줄거리 입니다. \n",
      price: 1000, // 포인트 가격
      fullContent: `제1장 시작

이것은 책의 전체 내용입니다. 
실제로는 훨씬 긴 내용이 여기에 들어갑니다.

여러 문단으로 구성되어 있으며,
각 문단은 줄바꿈으로 구분됩니다.

제2장 전개

이야기가 계속 진행됩니다...

제3장 결말

마지막 장입니다.`,
    };
    setBook(mockBook);

    // 가상의 사용자 권한 설정 (테스트용)
    // 실제로는 사용자 정보 API에서 가져와야 함
    setIsSubscribed(false); // 테스트를 위해 false로 설정
    setOwnedBooks([]); // 테스트를 위해 빈 배열로 설정

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

  // 책 읽기 권한 확인
  const checkAccess = () => {
    if (!book) return false;

    // 구독 중이거나 책을 구매한 경우 권한 있음
    return isSubscribed || ownedBooks.includes(book.id);
  };

  // 책 읽기 버튼 클릭 핸들러
  const handleReadBook = () => {
    const hasBookAccess = checkAccess();

    if (hasBookAccess) {
      // 권한이 있으면 책 내용 표시
      setShowContent(true);
    } else {
      // 권한이 없으면 모달 표시
      setIsModalOpen(true);
    }
  };

  // 구독하기 버튼 핸들러
  const handleSubscribe = () => {
    setIsModalOpen(false);
    navigate("/subscription"); // 구독 페이지로 이동
  };

  // 구매하기 버튼 핸들러
  const handlePurchase = () => {
    setIsModalOpen(false);
    navigate(`/purchase/${id}`); // 구매 페이지로 이동
  };

  if (!book) return <Wrapper>로딩 중...</Wrapper>;

  return (
    <Wrapper>
      <Container>
        <ImageWrapper>
          <CoverImage
            src={book.coverImgUrl}
            alt="표지"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
              e.target.style.background = "#fff";
              e.target.style.border = "1px solid #ccc";
            }}
          />
        </ImageWrapper>

        <ContentWrapper>
          <Category>{book.categoryName}</Category>
          <Title>{book.title}</Title>

          <DateInfo>{new Date(book.createDate).toLocaleDateString()}</DateInfo>

          <AuthorWrapper>
            <AuthorName>{book.author}</AuthorName>
          </AuthorWrapper>

          <PointWrapper>
            <PointLabel>포인트</PointLabel>
            <PointValue>{book.price}p</PointValue>
          </PointWrapper>

          <SummaryWrapper>
            <SummaryTitle>줄거리</SummaryTitle>
            <SummaryContent>{book.content}</SummaryContent>
          </SummaryWrapper>
        </ContentWrapper>
      </Container>
      <ReadButtonWrapper>
        <ReadButton onClick={handleReadBook}>책 읽기</ReadButton>
      </ReadButtonWrapper>

      {/* 책 내용 표시 영역 */}
      {showContent && (
        <BookContentWrapper>
          <BookContentTitle>책 내용</BookContentTitle>
          <BookContentText>{book.fullContent}</BookContentText>
        </BookContentWrapper>
      )}

      {/* 권한 없을 때 표시되는 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="책 읽기 권한이 필요합니다"
      >
        <ModalText>
          이 책을 읽기 위해서는 구독하거나 개별 구매가 필요합니다.
        </ModalText>
        <ModalButtonGroup>
          <ModalActionButton onClick={handleSubscribe} variant="primary">
            구독하기
          </ModalActionButton>
          <ModalActionButton onClick={handlePurchase} variant="secondary">
            구매하기 ({book.price}p)
          </ModalActionButton>
        </ModalButtonGroup>
      </Modal>
    </Wrapper>
  );
};

export default BookDetailPage;

// styled-components

const Wrapper = styled.div`
  margin-top: 6.25rem;
  margin-left: 1.25rem;
  font-weight: bold;
`;

const Container = styled.div`
  display: flex;
  padding: 0 5rem;
  gap: 4rem;
  justify-content: space-between;
  align-items: flex-start;
`;

const ImageWrapper = styled.div`
  width: 40%;
  position: relative;
  &::after {
    content: "";
    display: block;
    padding-bottom: 150%;
  }
  background-color: green;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border: 0.0625rem solid #ccc;
`;

const ContentWrapper = styled.div`
  width: 50%;
  position: relative;
  padding: 0;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.3125rem rgba(0, 0, 0, 0.03);
  text-align: left;
  display: flex;
  flex-direction: column;
`;

const Category = styled.p`
  color: #888;
  margin: 0;
  font-size: 0.9375rem;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #333d4b;
  font-size: 1.25rem;
`;

const AuthorWrapper = styled.div`
  margin-bottom: 0.625rem;
`;

const AuthorName = styled.p`
  margin: 0 0.0625rem 0 0;
  font-size: 1rem;
  color: #333d4b;
`;

const PointWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.625rem;
  gap: 0.5rem;
`;

const PointLabel = styled.span`
  font-size: 1rem;
  color: ${BDS.palette.pointblack};
  font-weight: 500;
`;

const PointValue = styled.span`
  font-size: 1rem;
  color: ${BDS.palette.pointblack};
  font-weight: 600;
`;

const DateInfo = styled.p`
  margin-bottom: 0.625rem;
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
`;

const SummaryWrapper = styled.div`
  flex: 0 1 auto;
  margin-top: 1.875rem;
  position: relative;
  border-radius: 0.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const SummaryTitle = styled.p`
  margin-top: 1rem;
  margin-left: 0;
  color: #333d4b;
  font-size: 1rem;
`;

const SummaryContent = styled.p`
  white-space: pre-wrap;
  overflow-y: auto;
  line-height: 1.6;
  font-size: 0.9rem;
  margin-left: 0;
  color: #555;
  font-weight: 500;
  max-height: 16rem;
  flex: 1;
`;

const ReadButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 2rem;
  padding: 0 5rem;
`;

const ReadButton = styled.button`
  width: calc(100% - 10rem);
  background-color: ${BDS.palette.black};
  color: ${BDS.palette.white};
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #333;
    transform: translateY(-0.0625rem);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BookContentWrapper = styled.div`
  margin: 2rem 5rem;
  padding: 2rem;
  background-color: ${BDS.palette.white};
  border-radius: 0.5rem;
  box-shadow: 0 0 0.3125rem rgba(0, 0, 0, 0.1);
`;

const BookContentTitle = styled.h3`
  color: ${BDS.palette.pointblack};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 0.125rem solid #eee;
  padding-bottom: 0.5rem;
`;

const BookContentText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1rem;
  color: ${BDS.palette.pointblack};
  font-weight: 400;
`;

const ModalText = styled.p`
  color: ${BDS.palette.pointblack};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) =>
    variant === "primary"
      ? `
        background-color: ${BDS.palette.black};
        color: ${BDS.palette.white};
        
        &:hover {
          background-color: #333;
        }
      `
      : `
        background-color: ${BDS.palette.white};
        color: ${BDS.palette.pointblack};
        border: 0.0625rem solid ${BDS.palette.pointblack};
        
        &:hover {
          background-color: #f8f9fa;
        }
      `}
`;
