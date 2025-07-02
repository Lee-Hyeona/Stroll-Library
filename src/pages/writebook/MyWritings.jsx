import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserInfo } from "../../store/auth";
import apiClient from "../../service/axios";

function MyWritings() {
  const navigate = useNavigate();
  const userInfo = useUserInfo();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    // if (!userInfo?.id) {
    //   console.error("사용자 정보가 없습니다.");
    //   return;
    // }

    try {
      const response = await apiClient.get(`/draft/author/1`);
      // const response = await apiClient.get(`/draft/author/${userInfo.id}`);

      // API 응답을 기존 형식에 맞게 변환
      const transformedDrafts = response.data.map((draft) => ({
        id: draft.id,
        title: draft.title,
        content: draft.content,
        savedAt: draft.createdAt, // createdAt을 savedAt으로 매핑
        authorId: draft.authorId,
        authorNickname: draft.authorNickname,
      }));

      // 최신 순으로 정렬
      const sortedDrafts = transformedDrafts.sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );
      setDrafts(sortedDrafts);
    } catch (err) {
      console.error(
        "임시 저장 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.:",
        err
      );
      setDrafts([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "방금 전";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const handleDraftClick = (draft) => {
    navigate(`/write/${draft.id}`);
  };

  const handleNewWrite = () => {
    navigate("/write");
  };

  const handleDeleteDraft = async (e, draftId) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        let url = import.meta.env.VITE_API_BASE_URL;
        url += `/draft/${draftId}`;
        await axios.delete(url);

        // 삭제 성공 시 로컬 상태에서도 제거
        const updatedDrafts = drafts.filter((draft) => draft.id !== draftId);
        setDrafts(updatedDrafts);
      } catch (error) {
        console.error("임시 저장 글 삭제 중 오류가 발생했습니다:", error);
        alert("삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <Container>
      <PageTitle>임시 저장 목록</PageTitle>
      <ContentWrapper>
        <Header>
          <NewWriteButton onClick={handleNewWrite}>새 글 쓰기</NewWriteButton>
        </Header>

        {drafts.length === 0 ? (
          <EmptyState>
            <EmptyMessage>임시 저장된 글이 없습니다.</EmptyMessage>
            <EmptySubMessage>새 글을 작성해보세요!</EmptySubMessage>
          </EmptyState>
        ) : (
          <DraftList>
            {drafts.map((draft) => (
              <DraftItem key={draft.id} onClick={() => handleDraftClick(draft)}>
                <DraftHeader>
                  <DraftTitle>{draft.title}</DraftTitle>
                  <DraftActions>
                    <DraftTime>{formatDate(draft.savedAt)}</DraftTime>
                    <DeleteButton
                      onClick={(e) => handleDeleteDraft(e, draft.id)}
                      title="삭제"
                    >
                      ×
                    </DeleteButton>
                  </DraftActions>
                </DraftHeader>
              </DraftItem>
            ))}
          </DraftList>
        )}
      </ContentWrapper>
    </Container>
  );
}

export default MyWritings;

// ---------- styled-components ----------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 1rem 2rem 1rem;
  min-height: 80vh;
`;

const PageTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
`;

const NewWriteButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const EmptyMessage = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const EmptySubMessage = styled.div`
  font-size: 1rem;
  color: #999;
`;

const DraftList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DraftItem = styled.div`
  padding: 1.5rem;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;

  &:hover {
    border-color: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DraftHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DraftTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 1rem;
  text-align: left;
`;

const DraftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DraftTime = styled.span`
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background-color: #f8f9fa;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc3545;
    color: #fff;
  }
`;
