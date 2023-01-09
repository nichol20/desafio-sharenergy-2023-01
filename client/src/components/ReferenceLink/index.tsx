import React from 'react'
import { copyIcon } from '../../assets'

import styles from './style.module.scss'

interface ReferenceLinkProps {
  link: string
}

export const ReferenceLink = ({ link }: ReferenceLinkProps) => {

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className={styles.reference_link_box}>
      <span className={styles.reference_link}>{link}</span>
      <button className={styles.copy_button} onClick={copyLinkToClipboard}>
        <img src={copyIcon} alt="copy"/>
      </button>
    </div>
  )
}