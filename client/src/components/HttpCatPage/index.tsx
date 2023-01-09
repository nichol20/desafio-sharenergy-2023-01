import React, { useEffect, useState } from 'react'

import { httpCatApiUrl, availableHttpCodes } from '../../data/httpCat'
import { useDebounce } from '../../hooks/useDebounce'
import { SearchInput, ReferenceLink } from '../'

import { catHoldingSearchSignImg, notFoundImg } from '../../assets'
import styles from './style.module.scss'

const initialReferenceLink = 'https://http.cat/[status_code]'

export const HttpCatPage = () => {
  const [ requestUrl, setRequestUrl ] = useState(catHoldingSearchSignImg)
  const [ httpCodeUnavailableError, setHttpCodeUnavailableError ] = useState(false)
  const [ referenceLink, setReferenceLink ] = useState(initialReferenceLink)
  const [ httpCode, setHttpCode ] = useState('')
  const debouncedHttpCode = useDebounce(httpCode, 300)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHttpCode(event.target.value)
  }

  const handleChangingHttpCode = () => {
    setHttpCodeUnavailableError(false)

    // when the input is empty
    if(httpCode.length === 0) {
      setReferenceLink(initialReferenceLink)
      return setRequestUrl(catHoldingSearchSignImg)
    }

    const newRequestUrl = `${httpCatApiUrl}/${httpCode}`
    const isHttpCodeAvailable = availableHttpCodes.filter(value => value === parseInt(httpCode)).length > 0

    if(!isHttpCodeAvailable) {
      setReferenceLink(initialReferenceLink)
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
        <SearchInput
         id='httpCode' 
         onChange={handleInputChange} 
         maxLength={3} 
         placeholder="Ex: 200" 
         className={styles.search_input}
        />
        { httpCodeUnavailableError && <span className={styles.error_message}>Desculpe, mas esse código não está disponível.</span> } 
      </div>

      <ReferenceLink link={referenceLink} />
      
      <div className={styles.cat_image_container}>
        <div className={styles.image_box}>
          <CatImage />
        </div>
      </div>

      
    </div>
  )
}
