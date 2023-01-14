import { v4 as uuidv4 } from 'uuid';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styles from './style.module.scss'

type ToastFunction = (message: string, title: string, status: 'success' | 'error') => void

interface ToastData {
  title: string
  message: string
  status: 'success' | 'error'
  id: string
}

export interface ToastRef {
  toast: ToastFunction
}

export const ToastContainer = forwardRef<ToastRef>((props, ref) => {
  const [ list, setList ] = useState<ToastData[]>([])
  
  const toast: ToastFunction = (message, title, status) => {
    const id = 'toast-' + uuidv4()
    setList([...list, { message, status, id , title }])
    
    requestAnimationFrame(() => {
      const toastEl = document.getElementById(id)
      toastEl?.classList.add(styles.active)
    })

    setTimeout(() => {
      deleteToast(id)
    }, 4000)
  }

  useImperativeHandle(ref, () => ({
    toast
  }))

  const deleteToast = (id: string) => {
    const toastEl = document.getElementById(id)
    toastEl?.classList.remove(styles.active)
    setTimeout(() => {
      toastEl?.remove()
    }, 300)
  }


  return (
    <div className={styles.toast_container} >
      {
        list.map((t, index) => (
          <div
           id={t.id}
           className={styles.toast} 
           data-status={t.status} 
           onClick={() => deleteToast(t.id)}
           key={index}
          >
            <div className={styles.description}>
              <h5>{t.title}</h5>
              <span>{t.message}</span>
            </div>
          </div>
        ))
      }
    </div>
  )
})
