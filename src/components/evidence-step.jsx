import React, { useState } from "react"
import { Button } from "./ui/button"
// import { EvidenceForm } from "./ev"
import { Plus } from "lucide-react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { ImageEditorWithTools } from "../modules/annotations/components/image-editor/modal"
import { useAnnotations } from "../modules/annotations/contexts/annotations"
import { api } from "../services/api"
import { EvidenceForm } from "./evidence-form"
import { DataTable } from "./tables/data-table"
import { columns } from "./tables/evidence-columns"

export function EvidenceStep({ formData, updateFormData }) {
  const { id: reportId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  // const evidenceId = searchParams.get('evidenciaId')
  const [evidenceList, setEvidenceList] = useState(formData.evidencias ?? [])
  const [showForm, setShowForm] = useState(false)
  const { currentAttachment, updateAttachment, addAttachment } = useAnnotations()
  const [selectedEvidence, setSelectedEvidence] = useState(null)

  const handleAddEvidence = async ({ formData: evidenceData, type }) => {
    const response = await api(`/api/v2/evidencias/${evidenceData.id}`, 'PATCH', {
      environment: evidenceData.environment,
      date: evidenceData.date,
      description: evidenceData.description,
      location: evidenceData.location,
      attachments: evidenceData?.attachments?.map(attachment => ({
        id: attachment.id,
        vectors: attachment.vectors
      }))
    })

    if(!response) return

    searchParams.delete('evidenciaId')
    setSearchParams(searchParams)

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
    searchParams.delete('evidenciaId')
    setSearchParams(searchParams)
    setShowForm(false)
    setSelectedEvidence(null)
  }

  const handleSelectEvidenceForm = (evidence) => {
    searchParams.set('evidenciaId', evidence?.id)
    setSearchParams(searchParams)
    addAttachment(evidence?.attachments ?? [])
    setShowForm(true)
    setSelectedEvidence(evidence)
  }

  const handleToggleEvidenceForm = async () => {
    const newShowForm = !showForm
    setShowForm(newShowForm)

    if(newShowForm === false) return

    const response = await api('/api/v2/evidencias', 'POST', {
      relatorioId: reportId
    })

    if(response?.evidenciaId) {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set('evidenciaId', response.evidenciaId)

      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Evidências</h2>
        <p className="text-sm text-muted-foreground">
          Anexe ou descreva as evidências da vistoria.
        </p>
      </div>

      <Button onClick={handleToggleEvidenceForm} variant="outline">
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
