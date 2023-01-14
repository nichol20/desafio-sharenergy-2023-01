import { useContext } from "react";

import { ThemeContext } from "../../contexts/ThemeContext";

import { moonIcon, sunIcon } from "../../assets";
import styles from './style.module.scss'

export const ThemeToggle = () => {
  const { toggleTheme, theme } = useContext(ThemeContext)

  return (
    <div onClick={toggleTheme} className={`${styles.toggle} ${theme === 'light' ? styles.active : ''}`}>
      <div className={styles.icons}>
        <img src={moonIcon} alt="moon" />
        <img src={sunIcon} alt="sun" />
      </div>
      <div className={styles.circle}></div>
    </div>
  );
}
