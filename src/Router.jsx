import { createBrowserRouter } from "react-router-dom";
import { Main } from "./pages/main/Main";
import Roots from "./pages/Roots";
import Edit from "./pages/edit/Edit";
import BookDetailPage from "./pages/bookDetail/BookDetail";
import BookContent from "./pages/bookDetail/BookContent";
import SignUp from "./pages/signup/SignUp";
import SignUpComplete from "./pages/signup/SignUpComplete";
import Login from "./pages/login/Login";
import MyPage from "./pages/mypage/MyPage";
import Subscription from "./pages/subscription/Subscription";
import AuthorRegistration from "./pages/authorregistration/AuthorRegistration";
import WriteBook from "./pages/writebook/WriteBook";
import MyWritings from "./pages/writebook/MyWritings";
import BookPublish from "./pages/writebook/BookPublish";
import ManagePassword from "./pages/management/ManagePassword";
import ManageAuthorList from "./pages/management/ManageAuthorList";
import ManageAuthorDetail from "./pages/management/ManageAuthorDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />,
    children: [
      {
        path: "",
        element: <Main />,
      },
      {
        path: "books/edit/:bookid",
        element: <Edit />,
      },
      {
        path: "books/:id",
        element: <BookDetailPage />,
      },
      {
        path: "books/:id/content",
        element: <BookContent />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "signup/complete",
        element: <SignUpComplete />, // ✅ 컴포넌트 이름 일치
      },
      {
        path: "login", // 👈 Login 경로 추가
        element: <Login />,
      },
      {
        path: "account", // 👈 계정 정보 페이지 경로 추가
        element: <MyPage />,
      },
      {
        path: "subscription",
        element: <Subscription />,
      },
      {
        path: "author/register",
        element: <AuthorRegistration />,
      },
      {
        path: "write", // 글쓰기 페이지
        element: <WriteBook />,
      },
      {
        path: "write/:draftId", // 임시저장 글쓰기 수정정 페이지
        element: <WriteBook />,
      },
      {
        path: "drafts", // 임시 저장 목록 페이지
        element: <MyWritings />,
      },
      {
        path: "publish/:draftId", // 책 출간 페이지
        element: <BookPublish />,
      },
      {
        path: "admin/password", // 관리자 인증 페이지
        element: <ManagePassword />,
      },
      {
        path: "admin/authors", // 작가 신청 목록 페이지
        element: <ManageAuthorList />,
      },
      {
        path: "admin/authors/:userId", // 작가 신청 상세 페이지
        element: <ManageAuthorDetail />,
      },
    ],
  },
]);

export default router;
