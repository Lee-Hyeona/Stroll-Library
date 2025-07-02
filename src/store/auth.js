import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  setRefreshToken,
  getRefreshToken,
  clearAuthStorage,
  setUserInfo,
  getUserInfo,
} from "../utils/tokenStorage";

// 인증 스토어 타입 정의 (JSDoc 스타일)
/**
 * @typedef {Object} AuthState
 * @property {string|null} accessToken - Access token
 * @property {boolean} isAuthenticated - 인증 상태
 * @property {Object|null} userInfo - 사용자 정보
 * @property {boolean} isLoading - 로딩 상태 (토큰 갱신 중)
 * @property {function} setAccessToken - Access token 설정
 * @property {function} setAuthenticated - 인증 상태 설정
 * @property {function} setUserInfo - 사용자 정보 설정
 * @property {function} setLoading - 로딩 상태 설정
 * @property {function} login - 로그인 처리
 * @property {function} logout - 로그아웃 처리
 * @property {function} clearAuth - 인증 정보 초기화
 * @property {function} initializeAuth - 인증 초기화
 */

/**
 * Zustand 인증 스토어
 */
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // 상태
        accessToken: null,
        isAuthenticated: true,
        userInfo: true,
        isLoading: false,

        // 액션들
        setAccessToken: (token) => {
          set({ accessToken: token }, false, "auth/setAccessToken");
        },

        setAuthenticated: (status) => {
          set({ isAuthenticated: status }, false, "auth/setAuthenticated");
        },

        setUserInfo: (info) => {
          set({ userInfo: info }, false, "auth/setUserInfo");
          // localStorage에도 저장
          setUserInfo(info);
        },

        setLoading: (loading) => {
          set({ isLoading: loading }, false, "auth/setLoading");
        },

        /**
         * 로그인 처리
         * @param {Object} userData - 사용자 데이터
         * @param {string} accessToken - Access token
         * @param {string} refreshToken - Refresh token
         */
        login: (userData, accessToken, refreshToken) => {
          set(
            {
              accessToken,
              isAuthenticated: true,
              userInfo: userData,
              isLoading: false,
            },
            false,
            "auth/login"
          );

          // localStorage에 저장
          setRefreshToken(refreshToken);
          setUserInfo(userData);
        },

        /**
         * 로그아웃 처리
         */
        logout: () => {
          set(
            {
              accessToken: null,
              isAuthenticated: false,
              userInfo: null,
              isLoading: false,
            },
            false,
            "auth/logout"
          );

          // localStorage 정리
          clearAuthStorage();
        },

        /**
         * 인증 정보 초기화 (에러 시 사용)
         */
        clearAuth: () => {
          set(
            {
              accessToken: null,
              isAuthenticated: false,
              userInfo: null,
              isLoading: false,
            },
            false,
            "auth/clearAuth"
          );

          clearAuthStorage();
        },

        /**
         * 앱 초기화 시 인증 정보 복원
         */
        initializeAuth: () => {
          const refreshToken = getRefreshToken();
          const savedUserInfo = getUserInfo();

          if (refreshToken && savedUserInfo) {
            set(
              {
                userInfo: savedUserInfo,
                isAuthenticated: true,
                isLoading: false,
              },
              false,
              "auth/initializeAuth"
            );
            return true;
          }

          return false;
        },

        /**
         * 토큰 갱신 시 access token 업데이트
         * @param {string} newAccessToken - 새로운 access token
         */
        updateAccessToken: (newAccessToken) => {
          set({ accessToken: newAccessToken }, false, "auth/updateAccessToken");
        },
      }),
      {
        name: "auth-storage", // localStorage 키 이름
        // 민감한 정보는 localStorage에 저장하지 않음 (accessToken 제외)
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          userInfo: state.userInfo,
        }),
      }
    ),
    {
      name: "auth-store", // devtools에서 보여질 이름
    }
  )
);

// 편의를 위한 selector 함수들
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useUserInfo = () => useAuthStore((state) => state.userInfo);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// 액션들만 가져오는 훅
export const useAuthActions = () =>
  useAuthStore((state) => ({
    setAccessToken: state.setAccessToken,
    setAuthenticated: state.setAuthenticated,
    setUserInfo: state.setUserInfo,
    setLoading: state.setLoading,
    login: state.login,
    logout: state.logout,
    clearAuth: state.clearAuth,
    initializeAuth: state.initializeAuth,
    updateAccessToken: state.updateAccessToken,
  }));
