import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AdminHeader from "../../components/common/Header/AdminHeader";

const ManagePassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdmin", "true");
        navigate("/admin/authors");
      } else {
        setError("올바른 관리자 패스워드를 입력해주세요.");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <AdminHeader />
      <Container>
        <FormContainer>
          <Title>관리자 인증</Title>
          <Description>
            작가 신청 관리를 위해 관리자 패스워드를 입력해주세요.
          </Description>

          <Form onSubmit={handleSubmit}>
            <FieldWrapper>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="관리자 패스워드를 입력하세요"
                required
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FieldWrapper>

            <FieldWrapper>
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? "인증 중..." : "인증하기"}
              </SubmitButton>
            </FieldWrapper>
          </Form>
        </FormContainer>
      </Container>
    </>
  );
};

export default ManagePassword;

// Styled Components

const Container = styled.div`
  min-height: calc(100vh - 5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding-top: 5rem; /* AdminHeader 높이만큼 여백 추가 */
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 3rem;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 28rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #101010;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 0.875rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const Input = styled.input`
  width: calc(100% - 2rem);
  padding: 0.875rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #101010;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #101010;
    box-shadow: 0 0 0 2px rgba(16, 16, 16, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  color: #dc3545;
  font-size: 0.875rem;
  text-align: left;
`;

const SubmitButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  background-color: #101010;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #333333;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;
