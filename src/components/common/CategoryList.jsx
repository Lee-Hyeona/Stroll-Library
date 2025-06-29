import React, { useEffect, useState } from "react";
import { styled, css } from "styled-components";
import axios from "axios";

const categories = [
  { key: "bestseller", name: "베스트 셀러" },
  { key: "literature", name: "문학" },
  { key: "economy", name: "경제" },
  { key: "selfImprovement", name: "자기 계발" },
  { key: "lifeStyle", name: "라이프 스타일" },
  { key: "etc", name: "기타" },
];

const CategoryList = ({ selectedCategory, setSelectedCategory }) => {
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategory = async () => {
    const data = await axios
      .get(import.meta.env.VITE_API_URL + "/api/categories")
      .then((response) => {
        // console.log(response.data);
        setCategoryList(response.data);
      })
      .catch((err) => {
        console.log(err);
        setCategoryList([]);
      });
  };
  useEffect(() => {
    // console.log(selectedCategory);
    // fetchCategory();
  }, [selectedCategory]);
  return (
    <CategoryWrapper>
      {categories.map((category) => (
        <Category
          key={category.key}
          id={category.name}
          $selectedCategory={selectedCategory}
          onClick={() => {
            if (selectedCategory === category.name) {
              setSelectedCategory(null);
            } else {
              setSelectedCategory(category.name);
            }
          }}
        >
          {category.name}
        </Category>
      ))}
      {/* {categoryList && categoryList.length === 0
        ? categoryList.map((category) => (
            <Category
              key={category.key}
              id={category.name}
              $selectedCategory={selectedCategory}
              onClick={() => {
                if (selectedCategory === category.name) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category.name);
                }
              }}
            >
              {category.name}
            </Category>
          ))
        : categories.map((category) => (
            <Category
              key={category.key}
              id={category.name}
              $selectedCategory={selectedCategory}
              onClick={() => {
                if (selectedCategory === category.name) {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category.name);
                }
              }}
            >
              {category.name}
            </Category>
          ))} */}
    </CategoryWrapper>
  );
};

export default CategoryList;

// 스타일드 컴포넌트
const CategoryWrapper = styled.nav`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;
`;

const Category = styled.div`
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    font-weight: 700;
  }
  ${(props) =>
    props.$selectedCategory === props.id &&
    css`
      font-weight: 900;
      color: "#101010";
    `}
`;
