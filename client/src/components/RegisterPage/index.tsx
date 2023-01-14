import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../contexts/AuthContext'
import { useDebounce } from '../../hooks/useDebounce'
import { http } from '../../utils/http'

import styles from './style.module.scss'

export const RegisterPage = () => {
  const [ username, setUsername ] = useState('')
  const debouncedSearchValue = useDebounce(username, 300)
  const [ usernameExistsError, setUsernameExistsError ]= useState(false)
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ emptyFieldError, setEmptyFieldError ] = useState(false)
  const { user, signUp } = useContext(AuthContext)
  const navigate = useNavigate()
  const confirmPasswordDoesNotMatch =
   password !== confirmPassword && password.length > 0 && confirmPassword.length > 0

  
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
      await signUp(username, password)
    } catch (error: any) {
      if(error.response.data.message === 'User already exists') {
        setUsernameExistsError(true)
      }
    }
  }

  const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleConfirmPasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value)
  }

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameExistsError(false)
    setUsername(event.target.value)
  }

  // triggers the function after a while that the user stops typing
  useEffect(() => {
    const checkUsernameStatus = async () => {
      try {
        const { data } = await http.post('/users/check-username-status', {
          username
        })
        if(data.status === 'registered') setUsernameExistsError(true)
      } catch (error) {
        
      }
    }

    checkUsernameStatus()
  }, [ debouncedSearchValue ])

  useEffect(() => {
    if(user) navigate('/')
  }, [ user ])

  return (
    <div className={styles.register_page}>
      <form className={styles.register_interface} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="username">Usuário</label>
          <input
           type="text" 
           name='username' 
           id='username'
           onChange={handleUsernameInputChange}
          />
          { usernameExistsError && (
            <span className={styles.error_message}>Esse usuário já está em uso</span> 
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <input
           type="password" 
           name='password' 
           id='password' 
           onChange={handlePasswordInputChange}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
           type="password" 
           name='confirmPassword' 
           id='confirmPassword' 
           onChange={handleConfirmPasswordInputChange}
          />
        </div>
        { emptyFieldError && (
          <span className={styles.error_message}>É necessário preencher todos os campos</span>
        )}
        { confirmPasswordDoesNotMatch && (
          <span className={styles.error_message}>As duas senhas devem ser iguais</span> 
        )}
        <button className={styles.submit_button} type='submit'>Registrar</button>
        <span className={styles.login_link_box}>
          Já tem uma conta?&nbsp;
          <Link to='/login' className={styles.link} >login</Link>
        </span>
      </form>
    </div>
  )
}
