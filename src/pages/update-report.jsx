import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ReportWizard from "../components/report-wizard";
import { toast } from "../hooks/use-toast";
import { dataURLtoFile } from "../lib/base64-to-file";
import { api } from "../services/api";
export function UpdateReport() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [data, setData] = useState(null)

  const loadData = async () => {
    const data = await api(`/api/relatorios/${id}`)

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
    const { pdf, locationsImage, ...formDataWithoutPdf } = formData
      const images = {}

      if(pdf) {
        images[pdf.name] = pdf
      }

      const geolocations = formData.geolocations.map(location => {
        let file = null;
        try {
          file = dataURLtoFile(location.url, location.id)
          images[file.name] = file
        } catch (error) {
          // console.log('Erro ao converter imagem', error)
        }

        return {
          coords: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          imagemNome: file?.name ?? location.url.split('/').pop(),
        }
      })

      const evidencias = formData.evidencias.map(evidence => {
        const attachments = evidence.attachments
        const files = []

        attachments.forEach(attachment => {
          let file = null;
          try {
            file = dataURLtoFile(attachment.url, attachment.id)
            images[file.name] = file
          } catch (error) {
            // console.log('Erro ao converter imagem', error)
          }

          files.push({
            nome: file?.name ?? attachment.url.split('/').pop(),
            vetores: attachment.vectors || [],
          })
        })

        return {
          descricao: evidence.description,
          ambiente: evidence.environment,
          local: evidence.location,
          date: evidence.date,
          arquivos: files,
        }
      })

      const requestBody = {
        ...formDataWithoutPdf,
        geolocations,
        evidencias,
      }

      toast({
        title: "Enviando relatório...",
        description: "Por favor, aguarde enquanto processamos seu relatório.",
      })

      // const response = await fetch(`http://localhost:3000/api/relatorios/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //      'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody),
      // })
      const data = await api(`/api/relatorios/${id}`, 'PUT', requestBody)

      if (!data) {
        throw new Error('Erro ao atualizar relatório')
      }

      const signedUrls = data.signedUrls

      toast({
        title: "Relatório atualizado com sucesso!",
        description: "Agora vamos fazer upload das imagens...",
      })
      
      const uploadImages = async () => {
        const uploadPromises = Object.entries(images).map(async ([key, file]) => {
          const signedUrl = signedUrls[key]
          await fetch(signedUrl, {
            method: 'PUT',
            body: file,
          })
        })
        await Promise.all(uploadPromises)
      }
      await uploadImages()

      toast({
        title: "Upload concluído!",
        description: "Seu relatório foi atualizado e todas os arquivos foram enviados com sucesso.",
        variant: "success",
      })

      navigate(`/reports/${data?.relatorioId}/view`)
  }

  if(!data) {
    return <div>Carregando...</div>
  }

  return (
    <ReportWizard onSubmit={handleSubmit} initialData={data} />
  )
}
