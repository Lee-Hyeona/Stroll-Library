import { useState, useMemo } from "react";
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

function App() {
  const theme = useMemo(() => responsiveFontSizes(createTheme(BDS)));
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
