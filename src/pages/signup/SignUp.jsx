import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    marketingAgree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    navigate("/signup/complete");
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>회원가입</Title>

        <Label>이름</Label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

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

        <Label>비밀번호 재확인</Label>
        <Input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <CheckboxLabel>
          <input
            type="checkbox"
            name="marketingAgree"
            checked={form.marketingAgree}
            onChange={handleChange}
          />
          마케팅 수신에 동의합니다.
        </CheckboxLabel>

        <SubmitButton type="submit">회원가입</SubmitButton>
      </Form>
    </Container>
  );
}

export default SignUp;

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
  text-align: left; // ✅ 왼쪽 정렬
  display: block; // ✅ 블록 요소로 만들어 input과 너비 맞추기
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CheckboxLabel = styled.label`
  margin: 1rem 0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
