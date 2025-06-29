import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function SignUpComplete() {
  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <Title>회원가입이 완료되었습니다 🎉</Title>
        <LoginButton onClick={() => navigate("/login")}>
          로그인 하기
        </LoginButton>
      </Card>
    </Container>
  );
}

export default SignUpComplete;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Card = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  font-weight: 500;
`;

const LoginButton = styled.button`
  background-color: #000;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;
