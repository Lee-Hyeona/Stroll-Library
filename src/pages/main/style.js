import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 7rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: green;
`;
export const CategoryWrapper = styled.nav`
  display: flex;
  gap: 2rem;
  justify-content: flex-start;
  padding: 1.5rem 2rem;
`;
export const Category = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  color: #333;
  cursor: pointer;

  &:hover {
    font-weight: 700;
    text-decoration: underline;
  }
`;

export const Button = styled.div``;
