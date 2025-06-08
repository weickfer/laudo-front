import { ImageEditor as ImageEditorCore } from ".";
import { SidebarProvider } from "../../contexts/sidebar";
import { Modal } from "../modal";
import { Sidebar } from "./sidebar";

export function ImageEditorWithTools({ imageUrl, vectors, onSave, sidebarEnabled = true, onCancel }) {
  return (
    <SidebarProvider>
      <div className="flex flex-row">
        {
          sidebarEnabled && (
            <div className="flex flex-col">
              <Sidebar />
            </div>
          )
        }
        <div className="mx-auto">
          <ImageEditorCore url={imageUrl} cachedVectors={vectors} onSubmit={onSave} onCancel={onCancel} />
        </div>
      </div>
    </SidebarProvider>
  )
}

export function ImageEditorModal({ modalIsOpen, onClose, imageUrl, vectors = [], onSave, sidebarEnabled = true }) {
  return (
    <Modal
      title="Editar marcação"
      isOpen={modalIsOpen}
      onClose={onClose}
    >
      <ImageEditorWithTools sidebarEnabled={sidebarEnabled} imageUrl={imageUrl} vectors={vectors} onSave={onSave} /> 
    </Modal>
  )
}

export function ImageViewer({ onClose, attachment }) {
  const imageUrl = attachment?.url
  const cachedVectors = attachment?.vectors ?? []
  
  return (
    <SidebarProvider>
      <div className="mx-auto p-2">
        <ImageEditorCore url={imageUrl} cachedVectors={cachedVectors} />
      </div>
      <button
        onClick={onClose}
        className="mt-2 w-full bg-gray-100 border border-gray-200 text-gray-700 p-2 rounded-lg"
      >
        Fechar
      </button>
    </SidebarProvider>
  )
}

export function ImageViewerModal({ modalIsOpen, onClose, attachment }) {
  return (
    <Modal
      title="Visualizar marcação"
      isOpen={modalIsOpen}
    >
      <ImageViewer attachment={attachment} onClose={onClose} />
    </Modal>
  )
}