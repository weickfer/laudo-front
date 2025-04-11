import React, { useState } from "react"
import { Button } from "./ui/button"
// import { EvidenceForm } from "./ev"
import { Plus } from "lucide-react"
import { ImageEditorWithTools } from "../modules/annotations/components/image-editor/modal"
import { useAnnotations } from "../modules/annotations/contexts/annotations"
import { EvidenceForm } from "./evidence-form"
import { columns } from "./evidence-table/columns"
import { DataTable } from "./evidence-table/data-table"

export function EvidenceStep({ formData, updateFormData }) {
  const [evidenceList, setEvidenceList] = useState(formData.evidence ?? [])
  const [showForm, setShowForm] = useState(false)
  const { currentAttachment, updateAttachment } = useAnnotations()

  const handleAddEvidence = ({ formData }) => {
    setEvidenceList(state => [...state, formData])
    updateFormData({ evidence: formData })
    setShowForm(false)
    // const updated = [...evidenceList, newEvidence]
    // setEvidenceList(updated)
    // updateFormData({ evidence: updated })
    // setShowForm(false)
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
          <EvidenceForm onSave={handleAddEvidence} onClose={() => setShowForm(false)} />
        </div>
      )}

      {currentAttachment?.url && (
          <ImageEditorWithTools
          imageUrl={currentAttachment?.url}
          onSave={updateAttachment}
          vectors={currentAttachment?.vectors}
        />
      )}

      <DataTable data={evidenceList} columns={columns} />
    </div>
  )
}
