import { useContext } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./components"
import { AuthContext } from "./contexts/AuthContext"
import { ThemeContext } from "./contexts/ThemeContext"

function App() {
  const { user } = useContext(AuthContext)
  const { theme } = useContext(ThemeContext)

  if(!user) return null

  return (
    <div className="App" data-theme={theme}>
      <Header />
      <Outlet />
    </div>
  )
}

export default App
