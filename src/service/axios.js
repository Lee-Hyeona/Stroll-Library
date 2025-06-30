import axios from "axios";
import {
  getRefreshToken,
  setRefreshToken,
  clearAuthStorage,
} from "../utils/tokenStorage";
import { useAuthStore } from "../store/auth";

// 환경변수에서 API Base URL 가져오기
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

// 현재 access token을 저장할 변수
let currentAccessToken = null;

/**
 * Access Token 설정
 * @param {string} token - 설정할 access token
 */
export const setAccessToken = (token) => {
  currentAccessToken = token;
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

/**
 * 현재 Access Token 조회
 * @returns {string|null} - 현재 설정된 access token
 */
export const getAccessToken = () => {
  return currentAccessToken;
};

/**
 * Access Token 제거
 */
export const removeAccessToken = () => {
  currentAccessToken = null;
  delete apiClient.defaults.headers.common["Authorization"];
};

// 토큰 갱신 관련 변수들
let isRefreshing = false;
let failedQueue = [];

/**
 * 대기 중인 요청들을 처리하는 함수
 * @param {Error|null} error - 에러 객체 (성공 시 null)
 * @param {string|null} token - 새로운 access token (실패 시 null)
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh Token으로 새로운 Access Token 발급
 * @returns {Promise<string>} - 새로운 access token
 */
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    // refresh token으로 새로운 access token 요청
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // 새로운 토큰들 저장
    setAccessToken(accessToken);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }

    // Zustand store에 새로운 access token 업데이트
    useAuthStore.getState().updateAccessToken(accessToken);

    return accessToken;
  } catch (error) {
    // refresh token도 만료된 경우
    console.error("🔄 Token refresh failed:", error);

    // Zustand store에서 인증 정보 클리어
    useAuthStore.getState().clearAuth();
    removeAccessToken();

    // 로그인 페이지로 리다이렉트 (필요시)
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
};

// 요청 인터셉터: 모든 요청에 Authorization 헤더 자동 설정
apiClient.interceptors.request.use(
  (config) => {
    // 현재 토큰이 있으면 헤더에 설정
    if (currentAccessToken) {
      config.headers.Authorization = `Bearer ${currentAccessToken}`;
    }

    // 개발 환경에서 요청 로깅
    if (import.meta.env.DEV) {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        hasAuth: !!currentAccessToken,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken);

        // 원본 요청에 새로운 토큰 설정 후 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 401이 아닌 다른 에러는 그대로 전달
    return Promise.reject(error);
  }
);

// 기본 설정 로깅 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log("🔧 API Base URL:", API_BASE_URL);
}

export default apiClient;
