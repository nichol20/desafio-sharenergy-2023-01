import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

export default function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}