import { useSelector } from "react-redux";

import React from "react";

export default function ThemeProvider({ children }) {
  //here children is basically the things which are wrapped by <ThemeProvider></ThemeProvider> look in main.jsx file App is the children
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
        {children}
      </div>
    </div>
  );
}
