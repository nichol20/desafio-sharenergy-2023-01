import { Link } from 'react-router-dom'

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

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonEl = event.currentTarget

    buttonEl.classList.toggle(styles.active)
  }

  const closeMenu = () => {
    const buttonEl = document.querySelector(`.${styles.toggle_menu}`)
    buttonEl?.classList.remove(styles.active)
  }

  return (
    <header className={styles.header}>
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
        </ul>
      </nav>
    </header>
  )
}
