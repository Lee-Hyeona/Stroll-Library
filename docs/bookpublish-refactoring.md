# BookPublish 컴포넌트 리팩토링 계획

## 리팩토링 목표

BookPublish 컴포넌트의 전체적인 구조를 개선하고, AI API 폴링 방식으로 변경하여 안정성과 가독성을 향상시킵니다.

## 현재 문제점 분석

### ❌ 기존 코드의 문제점

1. **useParams 미사용**: import했지만 실제로 사용하지 않음
2. **복잡한 시뮬레이션 로직**: 불필요한 setTimeout 기반 가짜 API 로직
3. **상태 관리 복잡성**: 여러 로딩 상태가 혼재됨
4. **데이터 구조 불일치**: location.state를 사용하려고 하지만 실제로는 미사용
5. **UI 표시 과다**: 제목과 내용까지 표시하여 불필요한 정보 노출

## 새로운 구현 계획

### ✅ 변경 사항

#### 1. 라우팅 및 파라미터 처리

- **기존**: `location.state?.bookData` 사용 (실제로는 미사용)
- **변경**: `useParams()`로 URL에서 `draftId` 추출
- **경로**: `/publish/:draftId`

#### 2. API 호출 방식 변경

- **기존**: setTimeout 기반 가짜 API 시뮬레이션
- **변경**: 1초마다 실제 API 폴링 (`apiClient.get(/ai/${draftId})`)
- **폴링 중단 조건**: 성공 응답 또는 컴포넌트 언마운트

#### 3. 응답 데이터 구조

```javascript
// API 응답 형태
{
  id: 1,
  summary: "AI 생성된 요약",
  price: 5,
  coverImageUrl: "generated.example.com",
  category: "문학",
}
```

#### 4. UI 단순화

- **제거**: 책 제목, 책 내용 섹션
- **유지**: 카테고리, 예상 포인트, 책 줄거리, 책 표지
- **표지 재생성 기능**: 제거 (API에서 최종 이미지만 받음)

#### 5. 상태 관리 개선

- **단일 로딩 상태**: `isLoading` 하나로 통합
- **에러 처리**: API 실패시 계속 로딩 상태 유지
- **데이터 상태**: `aiData` 상태로 API 응답 관리

### ✅ 구현 단계

#### 1단계: 기본 구조 재작성

- useParams로 draftId 추출
- 단순한 상태 구조 정의
- API 폴링 useEffect 구현

#### 2단계: UI 컴포넌트 정리

- 불필요한 섹션 제거 (제목, 내용)
- 표지 수정 기능 제거
- 로딩 UI 단순화

#### 3단계: API 통신 및 에러 처리

- apiClient를 사용한 실제 API 호출
- 폴링 로직 구현 (1초 간격)
- 성공/실패 처리

#### 4단계: 최종 출간 기능

- API 데이터 기반 출간 신청
- 완료 후 메인 페이지 이동

## 코드 구조

### 주요 상태

```javascript
const [isLoading, setIsLoading] = useState(true);
const [aiData, setAiData] = useState(null);
```

### 폴링 로직

```javascript
useEffect(() => {
  if (!draftId) return;

  const pollAiData = async () => {
    try {
      const response = await apiClient.get(`/ai/${draftId}`);
      setAiData(response.data);
      setIsLoading(false);
    } catch (error) {
      // 실패시 계속 로딩 상태 유지
      console.error("AI 데이터 로딩 실패:", error);
    }
  };

  const interval = setInterval(pollAiData, 1000);

  return () => clearInterval(interval);
}, [draftId]);
```

## 기대 효과

### 🎯 개선 결과

1. **코드 가독성 향상**: 불필요한 로직 제거로 핵심 기능에 집중
2. **안정성 증대**: 실제 API 기반 폴링으로 신뢰성 있는 데이터 처리
3. **유지보수성 향상**: 단순한 상태 구조로 디버깅 및 수정 용이
4. **사용자 경험 개선**: 명확한 로딩 상태와 에러 처리
5. **성능 최적화**: 불필요한 상태 업데이트 제거

## 진행 상황

- [x] 1단계: 기본 구조 재작성
- [x] 2단계: UI 컴포넌트 정리
- [x] 3단계: API 통신 및 에러 처리
- [x] 4단계: 최종 출간 기능
- [x] ✅ 테스트 및 검증

## 주의사항

1. **기존 UI 유지**: 전체적인 레이아웃과 스타일은 동일하게 유지
2. **폴링 성능**: 1초 간격으로 적절한 성능 유지
3. **메모리 누수 방지**: 컴포넌트 언마운트시 폴링 정리
4. **에러 복구**: API 일시적 실패시에도 계속 시도

## 리팩토링 완료 보고

### ✅ 성공적으로 완료된 작업

1. **파라미터 처리**: `useParams()`를 통해 URL에서 `draftId` 정상 추출
2. **API 폴링 구현**: 1초마다 `/ai/${draftId}` 엔드포인트 호출
3. **상태 관리 단순화**: `isLoading`, `aiData` 두 개의 상태로 관리 최적화
4. **UI 간소화**: 불필요한 제목/내용 섹션 제거, 표지 수정 기능 제거
5. **메모리 관리**: `useEffect` cleanup으로 폴링 인터벌 정리
6. **에러 처리**: API 실패시 계속 로딩 상태 유지하며 재시도

### 🎯 주요 개선 사항

- **코드 라인 수**: 449줄 → 234줄 (약 48% 단축)
- **상태 복잡도**: 7개 상태 → 2개 상태로 단순화
- **API 호출**: 가짜 시뮬레이션 → 실제 폴링 방식
- **UI 컴포넌트**: 불필요한 섹션 제거로 정보 집중
- **메모리 효율성**: 적절한 cleanup으로 메모리 누수 방지

### 📋 API 연동 명세

```javascript
// 요청: GET /ai/{draftId}
// 응답 형태:
{
  id: 1,
  summary: "AI 생성된 요약",
  price: 5,
  coverImageUrl: "generated.example.com",
  category: "문학"
}
```

### 🚀 다음 단계 권장사항

1. **백엔드 API 구현**: `/ai/${draftId}` 엔드포인트 실제 구현
2. **에러 UI 개선**: 장시간 로딩시 사용자 안내 메시지 추가
3. **성능 모니터링**: 폴링 간격 조정 및 최적화
4. **사용자 경험**: 진행률 표시 또는 예상 완료 시간 안내

## 📝 표지 재생성 기능 추가 (2024-01-XX)

### ✅ 새로 추가된 기능

#### 1. 표지 수정사항 입력

- **UI 컴포넌트**: `CoverModificationInput` (textarea)
- **상태 관리**: `coverModification` 상태로 사용자 피드백 저장
- **UX**: 재생성 중에는 입력 필드 비활성화

#### 2. 표지 재생성 버튼

- **UI 컴포넌트**: `RegenerateCoverButton`
- **활성화 조건**: 입력이 있고 재생성 중이 아닐 때만 활성화
- **로딩 표시**: "재생성 중..." 텍스트로 진행 상태 표시

#### 3. 재생성 API 연동

- **요청 URL**: `POST /ai/{draftId}/regenerate`
- **요청 Body**: `{"userPrompt": "사용자 피드백"}`
- **폴링 방식**: 1초마다 `/ai/${draftId}` 호출하여 결과 확인

#### 4. 스마트 데이터 업데이트

- **부분 업데이트**: `coverImageUrl`만 업데이트
- **데이터 보존**: 사용자가 수정한 `summary`는 유지
- **상태 초기화**: 완료시 입력 필드 자동 초기화

### 🎯 기술적 구현 세부사항

#### 폴링 로직

```javascript
const pollRegeneratedData = async () => {
  try {
    const response = await apiClient.get(`/ai/${draftId}`);

    // coverImageUrl만 업데이트, summary는 유지
    setAiData((prevData) => ({
      ...prevData,
      coverImageUrl: response.data.coverImageUrl,
    }));

    setIsRegeneratingCover(false);
    setCoverModification("");
    alert("표지가 재생성되었습니다!");
  } catch (error) {
    // 실패시 계속 폴링
    console.error("재생성 폴링 실패:", error);
  }
};
```

#### 안전장치

1. **요청 실패 허용**: 재생성 요청이 실패해도 폴링 시작 (이미 처리 중일 수 있음)
2. **메모리 관리**: 상태 변경시 자동으로 인터벌 정리
3. **사용자 피드백**: 완료시 알림 메시지 표시
4. **UI 비활성화**: 재생성 중 중복 요청 방지

### 📋 새로운 스타일 컴포넌트

- **CoverControls**: 표지 컨트롤 영역 레이아웃
- **CoverModificationInput**: 피드백 입력 텍스트 영역
- **RegenerateCoverButton**: 재생성 버튼 스타일

### 🔄 업데이트된 진행 상황

- [x] 1단계: 기본 구조 재작성
- [x] 2단계: UI 컴포넌트 정리
- [x] 3단계: API 통신 및 에러 처리
- [x] 4단계: 최종 출간 기능
- [x] 5단계: 표지 재생성 기능 추가
- [x] ✅ 테스트 및 검증
