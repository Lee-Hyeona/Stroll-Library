import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ModalButton } from "../../components/bookDetail/ModalButton";
import Modal from "../../components/common/Modal";
import { BDS } from "../../styles/BDS";
import apiClient from "../../service/axios";
import { useAuthStore } from "../../store/auth";

// 테스트용 가상 데이터 (실제 API 대신 사용)
const mockBook = {
  id: 0,
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

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const { userInfo } = useAuthStore((state) => state);
  // 권한 관련 상태
  const [hasAccess, setHasAccess] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(false);
  const [isLoadingPurchase, setIsLoadingPurchase] = useState(false);
  const [isLoadingPurchaseComplete, setIsLoadingPurchaseComplete] =
    useState(false);

  const [purchaseData, setPurchaseData] = useState(null);
  // 구매 관련 모달 상태
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPurchaseCompleteModalOpen, setIsPurchaseCompleteModalOpen] =
    useState(false);
  const [isInsufficientPointsModalOpen, setIsInsufficientPointsModalOpen] =
    useState(false);

  // 유저 포인트 상태
  const [userPoints, setUserPoints] = useState(2000); // 테스트용 초기 포인트 (포인트 부족 테스트를 위해서는 500 등으로 설정)

  useEffect(() => {
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

  const checkAccess = () => {
    setIsLoadingAccess(true);
    console.log(userInfo);
    const res = apiClient
      .get(
        `/userAccessProfiles/${userInfo?.id}/accesstocontent?productId=${id}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.hasAccess) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.error("책 정보를 불러오는 데 실패했습니다", err);
        return false;
      })
      .finally(() => {
        setIsLoadingAccess(false);
      });

    return res;
  };

  // 책 읽기 버튼 클릭 핸들러
  const handleReadBook = async () => {
    if (!userInfo) {
      setIsLoginModalOpen(true);
      return;
    }
    const hasBookAccess = await checkAccess();

    if (hasBookAccess) {
      // 권한이 있으면 BookContent 페이지로 이동
      navigate(`/books/${id}/content`);
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
  const handlePurchase = async () => {
    setIsLoadingPurchase(true);
    const res = await apiClient
      .get(`/userAccessProfiles/${userInfo?.id}/checkpurchaseability`)
      .then((res) => {
        setPurchaseData(res?.data);
      })
      .catch((err) => {
        console.error("구매 가능 여부를 확인하는 데 실패했습니다", err);
      })
      .finally(() => {
        setIsLoadingPurchase(false);
        setIsModalOpen(false);
      });
    // 포인트 확인 후 적절한 모달 표시
    if (res?.data?.canPurchase) {
      setIsPurchaseModalOpen(true);
    } else {
      setIsInsufficientPointsModalOpen(true);
    }
  };

  // 실제 구매 처리
  const handleConfirmPurchase = () => {
    // 포인트 차감
    // setUserPoints(userPoints - book.price);
    // 구매한 책 목록에 추가
    // setOwnedBooks([...ownedBooks, book.id]);
    // 구매 확인 모달 닫고 완료 모달 열기
    setIsPurchaseModalOpen(false);
    setIsPurchaseCompleteModalOpen(true);
  };

  // 구매 완료 후 모달 닫기
  const handlePurchaseComplete = () => {
    setIsPurchaseCompleteModalOpen(false);
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
        <ReadButton onClick={handleReadBook} disabled={isLoadingAccess}>
          {isLoadingAccess ? "로딩중..." : "책 읽기"}
        </ReadButton>
      </ReadButtonWrapper>

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
            {isLoadingPurchase ? "로딩중..." : "구매하기"}
          </ModalActionButton>
        </ModalButtonGroup>
      </Modal>
      {/* 로그인 요청 모달 */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="로그인 필요"
      >
        <ModalText>로그인이 필요합니다</ModalText>
        <ModalButtonGroup>
          <ModalActionButton
            onClick={() => setIsLoginModalOpen(false)}
            variant="secondary"
          >
            닫기
          </ModalActionButton>
        </ModalButtonGroup>
      </Modal>
      {/* 구매 확인 모달 */}
      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        title="구매 확인"
      >
        <PurchaseInfoWrapper>
          <PurchaseInfoItem>
            <PurchaseInfoLabel>구매 포인트</PurchaseInfoLabel>
            <PurchaseInfoValue>{purchaseData?.productPrice}p</PurchaseInfoValue>
          </PurchaseInfoItem>
          <PurchaseInfoItem>
            <PurchaseInfoLabel>내 포인트</PurchaseInfoLabel>
            <PurchaseInfoValue>{purchaseData?.userPoints}p</PurchaseInfoValue>
          </PurchaseInfoItem>
          <PurchaseInfoItem>
            <PurchaseInfoLabel>구매 후 내 포인트</PurchaseInfoLabel>
            <PurchaseInfoValue>
              {purchaseData?.remainingPoints}p
            </PurchaseInfoValue>
          </PurchaseInfoItem>
        </PurchaseInfoWrapper>
        <ModalButtonGroup>
          <ModalActionButton
            onClick={() => setIsPurchaseModalOpen(false)}
            variant="secondary"
          >
            취소
          </ModalActionButton>
          <ModalActionButton onClick={handleConfirmPurchase} variant="primary">
            구매하기
          </ModalActionButton>
        </ModalButtonGroup>
      </Modal>

      {/* 구매 완료 모달 */}
      <Modal
        isOpen={isPurchaseCompleteModalOpen}
        onClose={handlePurchaseComplete}
        title="구매 완료"
      >
        <ModalText>구매가 완료되었습니다!</ModalText>
        <ModalButtonGroup>
          <ModalActionButton onClick={handlePurchaseComplete} variant="primary">
            닫기
          </ModalActionButton>
        </ModalButtonGroup>
      </Modal>

      {/* 포인트 부족 모달 */}
      <Modal
        isOpen={isInsufficientPointsModalOpen}
        onClose={() => setIsInsufficientPointsModalOpen(false)}
        title="포인트 부족"
      >
        <PurchaseInfoWrapper>
          <PurchaseInfoItem>
            <PurchaseInfoLabel>구매 포인트</PurchaseInfoLabel>
            <PurchaseInfoValue>{purchaseData?.productPrice}p</PurchaseInfoValue>
          </PurchaseInfoItem>
          <PurchaseInfoItem>
            <PurchaseInfoLabel>내 포인트</PurchaseInfoLabel>
            <PurchaseInfoValue>{purchaseData?.userPoints}p</PurchaseInfoValue>
          </PurchaseInfoItem>
        </PurchaseInfoWrapper>
        <ModalText
          style={{ color: "#ff4444", fontWeight: "bold", textAlign: "center" }}
        >
          포인트가 부족합니다
        </ModalText>
        <ModalButtonGroup>
          <ModalActionButton
            onClick={() => setIsInsufficientPointsModalOpen(false)}
            variant="primary"
          >
            닫기
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
  justify-content: space-between;
  margin-bottom: 0.625rem;
  margin-top: 1.5rem;
`;

const PointLabel = styled.span`
  font-size: 1rem;
  color: ${BDS.palette.pointblack};

  color: #333d4b;
`;

const PointValue = styled.span`
  font-size: 1rem;
  color: ${BDS.palette.pointblack};
  font-weight: 600;

  &::before {
    content: "💰 ";
    margin-right: 0.25rem;
  }
`;

const DateInfo = styled.p`
  margin-bottom: 0.625rem;
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
`;

const SummaryWrapper = styled.div`
  flex: 0 1 auto;
  margin-top: 0.5rem;
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
  max-height: 23.75rem;
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

const PurchaseInfoWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const PurchaseInfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 0.0625rem solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    font-weight: 600;
  }
`;

const PurchaseInfoLabel = styled.span`
  color: ${BDS.palette.pointblack};
  font-size: 1rem;
`;

const PurchaseInfoValue = styled.span`
  color: ${BDS.palette.pointblack};
  font-size: 1rem;
  font-weight: 600;
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
