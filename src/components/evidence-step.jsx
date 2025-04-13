import React, { useState } from "react"
import { Button } from "./ui/button"
// import { EvidenceForm } from "./ev"
import { Plus } from "lucide-react"
import { ImageEditorWithTools } from "../modules/annotations/components/image-editor/modal"
import { useAnnotations } from "../modules/annotations/contexts/annotations"
import { EvidenceForm } from "./evidence-form"
import { DataTable } from "./tables/data-table"
import { columns } from "./tables/evidence-columns"

export function EvidenceStep({ formData, updateFormData }) {
  const [evidenceList, setEvidenceList] = useState(formData.evidencias ?? [])
  const [showForm, setShowForm] = useState(false)
  const { currentAttachment, updateAttachment, addAttachment } = useAnnotations()
  const [selectedEvidence, setSelectedEvidence] = useState(null)

  const handleAddEvidence = ({ formData: evidenceData, type }) => {
    const actions = {
      create: () => [...evidenceList, {
        ...evidenceData,
        id: evidenceData.id ?? `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }],
      update: () => evidenceList.map(
        item => item.id === evidenceData.id ? evidenceData : item
      )
    }
    const data = actions[type]()

    setEvidenceList(data)
    updateFormData({ evidencias: data })
    setShowForm(false)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedEvidence(null)
  }

  const handleSelectEvidenceForm = (evidence) => {
    addAttachment(evidence?.attachments ?? [])
    setShowForm(true)
    setSelectedEvidence(evidence)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Evidências</h2>
        <p className="text-sm text-muted-foreground">
          Anexe ou descreva as evidências da vistoria.
        </p>
      </div>

      <Button onClick={() => setShowForm((prev) => !prev)} variant="outline">
        <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancelar" : "Adicionar Evidência"}
      </Button>

      {showForm && (
        <div className={currentAttachment?.url && 'hidden'}>
          <EvidenceForm onSave={handleAddEvidence} onClose={handleCloseForm} fields={selectedEvidence} />
        </div>
      )}

      {currentAttachment?.url && (
        <ImageEditorWithTools
          imageUrl={currentAttachment?.url}
          onSave={updateAttachment}
          vectors={currentAttachment?.vectors}
        />
      )}

      <DataTable data={evidenceList} columns={columns} onSelect={handleSelectEvidenceForm} />
    </div>
  )
}
