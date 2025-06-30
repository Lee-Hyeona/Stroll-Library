import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/common/Card";
import CategoryList from "../../components/common/CategoryList";
import axios from "axios";

// 임시 테스트 데이터 (베스트셀러 뱃지 테스트용)
const books = [
  {
    id: 1,
    title: "코코는 너무 귀워",
    authorNickname: "콩이",
    publishedAt: "2025-07-07T00:00:00",
    categoryName: "경제",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: true, // 베스트셀러
  },
  {
    id: 2,
    title: "멍멍이는 사랑",
    authorNickname: "초코",
    publishedAt: "2025-08-01T00:00:00",
    categoryName: "문학",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: false, // 일반 도서
  },
  {
    id: 3,
    title: "하루 10분 산책의 기적",
    authorNickname: "코코",
    publishedAt: "2025-09-11T00:00:00",
    categoryName: "라이프 스타일",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: true, // 베스트셀러
  },
  {
    id: 4,
    title: "개발자를 위한 실무 가이드",
    authorNickname: "김개발",
    publishedAt: "2025-09-15T00:00:00",
    categoryName: "IT",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: false, // 일반 도서
  },
  {
    id: 5,
    title: "성공하는 습관의 힘",
    authorNickname: "박성공",
    publishedAt: "2025-10-01T00:00:00",
    categoryName: "자기 계발",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: true, // 베스트셀러
  },
  {
    id: 6,
    title: "요리의 기본기",
    authorNickname: "최요리",
    publishedAt: "2025-10-05T00:00:00",
    categoryName: "기타",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: false, // 일반 도서
  },
  {
    id: 7,
    title: "투자의 정석",
    authorNickname: "이투자",
    publishedAt: "2025-10-10T00:00:00",
    categoryName: "경제",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: true, // 베스트셀러
  },
  {
    id: 8,
    title: "감정 관리의 기술",
    authorNickname: "정감정",
    publishedAt: "2025-10-15T00:00:00",
    categoryName: "기타",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: false, // 일반 도서
  },
  {
    id: 9,
    title: "마케팅의 심리학",
    authorNickname: "김마케팅",
    publishedAt: "2025-10-20T00:00:00",
    categoryName: "기타",
    coverImageUrl:
      "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
    isBestseller: true, // 베스트셀러
  },
];

export const Main = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookList, setBookList] = useState([]);

  // API 호출 함수 (현재 주석처리됨)
  // const fetchBookData = async () => {
  //   try {
  //     let url = import.meta.env.VITE_API_URL;
  //     url += `/api/books`;
  //     const response = await axios.get(url);
  //     console.log(response.data);
  //     setBookList(response.data.reverse());
  //   } catch (err) {
  //     console.error(
  //       "책 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.:",
  //       err
  //     );
  //     setBookList([]);
  //   }
  // };

  useEffect(() => {
    // API 호출 대신 임시 데이터 사용
    setBookList(books);

    // fetchBookData(); // API 호출 주석처리
  }, [selectedCategory]);

  return (
    <Container>
      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CardList>
        {bookList
          .filter((item) => {
            // 카테고리가 선택되지 않은 경우 모든 책 표시
            if (selectedCategory === null) {
              return true;
            }
            // "베스트 셀러" 카테고리가 선택된 경우 베스트셀러만 표시
            else if (selectedCategory === "베스트 셀러") {
              return item.isBestseller === true;
            }
            // 다른 카테고리가 선택된 경우 해당 카테고리의 책만 표시
            else {
              return item.categoryName === selectedCategory;
            }
          })
          // 베스트셀러 우선 정렬 (베스트셀러가 위에 오도록)
          .sort((a, b) => {
            // 베스트셀러 우선 정렬
            if (a.isBestseller && !b.isBestseller) return -1;
            if (!a.isBestseller && b.isBestseller) return 1;
            // 베스트셀러 여부가 같다면 발행일 기준으로 최신순 정렬
            return new Date(b.publishedAt) - new Date(a.publishedAt);
          })
          .map((book) => {
            return <Card key={book.id} book={book} />;
          })}
      </CardList>
    </Container>
  );
};

// 스타일 컴포넌트 아래 정의

const Container = styled.div`
  width: 100%;
  padding-top: 7rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #ffffff;
`;

const CardList = styled.div`
  /* display: flex;
  flex-wrap: wrap; */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding-top: 2rem;
  gap: 1.5rem;
  padding: 3rem 1rem;
  @media only screen and (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 430px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
