import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";

function AuthorRegistration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    authorName: "",
    authorIntro: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.authorName || !form.authorIntro) {
      alert("작가 이름과 작가 소개를 모두 입력해주세요.");
      return;
    }

    // 작가 신청 처리 로직 (실제로는 API 호출)
    console.log("작가 신청 정보:", form);

    // 신청 완료 모달 표시
    setIsModalOpen(true);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>작가 등록</Title>

        <Label>작가 이름</Label>
        <Input
          type="text"
          name="authorName"
          value={form.authorName}
          onChange={handleChange}
          placeholder="사용하실 작가 이름을 입력해주세요"
          required
        />

        <Label>작가 소개</Label>
        <TextArea
          name="authorIntro"
          value={form.authorIntro}
          onChange={handleChange}
          placeholder="작가 소개를 입력해주세요&#10;(작품 활동 경력, 자기소개 등을 자유롭게 작성해주세요)"
          rows={8}
          required
        />

        <SubmitButton type="submit">작가 신청하기</SubmitButton>
      </Form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="작가 신청 완료"
      >
        <ModalContent>
          <Message>
            작가 신청이 완료되었습니다.
            <br />
            승인까지 영업일 기준 최대 2-3일 소요될 수 있습니다.
          </Message>
          <ButtonContainer>
            <ModalButton onClick={handleGoHome} primary>
              홈으로 돌아가기
            </ModalButton>
            <ModalButton onClick={handleGoBack}>
              이전 페이지로 이동하기
            </ModalButton>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default AuthorRegistration;

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
  max-width: 500px;
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

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &::placeholder {
    color: #999;
    line-height: 1.5;
  }
`;

const SubmitButton = styled.button`
  margin-top: 1.5rem;
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

const ModalContent = styled.div`
  text-align: center;
`;

const Message = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ModalButton = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#000" : "#f5f5f5")};
  color: ${(props) => (props.primary ? "#fff" : "#333")};

  &:hover {
    background-color: ${(props) => (props.primary ? "#333" : "#e0e0e0")};
  }
`;
