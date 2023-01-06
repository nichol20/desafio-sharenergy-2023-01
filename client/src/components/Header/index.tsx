import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const pages: any = {
  '/': 'Random users',
  'cat-api': 'Cat api',
  'random-dog': 'Random dog',
  'clients-registration': 'Cadastro de clientes'
}

export const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>Desafio Sharenergy</h2>
      <nav className={styles.nav_bar}>
        <button className={styles.toggle_menu}></button>
        <ul className={styles.nav_list}>
          {
            Object.keys(pages).map((key, index) => {
              return (
                <li className={styles.nav_item} key={index} >
                  <Link to={key} className={styles.link}>
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
