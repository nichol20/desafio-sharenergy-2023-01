import React from 'react'

import styles from './style.module.scss'

interface ConfirmationModalProps {
  onCancel: () => void
  onDelete: () => void
  message: string
}

export const ConfirmationModal = ({ onCancel, onDelete, message }: ConfirmationModalProps) => {

  return (
    <div className={styles.confirmation_modal}>
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
