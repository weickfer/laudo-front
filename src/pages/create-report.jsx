import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReportWizard from "../components/report-wizard";
import { api } from "../services/api";

export function CreateReport() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] = useState(null)

  const loadData = async () => {
    const data = await api(`/api/v2/relatorios/${id}`)

    const evidencias = data.evidencias.map(evidence => {
      const arquivos = evidence.arquivos
      const files = []

      arquivos.forEach(arquivo => {
        const name = arquivo.nome
        files.push({
          name: name,
          vectors: arquivo.vetores || [],
          url: arquivo.url,
          id: arquivo.id,
        })
      })

      return {
        id: evidence.id,
        environment: evidence.ambiente,
        location: evidence.local,
        description: evidence.descricao,
        date: evidence.date?.split('T')[0],
        attachments: files,
      }
    })

    const infraestruturas = data.infraestruturas.map(infraestrutura => {
      return infraestrutura.tipo
    })

    const servicosComunitarios = data.servicosComunitarios.map(servicoComunitario => {
      return servicoComunitario.tipo
    })

    setData({
      ...data,
      evidencias,
      infraestruturas,
      servicosComunitarios,
    })
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleSubmit = async (formData) => {
    navigate(`/reports/${formData?.id}/view`)
  }

  if (!data) {
    return <div>Carregando...</div>
  }

  return (
    <ReportWizard onSubmit={handleSubmit} initialData={data} />
  )
}
