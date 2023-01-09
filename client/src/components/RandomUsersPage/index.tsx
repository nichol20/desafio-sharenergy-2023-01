import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'

import { SearchInput, Pagination } from '../'
import { useDebounce } from '../../hooks/useDebounce'
import { Person, RandomUserApiResponse } from '../../types/randomUser'
import { randomUserApiUrl } from '../../data/randomUser'

import styles from './style.module.scss'

const numberOfPeoplePerPage = 10

export const RandomUsersPage = () => {
  const [ searchValue, setSearchValue ] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)
  const [ users, setUsers ] = useState<Person[]>([])
  const [ searchParams, setSearchParams ] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1')
  const currentPage = isNaN(pageParam) ? 1 : pageParam
  const lastPage = users.length / numberOfPeoplePerPage
  const initialApiUrl = `${randomUserApiUrl}?results=500`

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const fetchUsers = async () => {
    try {
      const response: AxiosResponse<RandomUserApiResponse> = await axios.get(initialApiUrl)
      setUsers(response.data.results)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])


  // triggers the function after a while that the user stops typing
  useEffect(() => {
    
  }, [debouncedSearchValue])

  return (
    <div className={styles.random_users}>
      <SearchInput
       onChange={handleInputChange} 
       placeholder='encontre alguém...' 
       className={styles.search_input} 
      />
      <div className={styles.table}>
        <div className={styles.table_heading}>
          <div className={styles.column}>perfil</div>
          <div className={styles.column}>nome</div>
          <div className={styles.column}>idade</div>
        </div>
        <div className={styles.list}>
          {
            users.map((user, index) => {
              const initialPosition = (currentPage - 1) * numberOfPeoplePerPage
              const finalPosition = (currentPage * numberOfPeoplePerPage) - 1
              const isInRange = index >= initialPosition && index <= finalPosition

              
              if(!isInRange) return

              return (
                <div className={styles.row} key={index} >
                  <div className={`${styles.column} ${styles.profile}`}>
                    <div className={styles.image_box}>
                      <img src={user.picture.medium} alt={user.name.first} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.username}>{user.login.username}</span>
                      <span className={styles.email}>{user.email}</span>
                    </div>
                  </div>
                  <div className={`${styles.column} ${styles.name}`}>{`${user.name.first} ${user.name.last}`}</div>
                  <div className={`${styles.column} ${styles.age}`}>{user.dob.age}</div>
                </div>
              )
            })
          }
        </div>
      </div>
      <Pagination baseUrl='/' currentPage={currentPage} lastPage={lastPage} />
    </div>
  )
}
