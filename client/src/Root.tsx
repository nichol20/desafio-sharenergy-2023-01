import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function Root() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </AuthProvider>
  )
}