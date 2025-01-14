
import { useContext } from 'react'
import { copyIcon } from '../../assets'
import { ThemeContext } from '../../contexts/ThemeContext'
import styles from './style.module.scss'

interface ReferenceLinkProps {
  link: string
}

export const ReferenceLink = ({ link }: ReferenceLinkProps) => {
  const { theme } = useContext(ThemeContext)

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className={styles.reference_link_box} data-theme={theme}>
      <div className={styles.text_box}>
        <span className={styles.reference_link}>{link}</span>
      </div>
      <button className={styles.copy_button} onClick={copyLinkToClipboard}>
        <img src={copyIcon} alt="copy"/>
      </button>
    </div>
  )
}
