
import { useState } from 'react'
import { closeIcon } from '../../assets'
import { SearchInput } from '../SearchInput'
import styles from './style.module.scss'

interface ItemsPicker {
  onClose: () => void
  onIconClick: (index: number) => void
  icons: string[]
}

export const IconsPicker = ({ onIconClick, onClose, icons }: ItemsPicker) => {
  return (
    <div className={styles.icons_picker}>
      <div className={styles.responsive_box_relative}>
        <div className={styles.responsive_box_absolute}>
          <div className={styles.modal}>
            <button className={styles.close_button} onClick={onClose} type="button">
              <img src={closeIcon} alt="close" />
            </button>
            <div className={styles.icon_list}>
              {
                icons.map((icon, index) => {
                  return (
                    <div
                      className={styles.icon_box}
                      onClick={() => onIconClick(index)}
                      key={index}
                    >
                      <img src={icon} alt="icon" />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
