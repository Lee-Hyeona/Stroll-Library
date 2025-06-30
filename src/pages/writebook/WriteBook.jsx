import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

function WriteBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  // 편집 모드인지 확인 (임시 저장된 글을 편집하는 경우)
  const editingDraft = location.state?.draft;

  useEffect(() => {
    if (editingDraft) {
      setForm({
        title: editingDraft.title,
        content: editingDraft.content,
      });
    }
  }, [editingDraft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleTempSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 기존 임시 저장 목록 가져오기
    const existingDrafts = JSON.parse(localStorage.getItem("drafts") || "[]");

    const newDraft = {
      id: editingDraft ? editingDraft.id : Date.now(), // 편집 중이면 기존 ID 사용, 아니면 새 ID 생성
      title: form.title,
      content: form.content,
      savedAt: new Date().toISOString(),
    };

    let updatedDrafts;
    if (editingDraft) {
      // 기존 임시 저장 글 업데이트
      updatedDrafts = existingDrafts.map((draft) =>
        draft.id === editingDraft.id ? newDraft : draft
      );
    } else {
      // 새로운 임시 저장 글 추가
      updatedDrafts = [...existingDrafts, newDraft];
    }

    localStorage.setItem("drafts", JSON.stringify(updatedDrafts));
    alert("임시 저장되었습니다.");
    navigate("/drafts");
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // BookPublish 페이지로 이동하면서 데이터 전달
    navigate("/publish", {
      state: {
        bookData: {
          title: form.title,
          content: form.content,
        },
      },
    });
  };

  return (
    <Container>
      <Form>
        <Title>{editingDraft ? "글 편집하기" : "글 쓰기"}</Title>

        <Label>제목</Label>
        <TitleInput
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="책의 제목을 입력해주세요"
          required
        />

        <Label>내용</Label>
        <ContentTextarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="책의 내용을 입력해주세요"
          required
        />

        <ButtonContainer>
          <TempSaveButton type="button" onClick={handleTempSave}>
            임시 저장
          </TempSaveButton>
          <SaveButton type="button" onClick={handleSave}>
            저장
          </SaveButton>
        </ButtonContainer>
      </Form>
    </Container>
  );
}

export default WriteBook;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 7rem 1rem 2rem 1rem;
  min-height: 80vh;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Label = styled.label`
  margin: 0.75rem 0 0.25rem;
  font-weight: bold;
  text-align: left;
  display: block;
  color: #333;
`;

const TitleInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const ContentTextarea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 400px;
  max-height: 600px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  overflow-y: auto;
  white-space: pre-wrap;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const TempSaveButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #a3a5a7;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #8f9194;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333;
  }
`;
