import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export default function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  /* 
    I can't set the initial value for the useState hook based on localStorage 
    because I get a hydration error. I assume this is because useState 
    is initialized on the server side even when using the "use client" component. 
    That is why I use useEffect to set the default value of useState. 
  */
  useEffect(() => {
    try {
      // In theory, there should never be a error here, but just in case.
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme as Theme);
      }
    } catch (error) {
      console.error(error);
      console.log(
        "This is an error caused by using useEffect for initializing the useTheme value"
      );
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    // Update the root class based on the theme
    const root = document.getElementById("root");
    if (root) {
      if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [theme]);

  const changeTheme = (themeName: Theme) => {
    setTheme(themeName);
  };

  return [theme, changeTheme] as const;
}
