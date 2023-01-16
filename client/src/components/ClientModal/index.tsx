import { useContext, useEffect, useRef, useState } from 'react'

import { Client } from '../../types/user'
import { ConfirmationModal, IconsPicker, ToastContainer } from '../'
import { ToastRef } from '../ToastContainer'

import { checkmarkIcon, closeIcon, pencilIcon, personIcon, trashIcon } from '../../assets'
import styles from './style.module.scss'
import { ThemeContext } from '../../contexts/ThemeContext'
import { useHttpPrivate } from '../../hooks/useHttpPrivate'

interface ClientModalProps {
  onClose: () => void
  client: Client | Omit<Client, "id" | "created_at">
  type: 'edit' | 'create'
  refreshClients: () => Promise<void>
}

export const ClientModal = ({ onClose, type, client, refreshClients }: ClientModalProps) => {
  const { theme } = useContext(ThemeContext)
  const httpPrivate = useHttpPrivate()

  const submitIcon = type === 'edit' ? pencilIcon : checkmarkIcon
  const [ newClient, setNewClient ] = useState(client)
  const [ askConfirmationToDelete, setAskConfirmationToDelete ] = useState(false)
  const [ icons, setIcons ] = useState<string[]>([])
  const [ showIconsPicker, setShowIconsPicker ] = useState(false)
  const [ currentIcon, setCurrentIcon ] = useState<string>(client.icon || personIcon)
  const toastRef = useRef<ToastRef>(null)

  const createClient = async () => {
    try {
       await httpPrivate.post('/clients', {
        ...newClient,
        icon: currentIcon === personIcon ? '' : currentIcon
      })
      await refreshClients()
      onClose()
    } catch (error) {
      toastRef.current?.toast('falha ao criar cliente', 'Falha na criação', 'error')
    }
  }

  const updateClient = async () => {
    try {
      await httpPrivate.patch(`/clients/${(client as Client).id}`, { 
        ...newClient,
        icon: currentIcon === personIcon ? '' : currentIcon
      })
      await refreshClients()
      onClose()
    } catch (error) {
      toastRef.current?.toast('falha ao atualizar cliente', 'Falha na atualização', 'error')
    }
  }

  const deleteClient = async () => {
    try {
      await httpPrivate.delete(`/clients/${(client as Client).id}`)
      await refreshClients()
      onClose()
    } catch (error) {
      toastRef.current?.toast('falha ao remover cliente', 'falha na remoção', 'error')
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewClient(prevState => {
      let newState = {
        ...prevState,
        [event.target.name]: event.target.value
      }

      return newState
    })
  }

  const handleDeleteButtonClick = () => {
    if(type === 'edit') setAskConfirmationToDelete(true)
    else onClose()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(type === "create") return await createClient()
    
    await updateClient()
  }

  const openIconsPicker = () => {
    setShowIconsPicker(true)
  }

  const closeIconsPicker = () => {
    setShowIconsPicker(false)
  }

  const changeIcon = (index: number) => {
    setCurrentIcon(icons[index])
    closeIconsPicker()
  }

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const { data } = await httpPrivate.get('/images/client-icons')
        
        setIcons([personIcon, ...data.urls])
      } catch (error) {
        if(icons.length === 0) {
          toastRef.current?.toast('Não foi possível buscar os ícones', 'Erro na busca', 'error')
        }
      }
    }

    fetchIcons()
  }, [])

  return (
    <div className={styles.client_modal} data-theme={theme} >
      <div className={styles.responsive_box_relative}>
        <div className={styles.responsive_box_absolute}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <button className={styles.close_button} onClick={onClose} type="button">
              <img src={closeIcon} alt="close" />
            </button>
            <div className={styles.person_icon_box}>
              <img
               src={currentIcon} 
               alt="person" 
               className={styles.person_icon} 
              />
              <button
               className={styles.change_person_icon_button} 
               type="button"
               onClick={openIconsPicker}
              >
                <img src={pencilIcon} alt="pencil" className={styles.pencil_icon} />
              </button>
            </div>
            <div className={styles.field}>
              <h5 className={styles.title}>Nome</h5>
              <input
               type="text" 
               name='name' 
               defaultValue={client?.name}
               onChange={handleInputChange}  
              />
            </div>
            <div className={styles.field}>
              <h5 className={styles.title}>Email</h5>
              <input
               type="text" 
               name='email' 
               defaultValue={client?.email} 
               onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <h5 className={styles.title}>Telefone</h5>
              <input
               type="text" 
               name='phone' 
               defaultValue={client?.phone} 
               onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <h5 className={styles.title}>Endereço</h5>
              <input
               type="text" 
               name='address' 
               defaultValue={client?.address} 
               onChange={handleInputChange}
              />
            </div>
            <div className={styles.field}>
              <h5 className={styles.title}>Cpf</h5>
              <input
               type="text" 
               name='cpf' 
               defaultValue={client?.cpf} 
               onChange={handleInputChange}
              />
            </div>
            <div className={styles.options}>
              <button className={`${styles.edit} ${styles.button}`} type="submit">
                <img src={submitIcon} alt="pencil" />
              </button>
              <button
               className={`${styles.delete} ${styles.button}`} 
               type="button"
               onClick={handleDeleteButtonClick}
              >
                <img src={trashIcon} alt="trash" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {showIconsPicker && 
      <IconsPicker
       icons={icons} 
       onClose={closeIconsPicker} 
       onIconClick={changeIcon} 
      />}

      { askConfirmationToDelete && 
      <ConfirmationModal
       onCancel={() => setAskConfirmationToDelete(false)} 
       onDelete={deleteClient}
       message="tem certeza de que deseja deletar?"
      />}

      <ToastContainer ref={toastRef} />
    </div>
  )
}
