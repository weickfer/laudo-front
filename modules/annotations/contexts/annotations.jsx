import { createContext, useContext } from 'react'
import { useAttachments } from '../hooks/use-attachments'
import { useRegisterFunction } from '../hooks/use-function'

const AnnotationsContext = createContext()

export function AnnotationsProvider({ children }) {
  const registerScreenshotFunction = useRegisterFunction()

  const { addAttachment, attachments, clear, currentAttachment, deselectAttachment, removeAttachment, selectAttachment, updateAttachment, watched } = useAttachments()

  // const selectAttachment = (attachment) => {
  //   setCurrentAttachment(attachment)
  // }

  // const deselectAttachment = () => {
  //   setCurrentAttachment(null)
  // }

  // const addAttachment = ({ id, url, vectors }) => {
  //   addItem({ id, url, vectors })
  // }

  // const updateAttachment = (vectors) => {
  //   updateItem(currentAttachment, {
  //     ...currentAttachment,
  //     vectors,
  //   })
  //   setCurrentAttachment(null)
  // }

  // const removeAttachment = (attachment) => {
  //   removeItem(attachment)
  // }


  return (
    <AnnotationsContext.Provider value={{
      registerScreenshotFunction, 
      attachments,
      watched,
      addAttachment, 
      updateAttachment,
      removeAttachment,
      selectAttachment,
      currentAttachment, 
      deselectAttachment,
      clear,
    }}>
      {children}
    </AnnotationsContext.Provider>
  )
}

export const useAnnotations = () => {
  const context = useContext(AnnotationsContext)

  return context
} 