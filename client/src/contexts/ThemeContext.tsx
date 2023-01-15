import { createContext, useState } from "react";

interface ThemeContext {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeContext = createContext({} as ThemeContext)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [ theme, setTheme ] = useState<ThemeContext["theme"]>(
    localStorage.getItem('theme') === "dark" ? "dark" : "light"
  )

  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      { children }
    </ThemeContext.Provider>
  )
}