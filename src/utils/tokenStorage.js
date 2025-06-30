// localStorage 키 상수
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_INFO_KEY = "userInfo";

/**
 * Refresh Token 저장
 * @param {string} token - 저장할 refresh token
 */
export const setRefreshToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (error) {
    console.error("Refresh token 저장 실패:", error);
  }
};

/**
 * Refresh Token 조회
 * @returns {string|null} - 저장된 refresh token 또는 null
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Refresh token 조회 실패:", error);
    return null;
  }
};

/**
 * Refresh Token 삭제
 */
export const removeRefreshToken = () => {
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Refresh token 삭제 실패:", error);
  }
};

/**
 * 사용자 정보 저장 (선택적)
 * @param {object} userInfo - 저장할 사용자 정보
 */
export const setUserInfo = (userInfo) => {
  try {
    if (userInfo) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    } else {
      localStorage.removeItem(USER_INFO_KEY);
    }
  } catch (error) {
    console.error("사용자 정보 저장 실패:", error);
  }
};

/**
 * 사용자 정보 조회
 * @returns {object|null} - 저장된 사용자 정보 또는 null
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return null;
  }
};

/**
 * 사용자 정보 삭제
 */
export const removeUserInfo = () => {
  try {
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error("사용자 정보 삭제 실패:", error);
  }
};

/**
 * 모든 인증 정보 삭제 (로그아웃 시 사용)
 */
export const clearAuthStorage = () => {
  removeRefreshToken();
  removeUserInfo();
};

/**
 * 토큰 존재 여부 확인
 * @returns {boolean} - refresh token 존재 여부
 */
export const hasRefreshToken = () => {
  return !!getRefreshToken();
};
