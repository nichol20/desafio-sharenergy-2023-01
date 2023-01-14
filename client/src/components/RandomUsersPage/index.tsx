import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'

import { SearchInput, Pagination, HighlightableText } from '../'
import { useDebounce } from '../../hooks/useDebounce'
import { Person, RandomUserApiResponse } from '../../types/randomUser'
import { randomUserApiUrl } from '../../data/randomUser'

import styles from './style.module.scss'
import { lowerCase } from '../../utils/functions'

const numberOfPeoplePerPage = 10
const initialApiUrl = `${randomUserApiUrl}?results=500`

export const RandomUsersPage = () => {
  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ searchValue, setSearchValue ] = useState(searchParams.get('search') || '')
  const debouncedSearchValue = useDebounce(searchValue, 300)
  
  const [ users, setUsers ] = useState<Person[]>([])
  const [ filteredUsers, setFilteredUsers ] = useState<Person[]>([])

  const pageParam = parseInt(searchParams.get('page') || '1')
  const currentPage = isNaN(pageParam) ? 1 : pageParam
  const lastPage = Math.ceil(filteredUsers.length / numberOfPeoplePerPage)


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const fetchUsers = async () => {
    try {
      const response: AxiosResponse<RandomUserApiResponse> = await axios.get(initialApiUrl)
      setUsers(response.data.results)
      setFilteredUsers(response.data.results)
    } catch (error) {
      console.log(error)
    }
  }

  const filterUser = () => {
    const filtered = users.filter((person) => {
      const name = `${person.name.first} ${person.name.last}`
      return lowerCase(person.email).includes(lowerCase(searchValue))
       || lowerCase(person.login.username).includes(lowerCase(searchValue))
       || lowerCase(name).includes(lowerCase(searchValue))
    })
    const searchParam = searchValue.length > 0 ? `search=${searchValue}` : ''
    setSearchParams(`?page=1&${searchParam}`)
    setFilteredUsers(filtered)
  }

  useEffect(() => {
    // fetchUsers()
  }, [])

  useEffect(() => {
    if(users.length > 0) filterUser()
  }, [ users ])


  // triggers the function after a while that the user stops typing
  useEffect(() => {
    filterUser()
  }, [debouncedSearchValue])

  return (
    <div className={styles.random_users}>
      <SearchInput
       onChange={handleInputChange} 
       placeholder='encontre alguém...' 
       className={styles.search_input} 
       defaultValue={searchValue}
      />
      <div className={styles.table}>
        <div className={styles.table_heading}>
          <div className={styles.column}>perfil</div>
          <div className={styles.column}>nome</div>
          <div className={styles.column}>idade</div>
        </div>
        <div className={styles.list}>
          {
            filteredUsers.map((user, index) => {
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
                      <span className={styles.username}>
                        <HighlightableText text={user.login.username} snippet={searchValue} />
                      </span>
                      <span className={styles.email}>
                        <HighlightableText text={user.email} snippet={searchValue} />
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.column} ${styles.name}`}>
                    <HighlightableText text={`${user.name.first} ${user.name.last}`} snippet={searchValue} />
                  </div>
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
