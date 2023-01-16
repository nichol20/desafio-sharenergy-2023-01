import React, { useContext } from 'react'
import { notFoundComputerImg } from '../../assets'
import { ThemeContext } from '../../contexts/ThemeContext'

import styles from './style.module.scss'

export const NotFoundPage = () => {
  const { theme } = useContext(ThemeContext)

  return (
    <div className={styles.error_page} data-theme={theme}>
      <div className={styles.content}>
        <img src={notFoundComputerImg} alt="computer" />
        <h1>404</h1>
        <p>Página não encontrada</p>
      </div>
    </div>
  )
}
