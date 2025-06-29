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
      <Form onSubmit={handleSubmit}>
        <Title>로그인</Title>

        <Label>아이디</Label>
        <Input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Label>비밀번호</Label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <SubmitButton type="submit">로그인</SubmitButton>

        <RegisterBox>
          아직 미회원이라면?{" "}
          <RegisterLink onClick={() => navigate("/signup")}>
            회원가입하기
          </RegisterLink>
        </RegisterBox>
      </Form>
    </Container>
  );
}

export default Login;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 10rem 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Label = styled.label`
  margin: 0.75rem 0 0.25rem;
  font-weight: bold;
  text-align: left;
  display: block;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;

const RegisterBox = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  text-align: right;
`;

const RegisterLink = styled.span`
  margin-left: 0.3rem;
  font-weight: bold;
  color: #0070f3;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
