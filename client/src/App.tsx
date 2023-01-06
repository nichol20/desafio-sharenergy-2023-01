import { useContext, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Header } from "./components"
import { AuthContext } from "./contexts/AuthContext"

function App() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if(!user) navigate('/login')
  }, [])

  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  )
}

export default App
