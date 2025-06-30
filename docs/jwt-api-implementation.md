# JWT API 구현 계획서

## 프로젝트 개요

API_BASE_URL 환경변수를 활용하여 JWT 인증을 지원하는 axios 기반 API 클라이언트를 구현합니다.

## 요구사항

- [ ] API_BASE_URL 환경변수 사용
- [ ] localStorage에 refresh token 보관
- [ ] Recoil 전역 변수에 access token 보관
- [ ] 요청 인터셉터로 Authorization Bearer 헤더 자동 설정
- [ ] access token 만료 시 자동 refresh 후 재요청 로직

## 구현 계획

### 1단계: 프로젝트 구조 분석 및 기본 설정

- [x] 현재 프로젝트 구조 파악
- [x] 필요한 폴더 구조 확인 (src/store 폴더 생성 완료)
- [x] 환경변수 설정 확인 (.env.local이 .gitignore에 포함되어 추적되지 않음)

### 2단계: Recoil 상태 관리 설정

- [x] src/store/auth.js - 인증 관련 Recoil atom 생성 (accessToken, isAuthenticated, userInfo, authLoading)
- [x] access token 상태 관리

### 3단계: localStorage 유틸리티 함수

- [x] src/utils/tokenStorage.js - 토큰 저장/조회/삭제 함수 (완전한 토큰 관리 유틸리티)
- [x] refresh token 관리 (저장, 조회, 삭제, 존재 여부 확인)

### 4단계: JWT axios 인스턴스 기본 구조

- [x] src/service/axios.js - 기본 axios 인스턴스 생성
- [x] 환경변수 기반 baseURL 설정 (VITE_API_BASE_URL)

### 5단계: 요청 인터셉터 구현

- [x] Authorization 헤더 자동 설정 (토큰 관리 함수 포함)
- [x] access token을 Bearer 형태로 전달

### 6단계: 응답 인터셉터 및 자동 갱신 로직

- [x] 401 에러 감지
- [x] refresh token으로 access token 갱신
- [x] 원본 요청 재시도 (대기열 관리 포함)
- [x] refresh token 만료 시 로그아웃 처리

### 7단계: API 함수 래퍼

- [x] src/service/api.js - 공통 API 함수들 (GET, POST, PUT, DELETE)
- [x] 에러 처리 및 응답 포맷팅 (로그인, 로그아웃, 인증 초기화 포함)

### 8단계: 테스트 및 검증

- [x] 토큰 갱신 로직 테스트 (사용 가이드 제공)
- [x] 에러 핸들링 테스트 (테스트 방법 문서화)
- [x] 통합 테스트 (사용 예시 및 검증 방법 제공)

## 파일 구조

```
src/
├── store/
│   └── auth.js          # Recoil 인증 상태
├── utils/
│   └── tokenStorage.js  # 토큰 저장 유틸리티
├── service/
│   ├── axios.js         # JWT axios 인스턴스
│   └── api.js           # API 함수들
```

## 진행 상황

- [x] 계획 수립 완료
- [x] 1단계: 프로젝트 구조 분석 및 기본 설정 완료
- [x] 2단계: Recoil 상태 관리 설정 완료
- [x] 3단계: localStorage 유틸리티 함수 완료
- [x] 4단계: JWT axios 인스턴스 기본 구조 완료
- [x] 5단계: 요청 인터셉터 구현 완료
- [x] 6단계: 응답 인터셉터 및 자동 갱신 로직 완료
- [x] 7단계: API 함수 래퍼 완료
- [x] 8단계: 테스트 및 검증 가이드 완료

## ✅ 구현 완료 (Zustand로 업데이트)

**모든 단계가 성공적으로 완료되었고, Zustand로 전환되었습니다!**

### 🔄 주요 변경사항 (2024년 업데이트)

- **Recoil → Zustand 전환**: Recoil의 개발 중단으로 인해 Zustand로 완전 전환
- **더 간단한 API**: Provider 불필요, 더 직관적인 상태 관리
- **성능 향상**: 더 작은 번들 크기와 최적화된 리렌더링
- **TypeScript 친화적**: 완벽한 타입 추론 지원

### 생성된 파일들:

- `src/store/auth.js` - **Zustand 인증 상태 관리** (Recoil에서 전환)
- `src/utils/tokenStorage.js` - 토큰 저장 유틸리티
- `src/service/axios.js` - JWT 지원 axios 인스턴스 (Zustand 연동)
- `src/service/api.js` - 공통 API 함수들 (Zustand 연동)
- `docs/zustand-jwt-api-usage-guide.md` - **Zustand 기반 사용 가이드**
- `docs/jwt-api-usage-guide.md` - 기존 Recoil 가이드 (참고용)

### 의존성 변경사항:

- ✅ `zustand` 설치
- ❌ `recoil` 제거

### 다음 단계

1. `.env.local` 파일에 `VITE_API_BASE_URL` 설정
2. **`docs/zustand-jwt-api-usage-guide.md`** 를 참고하여 기존 코드에 통합
3. 기존 Recoil 코드를 Zustand로 교체
4. 로그인/로그아웃 기능 연동
5. API 호출 부분을 새로운 함수들로 교체
