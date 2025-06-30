# Zustand JWT API 통합 예시

## 🔧 기존 프로젝트 통합하기

### 1. App.jsx 수정하기

**기존 코드 (Recoil 사용):**

```jsx
// App.jsx (Before)
import { RecoilRoot } from "recoil";
import Router from "./Router";

function App() {
  return (
    <RecoilRoot>
      <Router />
    </RecoilRoot>
  );
}

export default App;
```

**수정된 코드 (Zustand 사용):**

```jsx
// App.jsx (After)
import { useEffect } from "react";
import Router from "./Router";
import { useAuthStore } from "./store/auth";
import { initializeAuth } from "./service/api";

function App() {
  const initAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // 앱 시작 시 인증 상태 복원
    const restoreAuth = async () => {
      try {
        const isValid = await initializeAuth();
        if (isValid) {
          initAuth();
        }
      } catch (error) {
        console.error("인증 초기화 실패:", error);
      }
    };

    restoreAuth();
  }, [initAuth]);

  return <Router />;
}

export default App;
```

### 2. 로그인 페이지 수정하기

**기존 코드:**

```jsx
// pages/login/Login.jsx (Before)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      alert("로그인 실패");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="이메일"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="비밀번호"
      />
      <button type="submit">로그인</button>
    </form>
  );
}
```

**수정된 코드:**

```jsx
// pages/login/Login.jsx (After)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useAuthActions } from "../../store/auth";
import { login } from "../../service/api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const isLoading = useAuthStore((state) => state.isLoading);
  const { setLoading } = useAuthActions();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.success) {
        navigate("/");
      } else {
        alert(response.message || "로그인 실패");
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다.");
      console.error("로그인 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="비밀번호"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default Login;
```

### 3. 헤더 컴포넌트 수정하기

**기존 코드:**

```jsx
// components/common/Header/Header.jsx (Before)
import { useState, useEffect } from "react";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 사용자 정보 조회 로직
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header>
      {user ? (
        <div>
          <span>안녕하세요, {user.name}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <a href="/login">로그인</a>
      )}
    </header>
  );
}
```

**수정된 코드:**

```jsx
// components/common/Header/Header.jsx (After)
import {
  useIsAuthenticated,
  useUserInfo,
  useAuthActions,
} from "../../../store/auth";
import { logout } from "../../../service/api";

function Header() {
  const isAuthenticated = useIsAuthenticated();
  const userInfo = useUserInfo();
  const { setLoading } = useAuthActions();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>안녕하세요, {userInfo?.name}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <a href="/login">로그인</a>
      )}
    </header>
  );
}

export default Header;
```

### 4. API 호출 부분 수정하기

**기존 코드:**

```jsx
// pages/main/Main.jsx (Before)
import { useState, useEffect } from "react";
import axios from "axios";

function Main() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/books", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error("책 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>책 목록</h1>
      {books.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

**수정된 코드:**

```jsx
// pages/main/Main.jsx (After)
import { useState, useEffect } from "react";
import { get } from "../../service/api";

function Main() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await get("/books");

        if (response.success) {
          setBooks(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("책 목록을 불러오는 중 오류가 발생했습니다.");
        console.error("책 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h1>책 목록</h1>
      {books.length > 0 ? (
        books.map((book) => <div key={book.id}>{book.title}</div>)
      ) : (
        <div>등록된 책이 없습니다.</div>
      )}
    </div>
  );
}

export default Main;
```

### 5. 인증이 필요한 페이지 보호하기

**새로운 파일:**

```jsx
// components/common/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../../store/auth";

function ProtectedRoute({ children, redirectTo = "/login" }) {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
```

**Router.jsx 수정:**

```jsx
// Router.jsx (After)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Main from "./pages/main/Main";
import Login from "./pages/login/Login";
import MyPage from "./pages/mypage/MyPage";
import WriteBook from "./pages/writebook/WriteBook";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <WriteBook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
```

### 6. 환경변수 설정

**.env.local 파일 생성:**

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
```

### 7. 개발자 도구에서 테스트하기

브라우저 콘솔에서 다음 명령어로 상태를 확인할 수 있습니다:

```javascript
// Zustand 스토어 상태 확인
import { useAuthStore } from "./src/store/auth";
console.log("현재 인증 상태:", useAuthStore.getState());

// 토큰 확인
console.log("Access Token:", useAuthStore.getState().accessToken);
console.log("Refresh Token:", localStorage.getItem("refreshToken"));

// 로그인 테스트
import { login } from "./src/service/api";
login({ email: "test@example.com", password: "password" }).then(console.log);

// API 호출 테스트
import { get } from "./src/service/api";
get("/books").then(console.log);
```

## 🎯 전환 완료 체크리스트

- [ ] `zustand` 설치 및 `recoil` 제거
- [ ] `.env.local` 파일에 `VITE_API_BASE_URL` 설정
- [ ] App.jsx에서 RecoilRoot 제거 및 인증 초기화 추가
- [ ] 로그인 페이지에서 새로운 login API 사용
- [ ] 헤더에서 Zustand 훅 사용
- [ ] 모든 API 호출을 새로운 API 함수들로 변경
- [ ] ProtectedRoute 컴포넌트 추가
- [ ] 기존 localStorage 토큰 관리 코드 제거
- [ ] 개발자 도구에서 동작 확인

## ✅ 장점 요약

1. **간단함**: Provider 없이 바로 사용 가능
2. **자동 토큰 관리**: JWT 토큰이 자동으로 관리됨
3. **에러 처리**: 통일된 에러 응답 포맷
4. **토큰 갱신**: 401 에러 시 자동 토큰 갱신
5. **타입 안전성**: TypeScript 지원 (필요시)
6. **성능**: 최적화된 리렌더링
7. **개발자 경험**: Redux DevTools 지원

이제 기존 프로젝트가 현대적인 Zustand 기반 JWT 인증 시스템으로 완전히 전환되었습니다! 🎉
