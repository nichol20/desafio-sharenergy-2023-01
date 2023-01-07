import axios from 'axios'
import React, { useState } from 'react'
import { copyIcon, searchIcon } from '../../assets'
import { apiUrl } from '../../data/httpCat'

import styles from './style.module.scss'

export const HttpCatPage = () => {
  const [ requestUrl, setRequestUrl ] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const httpCode = event.target.value
    const newRequestUrl = `${apiUrl}/${httpCode}`

    setRequestUrl(newRequestUrl)
    
  }

  return (
    <div className={styles.cat_api}>
      <div className={styles.field}>
        <label htmlFor="httpCode">Insira seu código HTTP:</label>
        <div className={styles.input_box}>
          <input type="text" id='httpCode' onChange={handleInputChange} maxLength={3}/>
          <img src={searchIcon} alt="search" />
        </div>
      </div>

      <div className={styles.reference_link_box}>
        <span className={styles.reference_link}>https://http.cat/[status_code]</span>
        <button className={styles.copy_button}>
          <img src={copyIcon} alt="copy"/>
        </button>
      </div>
      
      <div className={styles.cat_image_container}>
        <div className={styles.image_box}>
          <img src={requestUrl} alt="cat"/>
        </div>
      </div>

      
    </div>
  )
}
