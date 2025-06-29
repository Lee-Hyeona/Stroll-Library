// src/pages/newbook/style.js
import styled from "styled-components";
import { Box, Button } from "@mui/material";

export const StyledContainer = styled.div`
  display: flex;
  gap: 4rem;
  justify-content: space-between;
  padding: 4rem;
  padding-top: 100px;
  background-color: white;
`;

export const FormLeft = styled.div`
  width: 50%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormRight = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CoverBox = styled.div`
  margin-top: 1rem;
  width: 580px;
  height: 780px;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
`;
export const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

export const ButtonGroup = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: right;
`;

export const LabelBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

export const LabelText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 2px;

  .required {
    color: #1976d2; /* 파란색 */
    margin-right: 4px;
  }
`;
// style.js

export const CustomBlackButton = styled(Button)`
  background-color: #101010;
  color: #ffffff;
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;
  font-weight: 500;
  box-shadow: none;

  &:hover {
    background-color: #333333; /* 마우스 오버 시 약간 밝은 회색 */
    box-shadow: none;
  }
`;

export const CustomBlueButton = styled(Button)`
  background-color: #1976d2; /* 🔵 파란색 */
  color: #ffffff;
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;
  font-weight: 500;
  box-shadow: none;

  &:hover {
    background-color: #1565c0; /* hover 시 진한 파랑 */
    box-shadow: none;
  }
`;
