import React from 'react'
import { copyIcon, searchIcon } from '../../assets'

import styles from './style.module.scss'

export const CatApiPage = () => {
  return (
    <div className={styles.cat_api}>
      <div className={styles.field}>
        <label htmlFor="httpCode">Insira seu código HTTP:</label>
        <div className={styles.input_box}>
          <input type="text" id='httpCode'/>
          <img src={searchIcon} alt="search" />
        </div>
      </div>

      <div className={styles.cat_image_container}>
        <div className={styles.image_box}>
          <img src="https://http.cat/500" alt="cat" />
        </div>
      </div>

      <div className={styles.reference_link_box}>
        <span className={styles.reference_link}>https://http.cat/[status_code]</span>
        <button className={styles.copy_button}>
          <img src={copyIcon} alt="copy" />
        </button>
      </div>
    </div>
  )
}
