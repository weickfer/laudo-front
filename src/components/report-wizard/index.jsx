import { Check, ChevronLeft, ChevronRight, FileText, ImageIcon, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

import { useToast } from "../../hooks/use-toast"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { EvidenceStep } from "./evidence-step"
import { LocalizationStep } from "./localization-step"

import { useParams, useSearchParams } from "react-router"
import { api } from "../../services/api"
import { ConclusionStep } from "./conclusion-step"
import { InspectionForm } from "./details-step"

export default function ReportWizard({ initialData, onSubmit }) {
  const { toast } = useToast()
  const { id: reportId } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState(initialData ?? {
    id: reportId,
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
    { name: "Conclusão", icon: ImageIcon, component: ConclusionStep },
  ]

  useEffect(() => {
    if (searchParams.get("step") && currentStep !== parseInt(searchParams.get("step"))) {
      setCurrentStep(parseInt(searchParams.get("step")))
    }
  }, [])

  const CurrentStepComponent = steps[currentStep].component

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const goToNextStep = async () => {
    if (!(currentStep < steps.length - 1)) return

    const nextStep = currentStep + 1
    setCurrentStep(nextStep)

    if(nextStep === 2) {
      const inspectionData = {
        idImovel: formData.idImovel,
        acompanhante: formData.acompanhante,
        perito: formData.perito,
        proprietario: formData.proprietario,
        endereco: formData.endereco,
        estadoOcupacao: formData.estadoOcupacao,
        usoPredominante: formData.usoPredominante,
        infraestruturas: formData.infraestruturas,
        servicosComunitarios: formData.servicosComunitarios,
        dimensoes: formData.dimensoes,
        forma: formData.forma,
        area: formData.area,
        fracaoIdeal: formData.fracaoIdeal,
        estadoConservacao: formData.estadoConservacao,
        idadeReal: formData.idadeReal,
        idadeAparente: formData.idadeAparente,
        padraoConstrucao: formData.padraoConstrucao,
        fundacoes: formData.fundacoes,
        estrutura: formData.estrutura,
        fechamento: formData.fechamento,
        cobertura: formData.cobertura,
      }

      const response = await api(`/api/v2/relatorios/${reportId}`, 'PATCH', inspectionData)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await onSubmit(formData)
    } catch (error) {
      console.log(error)
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao processar seu relatório. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
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
                      setCurrentStep(index)
                      // if (index <= currentStep) {
                      // }
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
                <Button onClick={handleSubmit}>Ir para o relatório</Button>
              )}
            </div>
          </Card>
        </main>
      </div>
  )
}
