import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

import styles from './style.module.scss'

interface ConfirmationModalProps {
  onCancel: () => void
  onDelete: () => void
  message: string
}

export const ConfirmationModal = ({ onCancel, onDelete, message }: ConfirmationModalProps) => {
  const { theme } = useContext(ThemeContext)

  return (
    <div className={styles.confirmation_modal} data-theme={theme}>
      <div className={styles.warning_container}>
        <h2>Você tem certeza?</h2>
        <span>{message}</span>
        <div className={styles.actions_box}>
          <button className={styles.cancel} onClick={onCancel}>Cancel</button>
          <button className={styles.delete} onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  )
}
