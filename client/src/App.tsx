import { useContext } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./components"
import { AuthContext } from "./contexts/AuthContext"

function App() {
  const { user } = useContext(AuthContext)

  if(!user) return null

  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  )
}

export default App
