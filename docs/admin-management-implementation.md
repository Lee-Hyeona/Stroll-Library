# 관리자 페이지 구현 계획

## 개요

관리자가 작가 신청을 관리할 수 있는 페이지 구현

## 구현 범위

1. **ManagePassword.jsx** - 관리자 인증 페이지
2. **ManageAuthorList.jsx** - 작가 신청 목록 페이지
3. **ManageAuthorDetail.jsx** - 작가 신청 상세 페이지

## 페이지별 상세 기능

### 1. ManagePassword.jsx

- 관리자 패스워드 입력 폼
- 인증 성공 시 작가 신청 목록 페이지로 이동
- 실패 시 에러 메시지 표시

### 2. ManageAuthorList.jsx

- 작가 신청한 사용자 목록 표시
- 각 항목: 유저 아이디, 작가명, 신청 날짜, 확인 버튼
- 확인 버튼 클릭 시 상세 페이지로 이동

### 3. ManageAuthorDetail.jsx

- 선택된 작가 신청의 상세 정보
- 표시 정보: 유저 아이디, 작가명, 신청 일자, 작가 소개 (왼쪽 정렬)
- 기능 버튼: 취소하기, 작가 승인하기
- 승인 완료 시 성공 팝업 표시

## 라우팅 구조

- `/admin/password` - 관리자 인증
- `/admin/authors` - 작가 신청 목록
- `/admin/authors/:userId` - 작가 신청 상세

## 사용 기술

- React + styled-components
- React Router
- 기존 Modal 컴포넌트 활용
- BDS 디자인 시스템 적용

## 구현 순서

1. 라우터에 관리자 페이지 경로 추가
2. ManagePassword 컴포넌트 구현
3. ManageAuthorList 컴포넌트 구현
4. ManageAuthorDetail 컴포넌트 구현
5. 페이지 간 네비게이션 연결

## 진행 상태

- [x] 라우터 설정
- [x] ManagePassword 구현
- [x] ManageAuthorList 구현
- [x] ManageAuthorDetail 구현
- [ ] 테스트 및 검증

## 구현 완료 사항

### 1. 라우터 설정 ✅

- `/admin/password` - 관리자 인증 페이지
- `/admin/authors` - 작가 신청 목록 페이지
- `/admin/authors/:userId` - 작가 신청 상세 페이지

### 2. ManagePassword.jsx ✅

- 관리자 패스워드 입력 폼 구현
- 인증 성공/실패 처리
- 세션 기반 권한 관리
- 에러 메시지 표시 기능

### 3. ManageAuthorList.jsx ✅

- 작가 신청 목록 테이블 표시
- 유저 아이디, 작가명, 신청 날짜, 확인 버튼 구현
- 관리자 로그아웃 기능
- 상세 페이지 네비게이션

### 4. ManageAuthorDetail.jsx ✅

- 작가 신청 상세 정보 표시 (왼쪽 정렬)
- 취소하기/작가 승인하기 버튼
- 승인 완료 모달 팝업
- 권한 검증 및 에러 처리

## 주요 기능

- **관리자 인증**: 패스워드 기반 접근 제어
- **권한 관리**: 세션 기반 관리자 권한 확인
- **작가 신청 관리**: 목록 조회 및 개별 승인/취소
- **성공 피드백**: 승인 완료 시 모달 팝업 표시
- **반응형 UI**: 모바일/데스크탑 대응

## 테스트 방법

1. `/admin/password` 접속하여 패스워드 `admin123` 입력
2. 작가 신청 목록에서 각 항목의 "확인" 버튼 클릭
3. 상세 페이지에서 "작가 승인하기" 버튼으로 승인 프로세스 테스트
