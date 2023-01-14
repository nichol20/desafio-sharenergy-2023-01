import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { http } from '../../utils/http'
import { AuthContext } from '../../contexts/AuthContext'
import { useDebounce } from '../../hooks/useDebounce'
import { AccessTokenCookieController } from '../../utils/cookies'

import { Client } from '../../types/user'

import { lowerCase } from '../../utils/functions'
import { Pagination, SearchInput, IconsPicker, HighlightableText } from '..'
import { ClientModal } from './ClientModal'

import { addIcon, personIcon } from '../../assets'
import styles from './style.module.scss'

type CurrentClient = Client | Omit<Client, "id" | "created_at">

const numberOfPeoplePerPage = 12

export const ClientsRegistrationPage = () => {
  const { user } = useContext(AuthContext)

  const [ clients, setClients ] = useState<Client[]>(user!.clientList)
  const [ filteredClients, setFilteredClients ] = useState<Client[]>(user!.clientList)

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ searchValue, setSearchValue ] = useState(searchParams.get('search') || '')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const pageParam = parseInt(searchParams.get('page') || '1')
  const currentPage = isNaN(pageParam) ? 1 : pageParam
  const lastPage = Math.ceil(filteredClients.length / numberOfPeoplePerPage)

  const [ showModal, setShowModal ] = useState(false)
  const [ clientModalType, setClientModalType ] = useState<'create' | 'edit'>('create')
  const [ currentClient, setCurrentClient ] = useState<CurrentClient>({
    name: '',
    email: '',
    address: '',
    cpf: '',
    phone: '',
    icon: ''
  })

  const openModal = () => {
    setShowModal(true)
    requestAnimationFrame(() => {
      const clientModalEl = document.querySelector(`.${styles.client_modal}`)
      clientModalEl?.classList.add(styles.active)
    })
  }

  const closeModal = () => {
    const clientModalEl = document.querySelector(`.${styles.client_modal}`)
    clientModalEl?.classList.remove(styles.active)
    setTimeout(() => {
      setShowModal(false)
    }, 100)
  }

  const handleClientCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setClientModalType('edit')
    setCurrentClient(clients[index])
    openModal()
  }

  const refreshClients = async () => {
    try {
      const { data } = await http.get('/clients', {
        headers: {
          Authorization: `Bearer ${AccessTokenCookieController.get()}`
        }
      })
      setClients(data)
      setFilteredClients(data)
    } catch (error) {
      
    }
  }

  const handleAddButtonClick = () => {
    setClientModalType('create')
    setCurrentClient({
      name: '',
      email: '',
      address: '',
      cpf: '',
      phone: '',
      icon: ''
    })
    openModal()
  }

  const handleSearchInputuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  const filterClients = () => {
    const filtered = clients.filter((client) => {
      const name = client.name || 'Sem nome'
      const email = client.email || 'Sem email'
      return lowerCase(email).includes(lowerCase(searchValue))
       || lowerCase(name).includes(lowerCase(searchValue))
    })
    const searchParam = searchValue.length > 0 ? `search=${searchValue}` : ''
    setSearchParams(`?page=1&${searchParam}`)
    setFilteredClients(filtered)
  }

  // triggers the function after a while that the user stops typing
  useEffect(() => {
    filterClients()
  }, [debouncedSearchValue])

  return (
    <div className={styles.clients_registration}>
      <SearchInput
       onChange={handleSearchInputuChange} 
       placeholder='encontre alguém...' 
       className={styles.search_input} 
       defaultValue={searchValue}
      />
      <div className={styles.list_container}>
        {
          filteredClients.map((client, index) => {
            const initialPosition = (currentPage - 1) * numberOfPeoplePerPage
            const finalPosition = (currentPage * numberOfPeoplePerPage) - 1
            const isInRange = index >= initialPosition && index <= finalPosition
            
            if(!isInRange) return

            return (
              <div
               className={styles.client_card} 
               onClick={event => handleClientCardClick(event, index)} 
               key={index}
              >
                <div className={styles.img_box}>
                  <img src={personIcon} alt="person" />
                </div>
                <div className={styles.profile}>
                  <h4 className={styles.name}>
                    <HighlightableText text={client.name || 'Sem nome'} snippet={searchValue} />
                  </h4>
                  <span className={styles.email}>
                    <HighlightableText text={client.email || 'Sem email'} snippet={searchValue} />
                  </span>
                </div>
              </div>
            )
          })
        }
      </div>
      <Pagination baseUrl='/clients-registration' currentPage={currentPage} lastPage={lastPage} />
      <button className={styles.add_button} onClick={handleAddButtonClick}>
        <img src={addIcon} alt='add' />
      </button>
      { 
        showModal && 
        <ClientModal
         onClose={closeModal} 
         type={clientModalType} 
         client={currentClient} 
         refreshClients={refreshClients}
        /> 
      }
    </div>
  )
}
