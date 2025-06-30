import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 로그인 로직은 여기에 추가
    if (!form.username || !form.password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    alert("환영합니다✨");
    navigate("/"); // 로그인 후 이동할 페이지
  };

  return (
    <Container>
      <FormContainer>
        <Title>로그인</Title>
        <Subtitle>계정에 로그인하여 시작하세요</Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </InputGroup>

          <SubmitButton type="submit">로그인</SubmitButton>
        </Form>

        <RegisterBox>
          아직 미회원이라면?{" "}
          <RegisterLink onClick={() => navigate("/signup")}>
            회원가입하기
          </RegisterLink>
        </RegisterBox>
      </FormContainer>
    </Container>
  );
}

export default Login;

// ---------- styled-components ----------
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 2rem 1rem;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 25rem;
  background-color: #ffffff;
  padding: 2.5rem;
  border: 0.0625rem solid #e9ecef;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #101010;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #101010;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 0.0625rem solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #101010;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #101010;
    box-shadow: 0 0 0 0.125rem rgba(16, 16, 16, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: #101010;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: #333333;
  }

  &:active {
    background-color: #000000;
  }
`;

const RegisterBox = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #6c757d;
`;

const RegisterLink = styled.span`
  color: #101010;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #333333;
  }
`;
