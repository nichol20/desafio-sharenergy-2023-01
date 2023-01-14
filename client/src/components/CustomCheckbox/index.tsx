import React, { useContext } from 'react'
import { ThemeContext } from '../../contexts/ThemeContext'

import styles from './style.module.scss'

interface CustomCheckboxProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const CustomCheckbox = ({ onChange }: CustomCheckboxProps) => {
  const { theme } = useContext(ThemeContext)
  return (
    <label className={styles.checkbox_container} data-theme={theme}>
      <input type="checkbox" name='remember' onChange={onChange} />
      <span className={styles.checkmark}></span>
    </label>
  )
}
