import React from 'react'
import { notFoundComputerImg } from '../../assets'

import styles from './style.module.scss'

export const NotFoundPage = () => {
  return (
    <div className={styles.error_page}>
      <div className={styles.content}>
        <img src={notFoundComputerImg} alt="" />
        <h1>404</h1>
        <p>Página não encontrada</p>
      </div>
    </div>
  )
}
