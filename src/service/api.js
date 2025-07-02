import apiClient, { setAccessToken, removeAccessToken } from "./axios";
import {
  setRefreshToken,
  getRefreshToken,
  hasRefreshToken,
  clearAuthStorage,
  setUserInfo,
  getUserInfo,
} from "../utils/tokenStorage";
import { useAuthStore } from "../store/auth";

/**
 * API 응답 포맷
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 성공 여부
 * @property {any} data - 응답 데이터
 * @property {string} message - 응답 메시지
 * @property {number} status - HTTP 상태 코드
 */

/**
 * 공통 에러 처리 함수
 * @param {Error} error - axios 에러 객체
 * @returns {ApiResponse} - 포맷된 에러 응답
 */
const handleApiError = (error) => {
  const response = {
    success: false,
    data: null,
    message: "요청 중 오류가 발생했습니다.",
    status: error.response?.status || 500,
  };

  if (error.response) {
    // 서버에서 응답을 받은 경우
    response.message = error.response.data?.message || error.message;
    response.status = error.response.status;
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    response.message = "서버에 연결할 수 없습니다.";
  } else {
    // 기타 에러
    response.message = error.message;
  }

  // 개발 환경에서 에러 로깅
  if (import.meta.env.DEV) {
    console.error("🚨 API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: response.status,
      message: response.message,
    });
  }

  return response;
};

/**
 * 성공 응답 포맷 함수
 * @param {any} data - 응답 데이터
 * @param {string} message - 성공 메시지
 * @param {number} status - HTTP 상태 코드
 * @returns {ApiResponse} - 포맷된 성공 응답
 */
const formatSuccessResponse = (
  data,
  message = "요청이 성공했습니다.",
  status = 200
) => {
  return {
    success: true,
    data,
    message,
    status,
  };
};

/**
 * GET 요청
 * @param {string} url - 요청 URL
 * @param {Object} config - axios 설정 객체
 * @returns {Promise<ApiResponse>} - API 응답
 */
export const get = async (url, config = {}) => {
  try {
    const response = await apiClient.get(url, config);
    return formatSuccessResponse(
      response.data,
      "데이터를 성공적으로 조회했습니다.",
      response.status
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * POST 요청
 * @param {string} url - 요청 URL
 * @param {any} data - 요청 데이터
 * @param {Object} config - axios 설정 객체
 * @returns {Promise<ApiResponse>} - API 응답
 */
export const post = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return formatSuccessResponse(
      response.data,
      "데이터를 성공적으로 저장했습니다.",
      response.status
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * PUT 요청
 * @param {string} url - 요청 URL
 * @param {any} data - 요청 데이터
 * @param {Object} config - axios 설정 객체
 * @returns {Promise<ApiResponse>} - API 응답
 */
export const put = async (url, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(url, data, config);
    return formatSuccessResponse(
      response.data,
      "데이터를 성공적으로 수정했습니다.",
      response.status
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * DELETE 요청
 * @param {string} url - 요청 URL
 * @param {Object} config - axios 설정 객체
 * @returns {Promise<ApiResponse>} - API 응답
 */
export const del = async (url, config = {}) => {
  try {
    const response = await apiClient.delete(url, config);
    return formatSuccessResponse(
      response.data,
      "데이터를 성공적으로 삭제했습니다.",
      response.status
    );
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 회원가입
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.email - 아이디
 * @param {string} credentials.password - 비밀번호
 * @returns {Promise<ApiResponse>} - 로그인 응답
 */
export const signup = async (signupData) => {
  try {
    const response = await post("/auth/register", signupData);

    if (response?.data) {
      return formatSuccessResponse(response.data, "회원가입에 성공했습니다.");
    }

    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 로그인
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.email - 아이디
 * @param {string} credentials.password - 비밀번호
 * @returns {Promise<ApiResponse>} - 로그인 응답
 */
export const login = async (credentials) => {
  try {
    const response = await post("/auth/login", credentials);

    if (response?.data) {
      const { accessToken, refreshToken, user } = response.data;

      // Zustand store에 로그인 정보 저장
      useAuthStore.getState().login(user, accessToken, refreshToken);

      // axios 인스턴스에 토큰 설정
      setAccessToken(accessToken);

      return formatSuccessResponse(user, "로그인에 성공했습니다.");
    }

    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 로그아웃
 * @returns {Promise<ApiResponse>} - 로그아웃 응답
 */
export const logout = async () => {
  try {
    // 서버에 로그아웃 요청 (선택적)
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await post("/auth/logout", { refreshToken });
    }
  } catch (error) {
    // 로그아웃 요청이 실패해도 로컬 정보는 삭제
    console.warn("서버 로그아웃 요청 실패:", error);
  } finally {
    // Zustand store에서 로그아웃 처리
    useAuthStore.getState().logout();

    // axios 인스턴스에서 토큰 제거
    removeAccessToken();
  }

  return formatSuccessResponse(null, "로그아웃되었습니다.");
};

/**
 * 현재 사용자 정보 조회
 * @returns {Promise<ApiResponse>} - 사용자 정보 응답
 */
export const getCurrentUser = async () => {
  try {
    return await get("/users/me");
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * 앱 초기화 시 토큰 검증 및 사용자 정보 복원
 * @returns {Promise<boolean>} - 인증 상태
 */
export const initializeAuth = async () => {
  try {
    if (!hasRefreshToken()) {
      return false;
    }

    // Zustand store에서 로컬 데이터 복원 시도
    const initialized = useAuthStore.getState().initializeAuth();

    if (!initialized) {
      return false;
    }

    // 서버에서 현재 사용자 정보 검증
    const response = await getCurrentUser();

    if (response.success) {
      // 서버 검증이 성공하면 사용자 정보 업데이트
      useAuthStore.getState().setUserInfo(response.data);
      return true;
    } else {
      // 서버 검증이 실패하면 모든 인증 정보 클리어
      useAuthStore.getState().clearAuth();
      removeAccessToken();
      return false;
    }
  } catch (error) {
    console.error("인증 초기화 실패:", error);
    useAuthStore.getState().clearAuth();
    removeAccessToken();
    return false;
  }
};

// 기본 export
export default {
  get,
  post,
  put,
  delete: del,
  login,
  logout,
  getCurrentUser,
  initializeAuth,
};
