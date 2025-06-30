# 글쓰기 및 임시저장 기능 구현

## 구현 완료된 기능

### ✅ WriteBook 페이지 (/write)

- **경로**: `/write`
- **컴포넌트**: `src/pages/writebook/WriteBook.jsx`
- **기능**:
  - 제목 입력 필드
  - 내용 입력 필드 (최소 높이 400px, 책 내용을 고려한 크기)
  - 임시 저장 버튼 (회색)
  - 최종 저장 버튼 (검정)
  - 편집 모드 지원 (임시저장된 글 편집 가능)
- **스타일**: Login/SignUp 페이지 참고하여 일관성 있는 UI 구현
- **임시저장 로직**:
  - localStorage에 제목, 내용, ID, 저장시간 저장
  - 임시저장 후 `/drafts` 페이지로 자동 이동
  - 편집 모드에서는 기존 데이터 업데이트

### ✅ MyWritings 페이지 (/drafts)

- **경로**: `/drafts`
- **컴포넌트**: `src/pages/writebook/MyWritings.jsx`
- **기능**:
  - 임시저장된 글 목록 표시
  - 제목과 저장시간을 한 줄에 양쪽 끝으로 배치
  - 내용 미리보기 (100자 제한)
  - 시간 표시 (방금 전, n분 전, n시간 전, 날짜)
  - 목록 클릭 시 WriteBook으로 이동하여 편집
  - 삭제 버튼 (×) 제공
  - 새 글 쓰기 버튼
  - 빈 상태 처리

### ✅ 라우터 설정

- **Router.jsx** 업데이트:
  - `/write` → WriteBook 컴포넌트
  - `/drafts` → MyWritings 컴포넌트
  - 컴포넌트 import 추가

### ✅ ProfilePopover 연동

- **기존 경로 확인**: ProfilePopover에서 "글쓰기" 버튼이 `/write`로 연결됨
- **메뉴 항목**:
  - "글쓰기" → `/write`
  - "글 임시 저장 목록" → `/drafts`

## 데이터 구조

### localStorage 저장 형식

```javascript
// key: "drafts"
[
  {
    id: 1234567890, // timestamp
    title: "글 제목",
    content: "글 내용...",
    savedAt: "2024-01-01T12:00:00.000Z", // ISO 문자열
  },
];
```

## UI/UX 특징

### WriteBook 페이지

- 최대 너비 800px로 제한하여 가독성 향상
- 내용 입력 필드는 세로 크기 조절 가능 (resize: vertical)
- 버튼은 flex로 동일한 크기로 배치
- focus 시 테두리 색상 변경 (검정)

### MyWritings 페이지

- 카드 형태의 목록 디자인
- hover 시 테두리 강조 및 그림자 효과
- 시간 표시를 상대적 시간으로 사용자 친화적 표현
- 삭제 버튼은 우측 상단에 배치, hover 시 빨간색

## 사용 흐름

1. **새 글 작성**:

   - ProfilePopover "글쓰기" 클릭 → WriteBook 페이지
   - 제목, 내용 입력 후 "임시 저장" → MyWritings 페이지

2. **임시저장 글 편집**:

   - MyWritings에서 글 클릭 → WriteBook 페이지 (편집 모드)
   - 수정 후 "임시 저장" → 기존 데이터 업데이트

3. **최종 저장**:
   - WriteBook에서 "저장" 버튼 → 실제 책 저장 (API 연동 필요)

## 최근 업데이트 (2024-01-XX)

### ✅ WriteBook 페이지 개선

- **스크롤 기능 추가**: BookDetail 페이지의 스크롤 기능 적용
  - `overflow-y: auto`: 내용이 길어지면 스크롤 생성
  - `max-height: 600px`: 최대 높이 제한
  - `white-space: pre-wrap`: 줄바꿈 보존

### ✅ MyWritings 페이지 UI 개선

- **내용 미리보기 제거**: DraftPreview 컴포넌트 삭제
- **레이아웃 개선**: 제목과 시간을 한 줄에 정렬 (`align-items: center`)
- **삭제 버튼 디자인 변경**:
  - 타원형 → 모서리가 둥근 정사각형 (`border-radius: 50%` → `4px`)
- **페이지 타이틀 추가**:
  - 상단에 "임시 저장 목록" 중앙 정렬 타이틀
  - Login/SignUp 페이지와 일관성 있는 스타일
- **버튼 배치 개선**: 새 글 쓰기 버튼을 우측 정렬

### ✅ 헤더 겹침 문제 해결

- **고정 헤더 대응**: 두 페이지 모두 `padding-top: 7rem` 추가
  - WriteBook: 글쓰기/글 편집하기 타이틀이 헤더에 가려지지 않음
  - MyWritings: 임시 저장 목록 타이틀이 헤더에 가려지지 않음
- **글 제목 정렬 수정**: DraftTitle에 `text-align: left` 명시적 추가

### ✅ 책 출간 기능 구현

- **BookPublish 페이지 (`/publish`)** 추가:
  - AI 기반 자동 생성 기능:
    - 카테고리 분류 (문학, 경제, 자기계발, 라이프스타일, 기타)
    - 예상 포인트 산정 (500-2500p)
    - 책 줄거리 자동 요약
    - 책 표지 자동 생성
  - 사용자 편집 기능:
    - 책 줄거리 수정 가능 (스크롤 지원)
    - 책 표지 수정사항 입력 및 재생성
  - UI/UX:
    - 3초 로딩 애니메이션
    - 깔끔한 카드 기반 레이아웃
    - 스크롤 가능한 내용 및 줄거리 영역
- **출간 프로세스**:
  - WriteBook "저장" → BookPublish 페이지 이동
  - AI 정보 생성 → 사용자 수정 → 최종 출간 신청
  - localStorage에 출간된 책 정보 저장
- **메인 페이지 연동**:
  - API 데이터 + localStorage 출간 책 통합 표시
  - 최신순 정렬로 출간된 책 우선 노출
  - 기존 Card 컴포넌트 재사용

## 향후 개선 사항

- [ ] 실제 AI API 연동 (OpenAI, Claude 등)
- [ ] 책 표지 생성 AI API 연동
- [ ] 자동 저장 기능
- [ ] 글 내용 포맷팅 (마크다운 등)
- [ ] 이미지 업로드 기능
- [ ] 관리자 승인 시스템
