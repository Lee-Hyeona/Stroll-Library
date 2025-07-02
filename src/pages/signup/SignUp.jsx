import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signup } from "../../service/api";

function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nickname: "",
    accountId: "",
    password: "",
    confirmPassword: "",
    agreedToMarketing: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await signup(form);
      if (response.success) {
        navigate("/signup/complete");
      } else {
        setError(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>회원가입</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>이름</Label>
            <Input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              name="accountId"
              value={form.accountId}
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

          <InputGroup>
            <Label>비밀번호 재확인</Label>
            <Input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </InputGroup>

          <CheckboxContainer>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                name="marketingConsent"
                checked={form.marketingConsent}
                onChange={handleChange}
              />
              <CheckboxText>마케팅 수신에 동의합니다.</CheckboxText>
            </CheckboxLabel>
          </CheckboxContainer>

          {/* 에러 메시지 표시 */}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">
            {isLoading ? "회원가입 중..." : "회원가입"}
          </SubmitButton>
        </Form>

        <LoginBox>
          이미 계정이 있으신가요?{" "}
          <LoginLink onClick={() => navigate("/login")}>로그인하기</LoginLink>
        </LoginBox>
      </FormContainer>
    </Container>
  );
}

export default SignUp;

// ---------- styled-components ----------
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 2rem 1rem;
  text-align: left;
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
  margin-bottom: 2rem;
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
  width: calc(100% - 1.5rem);
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

const CheckboxContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
`;

const CheckboxText = styled.span`
  font-size: 0.875rem;
  color: #6c757d;
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

const LoginBox = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #6c757d;
`;

const LoginLink = styled.span`
  color: #101010;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #333333;
  }
`;
const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.375rem;
  text-align: center;
`;
