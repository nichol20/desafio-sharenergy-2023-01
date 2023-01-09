import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App'
import { RandomUsersPage, LoginPage, HttpCatPage, RandomDogPage, ClientsRegistrationPage } from './components'
import { AuthProvider } from './contexts/AuthContext'
import './styles/global.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <RandomUsersPage />
      },
      {
        path: '/http-cat',
        element: <HttpCatPage />
      },
      {
        path: '/random-dog',
        element: <RandomDogPage />
      },
      {
        path: '/clients-registration',
        element: <ClientsRegistrationPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
)
