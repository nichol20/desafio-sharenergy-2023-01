
import { useState } from 'react'
import { checkmarkIcon, closeIcon, pencilIcon, personIcon, trashIcon } from '../../assets'
import { Client } from '../../types/user'
import { AccessTokenCookieController } from '../../utils/cookies'
import { http } from '../../utils/http'
import { ConfirmationModal } from '../ConfirmationModal'
import styles from './style.module.scss'

interface ClientModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  client: Client | Omit<Client, "id" | "created_at">
  type: 'edit' | 'create'
  refreshClients: () => Promise<void>
}


export const ClientModal = ({ setShowModal, type, client, refreshClients }: ClientModalProps) => {
  const changeIcon = type === 'edit' ? pencilIcon : checkmarkIcon
  const [ newClient, setNewClient ] = useState(client)
  const [ askConfirmationToDelete, setAskConfirmationToDelete ] = useState(false)

  const closeModal = () => {
    const clientModalEl = document.querySelector(`.${styles.client_modal}`)
    clientModalEl?.classList.remove(styles.active)
    setTimeout(() => {
      setShowModal(false)
    }, 100)
  }

  const createClient = async () => {
    try {
      const { data } = await http.post('/clients', {
        ...newClient
      }, {
        headers: {
          Authorization: `Bearer ${AccessTokenCookieController.get()}`
        }
      })
      await refreshClients()
      closeModal()
    } catch (error) {
      console.log(error)
    }
  }

  const updateClient = async () => {
    try {
      const { data } = await http.patch(`/clients/${(client as Client).id}`, { 
        ...newClient
      }, {
        headers: {
          Authorization: `Bearer ${AccessTokenCookieController.get()}`
        }
      })
      console.log(newClient)
      await refreshClients()
      closeModal()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteClient = async () => {
    try {
      await http.delete(`/clients/${(client as Client).id}`, {
        headers: {
          Authorization: `Bearer ${AccessTokenCookieController.get()}`
        }
      })
      await refreshClients()
      closeModal()
    } catch (error) {
      
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
    else closeModal()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(type === "create") return await createClient()
    
    await updateClient()
  }

  return (
    <div className={styles.client_modal}>
      <div className={styles.responsive_box_relative}>
        <div className={styles.responsive_box_absolute}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <button className={styles.close_button} onClick={closeModal} type="button">
              <img src={closeIcon} alt="close" />
            </button>
            <div className={styles.img_box}>
              <img src={personIcon} alt="person" />
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
                <img src={changeIcon} alt="pencil" />
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

      { askConfirmationToDelete && 
      <ConfirmationModal
       onCancel={() => setAskConfirmationToDelete(false)} 
       onDelete={deleteClient}
       message="tem certeza de que deseja deletar?"
      />}
    </div>
  )
}