import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../../components/common/Card";
import CategoryList from "../../components/common/CategoryList";
import axios from "axios";

// const books = [
//   {
//     id: 1,
//     title: "코코는 너무 귀여워",
//     author: "콩이",
//     date: "2025.07.07",
//     category: "경제",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 2,
//     title: "멍멍이는 사랑",
//     author: "초코",
//     date: "2025.08.01",
//     category: "문학",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 3,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 4,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 5,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 6,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 7,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
//   {
//     id: 8,
//     title: "하루 10분 산책의 기적",
//     author: "코코",
//     date: "2025.09.11",
//     category: "라이프 스타일",
//     thumbnail:
//       "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.dog-zzang.co.kr%2Fdog_sale%2Fphoto_free%2F202211%2F1667919973_47756500.jpeg&type=sc960_832",
//   },
// ];

export const Main = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bookList, setBookList] = useState([]);
  const fetchBookData = async () => {
    try {
      let url = import.meta.env.VITE_API_URL;

      // if (selectedCategory !== null) {
      //   url += `/api/books/category/${selectedCategory}`;
      // } else {
      //   url += `/api/books`;
      // }
      url += `/api/books`;
      const response = await axios.get(url);
      console.log(response.data);
      setBookList(response.data.reverse());
    } catch (err) {
      console.error(
        "책 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.:",
        err
      );
      setBookList([]);
    }
  };
  useEffect(() => {
    // console.log(selectedCategory);
    fetchBookData();
  }, [selectedCategory]);
  return (
    <Container>
      <CategoryList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CardList>
        {bookList
          .filter(
            (item) =>
              selectedCategory == null || item.categoryName === selectedCategory
          )
          .map((book) => {
            return (
              <Card
                key={book.id}
                book={book}
                // id={book.id}
                // title={book.title}
                // author={book.author}
                // date={book.createDate.substring(0, 10)}
                // category={book.categoryName}
                // thumbnail={book.coverImgUrl}
              />
            );
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
