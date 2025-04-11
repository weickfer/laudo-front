import { Check, ChevronLeft, ChevronRight, FileText, ImageIcon, MapPin } from "lucide-react"
import { useState } from "react"

import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"

import { AnnotationsProvider } from "../../modules/annotations/contexts/annotations"
import { InspectionForm } from "../components/details-step"
import { EvidenceStep } from "../components/evidence-step"
import { LocalizationStep } from "../components/localization-step"

export default function ReportManager() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

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

  const handleSubmit = () => {
    console.log("Report submitted:", formData)
    alert("Report submitted successfully!")
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
                <Button onClick={handleSubmit}>Submit Report</Button>
              )}
            </div>
          </Card>
        </main>
      </div>
    </AnnotationsProvider>

  )
}
