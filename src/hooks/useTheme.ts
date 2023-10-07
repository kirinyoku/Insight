import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Update the root class based on the theme
    const root = document.getElementById("root");
    if (root) {
      switch (theme) {
        case "dark":
          root.classList.add("dark");
          break;
        case "light":
          root.classList.remove("dark");
          break;
      }
    }
  }, [theme]);

  const changeTheme = (themeName: "light" | "dark") => {
    setTheme(themeName);
  };

  return [theme, changeTheme] as const;
}
