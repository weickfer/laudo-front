import { Check, ChevronLeft, ChevronRight, FileText, ImageIcon, MapPin } from "lucide-react"
import { useState } from "react"

import { InspectionForm } from "../components/details-step"
import { EvidenceStep } from "../components/evidence-step"
import { LocalizationStep } from "../components/localization-step"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useToast } from "../hooks/use-toast"
import { dataURLtoFile } from "../lib/base64-to-file"
import { AnnotationsProvider } from "../modules/annotations/contexts/annotations"
import { api } from "../services/api"

export default function ReportManager() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    acompanhante: "",
    area: "",
    cobertura: "",
    dimensoes: "",
    endereco: "",
    estadoConservacao: "",
    estadoOcupacao: "",
    estrutura: "",
    evidencias: [],
    fechamento: "",
    forma: "",
    fracaoIdeal: "",
    fundacoes: "",
    geolocations: [],
    idImovel: "",
    idadeAparente: "",
    idadeReal: "",
    infraestruturaUrbana: [],
    locationsImage: [],
    padraoConstrucao: "",
    pdfNome: "",
    proprietario: "",
    servicosComunitarios: [],
    tipoImovel: "",
    usoImovel: "",
    usoPredominante: ""
  })

  const steps = [
    { name: "Localização", icon: MapPin, component: LocalizationStep },
    { name: "Características Gerais", icon: FileText, component: InspectionForm },
    { name: "Evidências", icon: ImageIcon, component: EvidenceStep },
  ]

  const CurrentStepComponent = steps[currentStep].component

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const { pdf, locationsImage, ...formDataWithoutPdf } = formData
      const images = {}

      if(pdf) {
        images[pdf.name] = pdf
      }

      const geolocations = formData.geolocations.map(location => {
        const file = dataURLtoFile(location.imageUrl, location.id)
        images[file.name] = file

        return {
          coords: location.coords,
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

      // const response = await fetch('http://localhost:3000/api/relatorios', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestBody),
      // })
      const response = await api('/api/relatorios', 'POST', requestBody)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao criar relatório')
      }

      const data = await response.json()
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

    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Erro ao criar relatório",
        description: error.message || "Ocorreu um erro ao processar seu relatório. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AnnotationsProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full border-r bg-muted/40 md:w-64">
          <div className="flex flex-col p-4 md:p-6">
            <h2 className="mb-6 text-xl font-semibold">Criar relatório</h2>
            <nav className="space-y-1">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <button
                    key={step.name}
                    className={`flex w-full items-center space-x-3 rounded-md px-3 py-2 text-left text-sm ${
                      currentStep === index
                        ? "bg-primary text-primary-foreground"
                        : currentStep > index
                          ? "text-muted-foreground"
                          : "text-foreground/60"
                    }`}
                    onClick={() => {
                      if (index <= currentStep) {
                        setCurrentStep(index)
                      }
                    }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border">
                      {currentStep > index ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    </div>
                    <span>{step.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-2 md:p-4">
          <Card className="p-2 md:p-4">
            <h1 className="mb-6 text-2xl font-bold">{steps[currentStep].name}</h1>
            <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={goToNextStep}>
                  Proximo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Enviar Relatório</Button>
              )}
            </div>
          </Card>
        </main>
      </div>
    </AnnotationsProvider>
  )
}
