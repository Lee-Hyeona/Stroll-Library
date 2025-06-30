// components/common/Card.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = ({ book }) => {
  const navigate = useNavigate();
  return (
    <CardContainer onClick={() => navigate(`books/${book.id}`)}>
      <ThumbnailWrapper>
        <div>
          <img src={book.coverImageUrl} alt={book.title} />
          {/* 베스트셀러 뱃지 - 베스트셀러인 경우에만 표시 */}
          {book.isBestseller && (
            <BestsellerBadge>
              <img src="/logo/orangebestseller.svg" alt="베스트셀러" />
            </BestsellerBadge>
          )}
        </div>
      </ThumbnailWrapper>
      <Meta>
        <Category>{book.categoryName}</Category>
        <Title>{book.title}</Title>
        <Author>{book.authorNickname}</Author>
        <Date>{book.publishedAt.substring(0, 10)}</Date>
      </Meta>
    </CardContainer>
  );
};

export default Card;

// 스타일 컴포넌트

const CardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #eeeeee;
  }
  transition: 0.5s;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
  position: relative;
  &::after {
    content: "";
    display: block;
    padding-bottom: 120%;
  }
  & > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  & > div > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.5s;
    &:hover {
      transform: scale(1.2);
    }
  }
`;

// 베스트셀러 뱃지 스타일
const BestsellerBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 70px;
  height: 70px;
  z-index: 10;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }

  /* 호버 시 뱃지는 확대되지 않도록 */
  &:hover {
    transform: none;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
`;

const Category = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.palette.categray};
`;

const Title = styled.div`
  font-weight: 700;
  margin-top: 0.2rem;
  color: ${({ theme }) => theme.palette.pointblack};
`;

const Author = styled.div`
  font-size: 0.85rem;
  margin-top: 0.4rem;
  color: ${({ theme }) => theme.palette.aublack};
`;

const Date = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.palette.categray};
  margin-top: 0.2rem;
`;
