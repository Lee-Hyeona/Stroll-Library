// // components/common/Card.jsx
// import React from "react";
// import styled from "styled-components";

// const Card = ({ title, author, date, thumbnail, category }) => (
//   <CardContainer>
//     <ThumbnailWrapper>
//       <div id="filter"></div>
//       <img src={thumbnail} alt={title} />
//     </ThumbnailWrapper>
//     <Meta>
//       <Category>{category}</Category>
//       <Title>{title}</Title>
//       <Author>{author}</Author>
//       <Date>{date}</Date>
//     </Meta>
//   </CardContainer>
// );

// export default Card;

// // 스타일 컴포넌트

// const CardContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   position: relative;
// `;

// const ThumbnailWrapper = styled.div`
//   width: 100%;
//   object-fit: cover;
//   border-radius: 4px;
//   position: relative;
//   &::after {
//     content: "";
//     display: block;
//     padding-bottom: 175%;
//     background-color: green;
//   }
//   & img {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }
//   & #filter {
//     width: 100%;
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
//     z-index: 1;
//   }
//   border-radius: 0.5rem;
//   overflow: hidden;
// `;

// const Meta = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 100%;
//   margin-top: 1rem;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   padding: 1rem;
//   color: white;
//   z-index: 2;
// `;

// const Category = styled.div`
//   font-size: 0.8rem;
//   color: ${({ theme }) => theme.palette.categray};
// `;

// const Title = styled.div`
//   font-weight: 700;
//   margin-top: 0.2rem;
//   color: ${({ theme }) => theme.palette.white};
// `;

// const Author = styled.div`
//   font-size: 0.85rem;
//   margin-top: 0.4rem;
//   color: ${({ theme }) => theme.palette.auwhite};
// `;

// const Date = styled.div`
//   font-size: 0.75rem;
//   color: ${({ theme }) => theme.palette.categray};
//   margin-top: 0.2rem;
// `;
