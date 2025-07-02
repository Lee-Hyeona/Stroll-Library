import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    accountId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // 입력 시 에러 메시지 초기화
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!form.accountId || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // API 호출 - Login.jsx의 현재 폼 구조(email, password)를 그대로 사용
      // const response = { data: { name: "test" }, success: true };
      const response = await login({
        email: form.email,
        password: form.password,
      });

      if (response.success) {
        alert("환영합니다✨");
        // 로그인 성공
        console.log("로그인 성공:", response.data);
        navigate("/"); // 메인 페이지로 이동
      } else {
        // 로그인 실패
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Title>로그인</Title>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              name="email"
              value={form.accountId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </InputGroup>

          {/* 에러 메시지 표시 */}
          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </SubmitButton>
        </Form>

        <RegisterBox>
          아직 비회원이라면?{" "}
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
  margin-bottom: 3rem;
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

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.375rem;
  text-align: center;
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

  &:hover:not(:disabled) {
    background-color: #333333;
  }

  &:active:not(:disabled) {
    background-color: #000000;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
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
