import { createContext, useMemo, useState, useContext, useEffect } from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import "@fontsource/hind-siliguri";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const getInitialMode = () => {
    const savedMode = localStorage.getItem("themeMode");
    return savedMode ? savedMode : prefersDarkMode ? "dark" : "light";
  };

  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // Light mode
                primary: {
                  main: "#e06666",
                },
                background: {
                  default: "##ebdede",
                  paper: "#fbefef",
                },
                text: {
                  primary: "#202020",
                  secondary: "#404040",
                },
              }
            : {
                // Dark mode
                primary: {
                  main: "#e99393",
                },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#aaaaaa",
                },
              }),
        },
        typography: {
          fontFamily: "Hind Siliguri, sans-serif",
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
