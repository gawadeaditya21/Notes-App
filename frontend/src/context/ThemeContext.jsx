import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

/**
 * ThemeProvider — wraps the app and provides dark/light mode state.
 * Persists user preference to localStorage under the key "theme".
 * Applies a `data-theme` attribute on <html> so CSS variables react accordingly.
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/** Convenience hook */
export const useTheme = () => useContext(ThemeContext);
