import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Root from './Root'
import App from './App'
import { 
  RandomUsersPage, 
  LoginPage, 
  HttpCatPage, 
  RandomDogPage, 
  ClientsRegistrationPage, 
  RegisterPage,
  NotFoundPage
} from './components'

import './styles/global.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
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
      },
      {
        path: '/register',
        element: <RegisterPage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />,
)
