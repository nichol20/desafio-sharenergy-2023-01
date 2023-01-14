import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { logOutIcon } from '../../assets'
import { AuthContext } from '../../contexts/AuthContext'
import { ThemeContext } from '../../contexts/ThemeContext'
import { ThemeToggle } from '../ThemeToggle'

import styles from './style.module.scss'

interface Pages {
  [key: string]: string
}

const pages: Pages = {
  '/': 'RandomUsers',
  'http-cat': 'HttpCat',
  'random-dog': 'RandomDog',
  'clients-registration': 'Cadastro de clientes'
}

export const Header = () => {
  const { theme } = useContext(ThemeContext)
  const { signOut } = useContext(AuthContext)

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonEl = event.currentTarget

    buttonEl.classList.toggle(styles.active)
  }

  const closeMenu = () => {
    const buttonEl = document.querySelector(`.${styles.toggle_menu}`)
    buttonEl?.classList.remove(styles.active)
  }

  return (
    <header className={styles.header} data-theme={theme}>
      <h2 className={styles.logo}>Desafio Sharenergy</h2>
      <nav className={styles.nav_bar}>
        <button className={styles.toggle_menu} onClick={toggleMenu}></button>
        <ul className={styles.nav_list}>
          {
            Object.keys(pages).map((key, index) => {
              return (
                <li className={styles.nav_item} key={index} >
                  <Link to={key} className={styles.link} onClick={closeMenu}>
                    {pages[key]}
                  </Link>
                </li>
              )
            })
          }
          <ThemeToggle />
          <button className={styles.logout_button} onClick={signOut}>
            <img src={logOutIcon} alt="log out" />
          </button>
        </ul>
      </nav>
    </header>
  )
}
