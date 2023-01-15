import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import { useHttpPrivate } from '../../hooks/useHttpPrivate'
import { CustomCheckbox } from '../CustomCheckbox'
import { ToastContainer, ToastRef } from '../ToastContainer'

import styles from './style.module.scss'

export const LoginPage = () => {
  const { theme } = useContext(ThemeContext)
  const { login, user } = useContext(AuthContext)
  const [ emptyFieldError, setEmptyFieldError ] = useState(false)
  const [ invalidCredentials, setInvalidCredentials ] = useState(false)
  const [ remember, setRemember ] = useState(false)

  const toastRef = useRef<ToastRef>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmptyFieldError(false)
    setInvalidCredentials(false)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    for(const pair of formData.entries()) {
      const isFieldEmpty = pair[1].length === 0
      
      if(isFieldEmpty) {
        setEmptyFieldError(true)
        return
      }
    }

    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      await login(username, password, remember)
    } catch (error: any) {
      if(error.response?.data?.message === 'User not found') {
        setInvalidCredentials(true)
        return
      }

      toastRef.current?.toast('Algo deu errado', 'erro no login', 'error')
    }

  }

  useEffect(() => {
    if(user) navigate(from, { replace: true })
  }, [ user ])

  return (
    <div className={styles.login_page} data-theme={theme} >
      <h1 className={styles.title}>DESAFIO SHARENERGY</h1>
      <form className={styles.login_interface} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="username">Usuário</label>
          <input type="text" name='username' id='username' onChange={handleInputChange}/>
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input type="password" name='password' id='password' onChange={handleInputChange}/>
        </div>
        { emptyFieldError && (
          <span className={styles.error_message}>É necessário preencher todos os campos</span>
        )}
        { invalidCredentials && (
          <span className={styles.error_message}>Credenciais inválidas</span>
        )}
        <div className={styles.remember_option}>
          <CustomCheckbox onChange={event => setRemember(event.target.checked)} />
          <span>Remember me</span>
        </div>
        <button className={styles.login_button} type='submit'>Login</button>
        <span className={styles.register_link_box}>
          Não tem uma conta?&nbsp;
          <Link to='/register' className={styles.link} >registre-se</Link>
        </span>
      </form>
      <ToastContainer ref={toastRef}/>
    </div>
  )
}