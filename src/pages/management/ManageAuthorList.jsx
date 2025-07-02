import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BDS } from "../../styles/BDS";
import AdminHeader from "../../components/common/Header/AdminHeader";
import apiClient from "../../service/axios";

const ManageAuthorList = () => {
  const [authorApplications, setAuthorApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 관리자 권한 확인
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/password");
      return;
    }

    // 작가 신청 목록 불러오기
    fetchAuthorApplications();
  }, [navigate]);

  const fetchAuthorApplications = async () => {
    try {
      console.log("작가 신청 목록 조회 시도");
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get("/admin/requests");

      const authorRequests = response.data.map((request) => ({
        id: request.id,
        userId: request.accoundId,
        authorName: request.authorNickname,
        // status: request.status,
      }));

      setAuthorApplications(authorRequests);
    } catch (error) {
      console.error("작가 신청 목록 조회 실패:", error);
      setError("작가 신청 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetail = (userId) => {
    navigate(`/admin/authors/${userId}`);
  };

  if (isLoading) {
    return (
      <Container>
        <AdminHeader />
        <LoadingMessage>작가 신청 목록을 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <AdminHeader />

      <Content>
        <HeaderSection>
          <Title>작가 승인 관리</Title>
        </HeaderSection>

        <Section>
          <SectionTitle>작가 신청 목록</SectionTitle>
          <Description>
            총 {authorApplications.length}건의 작가 신청이 대기 중입니다.
          </Description>

          {authorApplications.length === 0 ? (
            <EmptyMessage>현재 대기 중인 작가 신청이 없습니다.</EmptyMessage>
          ) : (
            <ApplicationTable>
              <TableHeader>
                <HeaderRow>
                  <HeaderCell align="center">유저 아이디</HeaderCell>
                  <HeaderCell align="center">작가명</HeaderCell>
                  <HeaderCell align="center"></HeaderCell>
                  <HeaderCell align="center">관리</HeaderCell>
                </HeaderRow>
              </TableHeader>
              <TableBody>
                {authorApplications.map((application) => (
                  <ApplicationRow key={application.userId}>
                    <TableCell align="center">{application.userId}</TableCell>
                    <TableCell align="center">
                      {application.authorName}
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      <ViewButton
                        onClick={() => handleViewDetail(application.userId)}
                      >
                        확인
                      </ViewButton>
                    </TableCell>
                  </ApplicationRow>
                ))}
              </TableBody>
            </ApplicationTable>
          )}
        </Section>
      </Content>
    </Container>
  );
};

export default ManageAuthorList;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  padding-top: 5rem; /* AdminHeader 높이만큼 여백 추가 */
`;

const Content = styled.main`
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  border-bottom: 0.0625rem solid #e9ecef;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #101010;
  margin: 0;
`;

const Section = styled.section`
  background-color: #ffffff;
  border: 0.0625rem solid #e9ecef;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #101010;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #6c757d;
  margin-bottom: 2rem;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.125rem;
  color: #6c757d;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.125rem;
`;

const ApplicationTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead``;

const HeaderRow = styled.tr`
  border-bottom: 0.0625rem solid #e9ecef;
`;

const HeaderCell = styled.th`
  padding: 1rem;
  text-align: ${(props) =>
    props.align === "right"
      ? "right"
      : props.align === "center"
      ? "center"
      : "left"};
  font-weight: 600;
  color: #101010;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
`;

const TableBody = styled.tbody``;

const ApplicationRow = styled.tr`
  border-bottom: 0.0625rem solid #f8f9fa;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: #6c757d;
  vertical-align: middle;
  text-align: ${(props) =>
    props.align === "right"
      ? "right"
      : props.align === "center"
      ? "center"
      : "left"};
`;

const ViewButton = styled.button`
  background-color: #101010;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #333333;
  }
`;
