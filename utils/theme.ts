import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useMemo, useState } from "react";

export default function useGetThemeVariant() {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    console.log("prefersDarkMode", prefersDarkMode);

    const darkMode = useMemo(() => {
        return getDarkThemeLocalStorage() ?? prefersDarkMode;
    }, [prefersDarkMode]);

    console.log("darkMode", darkMode);

    const [mode, _setMode] = useState<"light" | "dark">(darkMode ? "dark" : "light");

    useEffect(() => {
        _setMode(darkMode ? "dark" : "light");
    }, [darkMode]);

    console.log("mode", mode);

    const toggleMode = () => {
        console.log("toggleMode");
        const newMode = mode === "light" ? "dark" : "light";
        if (localStorage) localStorage.setItem("theme", newMode);
        _setMode(newMode);
    };
    return { mode, toggleMode };
}

function getDarkThemeLocalStorage() {
    if (typeof window === "undefined") return null;

    const theme = window.localStorage.getItem("theme");

    if (theme === "dark") return true;
    else if (theme === "light") return false;

    return null;
}
