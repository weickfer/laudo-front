import { AnnotationForm } from "./annotation-form";
import { Modal } from "./modal";

/**
 * @deprecated
 */
export function ReadAnnotationModal({ isOpen, onClose, annotation, project, onView }) {
  return (
    <Modal isOpen={isOpen} title="Formulário (Somente Leitura)" className="z-40">
      <AnnotationForm fields={annotation} onClose={onClose} project={project.data} onViewAttachment={onView} />
    </Modal>
  );
}
