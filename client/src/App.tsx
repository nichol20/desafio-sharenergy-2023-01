import { useContext } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Header } from "./components"
import { AuthContext } from "./contexts/AuthContext"
import { ThemeContext } from "./contexts/ThemeContext"

function App() {
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)
  const location = useLocation()

  if(!user) return <Navigate to="/login" state={{ from: location }} replace />
  
  return (
    <div className="App" data-theme={theme}>
      <Header />
      <Outlet />
    </div>
  )
}

export default App
