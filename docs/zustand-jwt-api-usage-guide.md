# Zustand JWT API 사용 가이드

## 🚀 기본 사용법

### 1. 환경변수 설정

`.env.local` 파일에 API 서버 URL을 설정하세요.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. App.jsx에서 기본 설정

Zustand는 별도의 Provider가 필요 없어 더 간단합니다.

```jsx
import { useEffect } from "react";
import { useAuthStore } from "./store/auth";
import { initializeAuth } from "./service/api";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // 앱 시작 시 인증 상태 복원
    initializeAuth();
  }, [initializeAuth]);

  return <div className="App">{/* 앱 컴포넌트들 */}</div>;
}

export default App;
```

### 3. 인증 상태 관리 컴포넌트 예시

```jsx
import { useEffect } from "react";
import { useAuthStore, useAuthActions } from "../store/auth";
import { initializeAuth } from "../service/api";

function AuthProvider({ children }) {
  const { initializeAuth: initAuth } = useAuthActions();

  useEffect(() => {
    const initAuthState = async () => {
      const isValid = await initializeAuth();
      if (isValid) {
        initAuth(); // Zustand store 상태 복원
      }
    };

    initAuthState();
  }, [initAuth]);

  return children;
}

export default AuthProvider;
```

### 4. 로그인 구현 예시

```jsx
import { useAuthStore, useAuthActions } from "../store/auth";
import { login } from "../service/api";

function LoginForm() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const { setLoading } = useAuthActions();

  const handleLogin = async (email, password) => {
    setLoading(true);

    try {
      const response = await login({ email, password });

      if (response.success) {
        console.log("로그인 성공:", response.data);
        // login 함수 내부에서 자동으로 Zustand store 업데이트됨
      } else {
        console.error("로그인 실패:", response.message);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleLogin(formData.get("email"), formData.get("password"));
      }}
    >
      <input name="email" type="email" placeholder="이메일" required />
      <input name="password" type="password" placeholder="비밀번호" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}

export default LoginForm;
```

### 5. 인증 상태에 따른 컴포넌트 렌더링

```jsx
import { useIsAuthenticated, useUserInfo } from "../store/auth";

function UserProfile() {
  const isAuthenticated = useIsAuthenticated();
  const userInfo = useUserInfo();

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h2>사용자 프로필</h2>
      <p>이름: {userInfo?.name}</p>
      <p>이메일: {userInfo?.email}</p>
      <p>역할: {userInfo?.role}</p>
    </div>
  );
}

export default UserProfile;
```

### 6. API 호출 예시 (자동 JWT 헤더 포함)

```jsx
import { get, post, put, del } from "../service/api";
import { useAuthStore } from "../store/auth";

function BookManagement() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 책 목록 조회
  const getBooks = async () => {
    const response = await get("/books");
    if (response.success) {
      return response.data;
    }
    console.error("책 목록 조회 실패:", response.message);
  };

  // 책 생성 (인증 필요)
  const createBook = async (bookData) => {
    if (!isAuthenticated) {
      console.error("로그인이 필요합니다.");
      return;
    }

    const response = await post("/books", bookData);
    if (response.success) {
      console.log("책 생성 성공");
      return response.data;
    }
    console.error("책 생성 실패:", response.message);
  };

  // 책 수정 (인증 필요)
  const updateBook = async (bookId, bookData) => {
    const response = await put(`/books/${bookId}`, bookData);
    if (response.success) {
      console.log("책 수정 성공");
      return response.data;
    }
    console.error("책 수정 실패:", response.message);
  };

  // 책 삭제 (인증 필요)
  const deleteBook = async (bookId) => {
    const response = await del(`/books/${bookId}`);
    if (response.success) {
      console.log("책 삭제 성공");
    } else {
      console.error("책 삭제 실패:", response.message);
    }
  };

  return <div>{/* 책 관리 UI */}</div>;
}

export default BookManagement;
```

### 7. 로그아웃 구현

```jsx
import { logout } from "../service/api";
import { useAuthActions } from "../store/auth";

function LogoutButton() {
  const { setLoading } = useAuthActions();

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      // logout 함수 내부에서 자동으로 Zustand store 클리어됨

      // 로그인 페이지로 리다이렉트
      window.location.href = "/login";
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}

export default LogoutButton;
```

### 8. 조건부 라우팅 (인증 필요한 페이지)

```jsx
import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "../store/auth";

function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 사용 예시
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
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
            <WriteBookPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;
```

## 🧪 테스트 및 검증 방법

### 1. 개발자 도구에서 Zustand 상태 확인

```javascript
// 브라우저 콘솔에서 현재 인증 상태 확인
console.log("현재 인증 상태:", window.__zustand_devtools_data);

// 또는 직접 스토어에 접근
import { useAuthStore } from "./store/auth";
console.log("인증 상태:", useAuthStore.getState());
```

### 2. 토큰 갱신 로직 테스트

```javascript
import { get } from "../service/api";
import { useAuthStore } from "../store/auth";

// 의도적으로 만료된 토큰으로 설정 (테스트용)
useAuthStore.getState().setAccessToken("expired_token");

// API 요청 시도 - 자동으로 토큰 갱신되는지 확인
get("/books").then((response) => {
  console.log("자동 토큰 갱신 후 응답:", response);
  console.log("갱신된 토큰:", useAuthStore.getState().accessToken);
});
```

### 3. localStorage 및 Zustand persist 확인

```javascript
// 브라우저 개발자 도구 > Application > Local Storage
console.log("저장된 Refresh Token:", localStorage.getItem("refreshToken"));
console.log("Zustand persist 데이터:", localStorage.getItem("auth-storage"));
```

### 4. 네트워크 요청 모니터링

- 개발자 도구 > Network 탭에서 API 요청 확인
- Authorization 헤더에 Bearer 토큰이 포함되는지 확인
- 401 에러 발생 시 자동으로 refresh 요청이 발생하는지 확인

## 🔄 Recoil에서 Zustand로의 주요 변화점

### 1. Provider 불필요

```jsx
// Recoil (Before)
<RecoilRoot>
  <App />
</RecoilRoot>

// Zustand (After) - Provider 없음
<App />
```

### 2. 훅 사용법 변화

```jsx
// Recoil (Before)
const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
const isAuthenticated = useRecoilValue(isAuthenticatedState);

// Zustand (After)
const accessToken = useAuthStore((state) => state.accessToken);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const { setAccessToken } = useAuthActions();
```

### 3. 상태 업데이트 방식

```jsx
// Recoil (Before)
setAccessToken(newToken);
setIsAuthenticated(true);

// Zustand (After)
const { login } = useAuthActions();
login(userData, accessToken, refreshToken); // 한 번에 모든 상태 업데이트
```

## ⚠️ 주의사항

### 1. 성능 최적화

- Zustand 스토어에서 필요한 상태만 구독하세요
- 불필요한 리렌더링을 방지하기 위해 selector를 적절히 사용하세요

```jsx
// ❌ 전체 상태 구독 (불필요한 리렌더링 발생 가능)
const store = useAuthStore();

// ✅ 필요한 상태만 구독
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const userInfo = useAuthStore((state) => state.userInfo);
```

### 2. 타입스크립트 사용 시

```typescript
// store/auth.ts
interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  isLoading: boolean;
  // ... 액션들
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // 구현
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
```

### 3. 보안 고려사항

- Access Token은 메모리에만 저장 (localStorage에 저장되지 않음)
- Refresh Token은 localStorage에 저장 (XSS 공격에 주의)
- 프로덕션 환경에서는 HttpOnly 쿠키 사용 고려

## 🎯 Zustand의 장점

1. **간단한 API**: Provider 없이 바로 사용 가능
2. **작은 번들 크기**: Recoil 대비 매우 작음
3. **TypeScript 친화적**: 완벽한 타입 추론
4. **개발자 도구**: Redux DevTools 지원
5. **유연한 구조**: 다양한 상태 구조 지원
6. **성능**: 최적화된 리렌더링

이제 Zustand 기반 JWT API가 완전히 구축되었습니다! 🎉
