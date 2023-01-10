import { useRef } from 'react'
import { addIcon, closeIcon, pencilIcon, personIcon, trashIcon } from '../../assets'
import styles from './style.module.scss'

export const ClientsRegistrationPage = () => {
  const editModalRef = useRef<HTMLDivElement>(null)

  const closeModal = () => {
    if(editModalRef.current === null) return
    editModalRef.current.classList.remove(styles.active)
  }

  const openModal = () => {
    if(editModalRef.current === null) return
    editModalRef.current.classList.add(styles.active)
  }

  const addClient = () => {

  }

  return (
    <div className={styles.client_registration}>
      <div className={styles.list_container}>
        <div className={styles.client_card} onClick={openModal}>
          <div className={styles.img_box}>
            <img src={personIcon} alt="person" />
          </div>
          <div className={styles.profile}>
            <h4 className={styles.name}>João</h4>
            <span className={styles.email}>Joaodsadasdsadasdasdasdasdasdsadsa@gmail.com</span>
          </div>
        </div>
      </div>
      <button className={styles.add_button}>
        <img src={addIcon} alt='add' />
      </button>
      <div className={styles.edit_modal} ref={editModalRef} >
        <form className={styles.form}>
          <button className={styles.close_button} onClick={closeModal} type="button">
            <img src={closeIcon} alt="close" />
          </button>
          <div className={styles.img_box}>
            <img src={personIcon} alt="person" />
          </div>
          <div className={styles.field}>
            <h5 className={styles.title}>Name</h5>
            <input type="text" name='name' defaultValue="João" />
          </div>
          <div className={styles.field}>
            <h5 className={styles.title}>Email</h5>
            <input type="text" name='email' defaultValue="Joao@gmail.com" />
          </div>
          <div className={styles.field}>
            <h5 className={styles.title}>Telefone</h5>
            <input type="text" name='telefone' defaultValue="(88) 99923-4231" />
          </div>
          <div className={styles.field}>
            <h5 className={styles.title}>Endereço</h5>
            <input type="text" name='endereço' defaultValue="Rua dos feijoes, bairro limoeiro" />
          </div>
          <div className={styles.field}>
            <h5 className={styles.title}>Cpf</h5>
            <input type="text" name='cpf' defaultValue="123.456.789-90" />
          </div>
          <div className={styles.options}>
            <button className={`${styles.edit} ${styles.button}`} type="submit">
              <img src={pencilIcon} alt="pencil" />
            </button>
            <button className={`${styles.delete} ${styles.button}`} type="button">
              <img src={trashIcon} alt="trashs" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
