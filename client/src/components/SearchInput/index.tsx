
import { searchIcon } from '../../assets'
import styles from './style.module.scss'

interface SearchInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  id?: string | undefined
  className?: string | undefined
  placeholder?: string | undefined
  maxLength?: number | undefined
  defaultValue?: string | number | readonly string[] | undefined
}

export const SearchInput = ({onChange, id, className, placeholder, maxLength, defaultValue}: SearchInputProps) => {
 return (
  <div className={styles.search_box}>
    <input
     type="text" 
     onChange={onChange}
     placeholder={placeholder}
     id={id}
     className={className}
     maxLength={maxLength}
     defaultValue={defaultValue}
    />
    <img src={searchIcon} alt="search" />
  </div>
 )
}