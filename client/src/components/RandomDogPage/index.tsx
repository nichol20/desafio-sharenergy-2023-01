import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

import { allowedMimeTypes, randomDogApiUrl } from '../../data/randomDog'
import { RandomDogApiResponse } from '../../types/randomDog'
import { ReferenceLink } from '../'

import { loadingDogGif } from '../../assets'
import styles from './style.module.scss'

export const RandomDogPage = () => {
  const [ imageUrl, setImageUrl ] = useState(loadingDogGif)
  const [ referenceLink, setReferenceLink ] = useState('https://random.dog')

  const checkIfMimeTypeIsAllowed = (mimeType: string): boolean => {
    return allowedMimeTypes.filter(mt => mt === mimeType).length > 0
  }
  
  const refreshImage = async () => {
    setImageUrl(loadingDogGif)
    setReferenceLink('https://random.dog')

    try {
      const response: AxiosResponse<RandomDogApiResponse> = await axios.get(randomDogApiUrl)
      const responseUrlSplited = response.data.url.split('.')
      const mimeType = responseUrlSplited[responseUrlSplited.length - 1]

      if(checkIfMimeTypeIsAllowed(mimeType)) {
        setReferenceLink(response.data.url)
        return setImageUrl(response.data.url)
      }
      
      await refreshImage()
    } catch (error: any) {
      console.log(error)
    }

  }

  useEffect(() => {
    refreshImage()
  }, [])

  return (
    <div className={styles.random_dog}>
      <h2 className={styles.title}>Encontre um cachorro</h2>
      <button className={styles.refresh_button} onClick={refreshImage}>Refresh</button>
      <ReferenceLink link={referenceLink} />
      <div className={styles.dog_image_container}>
        <div className={styles.image_box}>
          <img src={imageUrl} alt="dog" />
        </div>
      </div>
    </div>
  )
}
