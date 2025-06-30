# JWT API 사용 가이드

## 🚀 기본 사용법

### 1. 환경변수 설정

`.env.local` 파일에 API 서버 URL을 설정하세요.

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. App.jsx에서 Recoil 설정

```jsx
import { RecoilRoot } from "recoil";

function App() {
  return <RecoilRoot>{/* 앱 컴포넌트들 */}</RecoilRoot>;
}
```

### 3. 인증 상태 관리 컴포넌트 예시

```jsx
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import {
  accessTokenState,
  isAuthenticatedState,
  userInfoState,
} from "../store/auth";
import { initializeAuth, setAccessToken } from "../service/api";
import { getUserInfo } from "../utils/tokenStorage";

function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useRecoilState(accessTokenState);
  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  useEffect(() => {
    const initAuth = async () => {
      const isValid = await initializeAuth();
      if (isValid) {
        const savedUser = getUserInfo();
        setUserInfo(savedUser);
        setIsAuthenticated(true);
      }
    };

    initAuth();
  }, []);

  return children;
}
```

### 4. 로그인 구현 예시

```jsx
import { useRecoilState } from "recoil";
import { login } from "../service/api";
import {
  accessTokenState,
  isAuthenticatedState,
  userInfoState,
} from "../store/auth";

function LoginForm() {
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserInfo] = useRecoilState(userInfoState);

  const handleLogin = async (email, password) => {
    const response = await login({ email, password });

    if (response.success) {
      setUserInfo(response.data);
      setIsAuthenticated(true);
      // accessToken은 login 함수 내부에서 자동 설정됨
    } else {
      console.error("로그인 실패:", response.message);
    }
  };

  // JSX 반환...
}
```

### 5. API 호출 예시

```jsx
import { get, post, put, del } from "../service/api";

// 책 목록 조회
const getBooks = async () => {
  const response = await get("/books");
  if (response.success) {
    return response.data;
  }
  console.error("책 목록 조회 실패:", response.message);
};

// 책 생성
const createBook = async (bookData) => {
  const response = await post("/books", bookData);
  if (response.success) {
    console.log("책 생성 성공");
    return response.data;
  }
  console.error("책 생성 실패:", response.message);
};

// 책 수정
const updateBook = async (bookId, bookData) => {
  const response = await put(`/books/${bookId}`, bookData);
  if (response.success) {
    console.log("책 수정 성공");
    return response.data;
  }
  console.error("책 수정 실패:", response.message);
};

// 책 삭제
const deleteBook = async (bookId) => {
  const response = await del(`/books/${bookId}`);
  if (response.success) {
    console.log("책 삭제 성공");
  }
  console.error("책 삭제 실패:", response.message);
};
```

### 6. 로그아웃 구현

```jsx
import { logout } from "../service/api";
import { useRecoilState } from "recoil";
import {
  accessTokenState,
  isAuthenticatedState,
  userInfoState,
} from "../store/auth";

function LogoutButton() {
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setUserInfo] = useRecoilState(userInfoState);

  const handleLogout = async () => {
    await logout();

    // Recoil 상태 초기화
    setAccessToken(null);
    setIsAuthenticated(false);
    setUserInfo(null);

    // 로그인 페이지로 리다이렉트
    window.location.href = "/login";
  };

  return <button onClick={handleLogout}>로그아웃</button>;
}
```

## 🧪 테스트 및 검증 방법

### 1. 토큰 갱신 로직 테스트

```javascript
// 개발자 도구 Console에서 테스트

// 1. 로그인 후 토큰 확인
console.log("Access Token:", getAccessToken());
console.log("Refresh Token:", getRefreshToken());

// 2. 의도적으로 만료된 토큰으로 설정 (테스트용)
setAccessToken("expired_token");

// 3. API 요청 시도 - 자동으로 토큰 갱신되는지 확인
get("/books").then((response) => {
  console.log("자동 토큰 갱신 후 응답:", response);
});
```

### 2. localStorage 확인

```javascript
// 브라우저 개발자 도구 > Application > Local Storage
console.log("저장된 Refresh Token:", localStorage.getItem("refreshToken"));
console.log("저장된 사용자 정보:", localStorage.getItem("userInfo"));
```

### 3. 네트워크 요청 모니터링

- 개발자 도구 > Network 탭에서 API 요청 확인
- Authorization 헤더에 Bearer 토큰이 포함되는지 확인
- 401 에러 발생 시 자동으로 refresh 요청이 발생하는지 확인

### 4. 에러 시나리오 테스트

```javascript
// 잘못된 토큰으로 테스트
removeRefreshToken(); // refresh token 삭제
setAccessToken("invalid_token"); // 잘못된 access token 설정

// API 요청 시 로그인 페이지로 리다이렉트되는지 확인
get("/books");
```

## ⚠️ 주의사항

### 1. 보안 고려사항

- Refresh Token을 localStorage에 저장하는 것은 XSS 공격에 취약할 수 있습니다.
- 프로덕션 환경에서는 HttpOnly 쿠키 사용을 고려하세요.
- HTTPS를 사용하여 토큰 전송을 암호화하세요.

### 2. 에러 처리

- 네트워크 오류 시 적절한 사용자 피드백을 제공하세요.
- 토큰 갱신 실패 시 로그인 페이지로 안전하게 리다이렉트하세요.

### 3. 성능 최적화

- 동시에 여러 API 요청이 실패했을 때, 중복 토큰 갱신을 방지하는 로직이 구현되어 있습니다.
- 불필요한 토큰 갱신 요청을 줄이기 위해 토큰 만료 시간을 확인하는 로직을 추가할 수 있습니다.

## 🔧 커스터마이징

### API 엔드포인트 변경

`src/service/axios.js`에서 토큰 갱신 엔드포인트를 수정할 수 있습니다:

```javascript
const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
  refreshToken: refreshToken,
});
```

### 응답 데이터 구조 변경

서버의 응답 구조에 맞게 `src/service/api.js`의 로그인 함수를 수정하세요:

```javascript
const { accessToken, refreshToken, user } = response.data;
```

### 로그아웃 시 리다이렉트 경로 변경

`src/service/axios.js`에서 리다이렉트 경로를 수정할 수 있습니다:

```javascript
window.location.href = "/login"; // 원하는 경로로 변경
```
