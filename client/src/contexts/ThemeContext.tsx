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
  const [ theme, setTheme ] = useState<ThemeContext["theme"]>('dark')

  const toggleTheme = () => {
    setTheme(current => {
      return current === 'light' ? 'dark' : 'light'
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      { children }
    </ThemeContext.Provider>
  )
}