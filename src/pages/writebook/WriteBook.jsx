import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useUserInfo } from "../../store/auth";
import apiClient from "../../service/axios";

function WriteBook() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useUserInfo();
  const { draftId } = useParams();

  const [form, setForm] = useState({
    title: "",
    content: "",
    authorId: "",
  });

  // 편집 모드인지 확인 (임시 저장된 글을 편집하는 경우)
  const isEditing = draftId ? true : false;

  const getDraftAndProcess = async () => {
    const res = await apiClient.get(`/draft/${draftId}`);
    // console.log(res);
    if (res.status === 200) {
      console.log(res);
      setForm({
        title: res.data.title,
        content: res.data.content,
        authorId: userInfo?.id,
      });
    }
  };

  useEffect(() => {
    if (isEditing) {
      getDraftAndProcess();
    }
  }, [draftId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleTempSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // if (!userInfo?.id) {
    //   alert("로그인이 필요합니다.");
    //   return;
    // }

    try {
      const requestData = {
        title: form.title,
        authorId: 1,
        // authorId: userInfo.id,
        content: form.content,
      };

      if (isEditing) {
        // 편집 모드: 기존 임시 저장 업데이트
        await apiClient.put(`/draft/${draftId}`, requestData);
      } else {
        // 새 글 모드: 새로운 임시 저장 생성
        await apiClient.post(`/draft/savedraft`, requestData);
      }

      alert("임시 저장되었습니다.");
      navigate("/drafts");
    } catch (error) {
      console.error("임시 저장 에러:", error);
      alert("임시 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const requestData = {
      title: form.title,
      authorId: 1,
      // authorId: userInfo.id,
      content: form.content,
    };
    try {
      if (isEditing) {
        const res = await apiClient.post(
          `/draft/${draftId}/publish`,
          requestData
        );
        navigate(`/publish/${res.data.id}`);
      } else {
        const res = await apiClient.post(`/draft/publish`, requestData);
        navigate(`/publish/${res.data.id}`);
      }
    } catch (error) {
      console.error("저장 에러:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container>
      <Form>
        <Title>{isEditing ? "글 편집하기" : "글 쓰기"}</Title>

        <Label>제목</Label>
        <TitleInput
          type="text"
          name="title"
          value={form.title}
          defaultValue={form.title}
          onChange={handleChange}
          placeholder="책의 제목을 입력해주세요"
          required
        />

        <Label>내용</Label>
        <ContentTextarea
          name="content"
          value={form.content}
          defaultValue={form.content}
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
