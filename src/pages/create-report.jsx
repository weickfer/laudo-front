import { useNavigate } from "react-router";
import ReportWizard from "../components/report-wizard";
import { toast } from "../hooks/use-toast";
import { dataURLtoFile } from "../lib/base64-to-file";
import { api } from "../services/api";

export function CreateReport() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    const { pdf, locationsImage, ...formDataWithoutPdf } = formData
      const images = {}

      if(pdf) {
        images[pdf.name] = pdf
      }

      const geolocations = formData.geolocations.map(location => {
        const file = dataURLtoFile(location.url, location.id)
        images[file.name] = file

        return {
          coords: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          imagemNome: file.name,
        }
      })

      const evidencias = formData.evidencias.map(evidence => {
        const attachments = evidence.attachments
        const files = []

        attachments.forEach(attachment => {
          const file = dataURLtoFile(attachment.url, attachment.id)
          images[file.name] = file
          files.push({
            nome: file.name,
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

      const response = await api('/api/relatorios', 'POST', requestBody)

      // const response = await fetch('http://localhost:3000/api/relatorios', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody),
      // })

      // if (!response.ok) {
      //   throw new Error(response.message || 'Erro ao criar relatório')
      // }

      const data = response
      const signedUrls = data.signedUrls

      toast({
        title: "Relatório criado com sucesso!",
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
        description: "Seu relatório foi criado e todas os arquivos foram enviados com sucesso.",
        variant: "success",
      })

      navigate(`/reports/${data?.relatorioId}/view`)
  }

  return (
    <ReportWizard onSubmit={handleSubmit} />
  )
}
