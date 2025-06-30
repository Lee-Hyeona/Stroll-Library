# 인증 초기화 구현 계획

## 개요

앱 시작 시 사용자의 인증 상태를 복원하고 모든 페이지에서 일관된 사용자 정보를 사용할 수 있도록 `initializeAuth`를 최적의 위치에 구현합니다.

## 구현 위치: src/App.jsx

### 선택 이유

1. **RouterProvider 이전 실행**: 라우팅 기반 접근 제어가 정상 작동
2. **전역 상태 준비**: 모든 페이지에서 일관된 인증 정보 사용
3. **성능 최적화**: 앱 전체에서 단 한 번만 실행
4. **Protected Routes 지원**: 인증이 필요한 페이지의 접근 제어 가능

## 구현 방법

### 1. App.jsx에 useEffect 추가

```jsx
import { useEffect, useState } from 'react';
import { initializeAuth } from './service/api';

function App() {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('인증 초기화 실패:', error);
      } finally {
        setIsAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  // 인증 초기화가 완료될 때까지 로딩 화면 표시
  if (!isAuthInitialized) {
    return <div>Loading...</div>;
  }

  return (
    // 기존 App 컴포넌트 내용
  );
}
```

### 2. 기대 효과

- 모든 페이지에서 올바른 인증 상태 사용
- Header의 프로필 정보가 올바르게 표시
- Protected Routes의 정상 작동
- 새로고침 시에도 로그인 상태 유지

## 진행 상태

- [x] App.jsx에 인증 초기화 로직 추가
- [x] 로딩 상태 처리 구현
- [ ] 테스트 및 검증

## 참고사항

- initializeAuth는 src/service/api.js에 이미 구현되어 있음
- Zustand 스토어와 tokenStorage 유틸리티가 연동되어 작동
- 인증 실패 시 자동으로 로그아웃 처리됨
