import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { catHoldingSearchSignImg, copyIcon, notFoundImg, searchIcon } from '../../assets'
import { apiUrl, availableHttpCodes } from '../../data/httpCat'
import { useDebounce } from '../../hooks/useDebounce'

import styles from './style.module.scss'

export const HttpCatPage = () => {
  const [ requestUrl, setRequestUrl ] = useState(catHoldingSearchSignImg)
  const [ httpCodeUnavailableError, setHttpCodeUnavailableError ] = useState(false)
  const [ referenceLink, setReferenceLink ] = useState('https://http.cat/[status_code]')
  const [ httpCode, setHttpCode ] = useState('')
  const debouncedHttpCode = useDebounce(httpCode, 300)

  const copyReferenceLinkToClipboard = () => {
    navigator.clipboard.writeText(referenceLink)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHttpCode(event.target.value)
  }

  const handleChangingHttpCode = () => {
    setHttpCodeUnavailableError(false)
    if(httpCode.length === 0) return setRequestUrl(catHoldingSearchSignImg)

    const newRequestUrl = `${apiUrl}/${httpCode}`
    const isHttpCodeAvailable = availableHttpCodes.filter(value => value === parseInt(httpCode)).length > 0

    if(!isHttpCodeAvailable) {
      setReferenceLink('https://http.cat/[status_code]')
      return setHttpCodeUnavailableError(true)
    }
    
    setReferenceLink(newRequestUrl)
    setRequestUrl(newRequestUrl)
  }

  const CatImage = () => {
    if(httpCodeUnavailableError) return <img src={notFoundImg} alt="not found"/>
    else return <img src={requestUrl} alt="cat"/>
  }

  // triggers the function after a while that the user stops typing
  useEffect(() => {
    handleChangingHttpCode()
  }, [debouncedHttpCode])

  return (
    <div className={styles.cat_api}>
      <div className={styles.field}>
        <label htmlFor="httpCode">Insira seu código HTTP:</label>
        <div className={styles.input_box}>
          <input type="text" id='httpCode' onChange={handleInputChange} maxLength={3}/>
          <img src={searchIcon} alt="search" />
        </div>
        { httpCodeUnavailableError && <span className={styles.error_message}>Desculpe, mas esse código não está disponível.</span> } 
      </div>

      <div className={styles.reference_link_box}>
        <span className={styles.reference_link}>{referenceLink}</span>
        <button className={styles.copy_button} onClick={copyReferenceLinkToClipboard}>
          <img src={copyIcon} alt="copy"/>
        </button>
      </div>
      
      <div className={styles.cat_image_container}>
        <div className={styles.image_box}>
          <CatImage />
        </div>
      </div>

      
    </div>
  )
}
