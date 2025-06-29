import { createBrowserRouter } from "react-router-dom";
import { Main } from "./pages/main/Main";
import Roots from "./pages/Roots";
import NewBook from "./pages/newbook/NewBook";
import Edit from "./pages/edit/Edit";
import BookDetailPage from "./pages/bookDetail/BookDetail";
import SignUp from "./pages/signup/SignUp";
import SignUpComplete from "./pages/signup/SignUpComplete";
import Login from "./pages/login/Login";
import MyPage from "./pages/mypage/MyPage";
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
        path: "books/new",
        element: <NewBook />,
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
    ],
  },
]);

export default router;
