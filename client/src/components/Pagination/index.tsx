import { Link, useNavigate } from 'react-router-dom'
import { chevronForwardIcon } from '../../assets'
import styles from './style.module.scss'

interface PaginationProps {
  currentPage: number
  lastPage: number
  baseUrl: string
}

export const Pagination = ({ currentPage, lastPage, baseUrl }: PaginationProps) => {
  const navigate = useNavigate()

  return (
    <ul className={styles.pagination}>
      <li className={styles.page_item} onClick={() => navigate(`${baseUrl}?page=${currentPage - 1}`)}>
        <img src={chevronForwardIcon} alt="chevron" className={styles.icon} />
      </li>
      {
        Array(lastPage + 1).fill('').map((_, index) => {
          // index ranges from 1 to the last page number
          if(index === 0) return

          const isLastPage = lastPage === index
          const isFirstPage = index === 1
          // for styling
          const isActive = currentPage === index

          // e.g. if lastPage = 50 then returns true for indexes 48, 49, 50 if currentPage is in range
          const isLastPageOrClose = (lastPage === index || lastPage - 1 === index || lastPage - 2 === index) && currentPage >= lastPage - 2

          // e.g. if lastPage = 50 then returns true for index 47 if currentPage is in range of indexes 48, 49 50
          const isCloseToLastPage = lastPage - 3 === index && currentPage >= lastPage - 2

          // e.g. if currentPage = 1 then returns true for indexes 1, 2, 3
          const isCurrentPageOrClose = index === currentPage || index === currentPage + 1 || index === currentPage + 2

          // it returns true once if the currentPage is at least 4 away from the last page
          // so if lastPage = 50 it returns true for currentPage = 46 and false for currentPage = 47
          // (if currentPage = 46 returns true for index 49)
          const isAtLeast4AwayToLastPage = index === currentPage + 3 && index !== lastPage
          
          if(isCloseToLastPage || isAtLeast4AwayToLastPage)
            return <li className={styles.page_item} key={'...'+index} >...</li>

          if(((isCurrentPageOrClose && !isLastPageOrClose) || isFirstPage) || (isLastPageOrClose || isLastPage)) {
            return (
              <li
              className={`${styles.page_item} ${isActive ? styles.active : ''}`}
              onClick={() => navigate(`${baseUrl}?page=${index}`)}
              key={index}
              >
                {index}
              </li>
            )
          }
        })
      }
      <li className={styles.page_item} onClick={() => navigate(`${baseUrl}?page=${currentPage + 1}`)}>
        <img src={chevronForwardIcon} alt="chevron" className={styles.icon} />
      </li>
    </ul>
  )
}