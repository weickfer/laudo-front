import { useState } from "react";
import { Modal } from "./modal";

import { AnnotationForm } from "./annotation-form";

export function AnnotationModal({ isOpen, onClose, onSave, tempV2 = false, onCreateGroup, project }) {
  const [hide, setHide] = useState(false)

  return (
    <Modal isOpen={isOpen} title="Formulário" className={
      `z-40 ${hide && "hidden"} h-screen`
    }>
      <AnnotationForm 
        onClose={onClose} 
        onSave={onSave} 
        onScreenshotStart={() => setHide(true)} 
        onScreenshotEnd={() => setHide(false)}
        onCreateGroup={onCreateGroup}
        project={project}
      />
    </Modal>
  )
}