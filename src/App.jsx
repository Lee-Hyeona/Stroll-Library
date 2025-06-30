import { useState, useMemo, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Main } from "./pages/main/Main";
import router from "./Router";
import { BDS } from "./styles/BDS";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NewBook from "./pages/newbook/NewBook.jsx";
import { initializeAuth } from "./service/api";

function App() {
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const theme = useMemo(() => responsiveFontSizes(createTheme(BDS)));

  useEffect(() => {
    const initAuth = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error("인증 초기화 실패:", error);
      } finally {
        setIsAuthInitialized(true);
      }
    };

    initAuth();
  }, []);

  // 인증 초기화가 완료될 때까지 로딩 화면 표시
  if (!isAuthInitialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        로딩 중...
      </div>
    );
  }

  return (
    <div className="App">
      <MUIThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </StyledThemeProvider>
      </MUIThemeProvider>
    </div>
  );
}
export default App;
