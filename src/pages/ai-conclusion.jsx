import { Images } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { api } from "../services/api"

// Dados do Relatório
const reportData = {
  // Data e Identificação
  date: "6 de Maio de 2025",
  reportId: "AI-RPT-2025-0042",

  // Modelo de IA
  aiModel: "QWEN-VL-PLUS",

  // Dados de Entrada
  inputData: {
    imageCount: 32,
    imageFormat: "JPG",
    imageType: "Fotos da Inspeção"
  },

  // Conclusão
  conclusion: {
    note: "Esta é uma avaliação gerada por IA baseada em evidências fotográficas. Recomenda-se uma inspeção profissional no local para confirmar estas conclusões."
  }
}

export function LoadingScreen() {
  return (
    <div className="h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-5xl h-full flex items-center justify-center mx-auto bg-white shadow-md">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600">Carregando relatório...</p>
        </div>
      </div>
    </div>
  )
}

export function PendingReportScreen() {
  return (
    <div className="h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-5xl h-full flex items-center justify-center mx-auto bg-white shadow-md">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-800">Estamos quase lá!</p>
          <p className="text-sm text-gray-600">Ainda estamos coletando informações para gerar o relatório. Ele estará pronto em instantes.</p>
        </div>
      </div>
    </div>
  )
}

export function AIGeneratedConclusion() {
  const { id } = useParams()
  const [conclusion, setConclusion] = useState(null)

  useEffect(() => {
    api(`/api/v2/relatorios/${id}/ai-conclusao`, 'POST').then(response => {
      if(response?.id) {
        setConclusion(response)
      }
    })
  }, [id])

  if(!conclusion) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Cabeçalho - Simplificado */}
        <div className="border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-md">
              <span className="text-blue-600 font-bold text-xs">IA</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Conclusão Gerada por IA</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {conclusion?.iaVersion}
                </Badge>
                <span className="text-xs text-gray-500">{new Date(conclusion.criadoEm).toDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-4">
          {/* Resumo dos Dados de Entrada - Mais Conciso */}
          <section className="animate-fade-in">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Dados de Entrada</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <Images className="h-4 w-4 text-amber-300" />
                  </div>
                  <div>
                    {/* <p className="font-medium text-sm">{reportData.inputData.imageType}</p> */}
                    <p className="text-xs text-gray-500">{conclusion?.numeroDeFotosUtilizadas} imagens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Conclusão - Focada */}
          <section className="animate-fade-in">
            <h2 className="text-sm font-medium text-gray-700 mb-2">Conclusão</h2>
            <Card>
              <CardContent className="p-3">
                <div className="space-y-3">
                  {conclusion?.conclusao}
                  <div className="text-xs text-gray-500 italic">
                  Esta é uma avaliação gerada por IA baseada em evidências fotográficas. Recomenda-se uma inspeção profissional no local para confirmar estas conclusões.
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="border-t p-3 flex justify-between items-center bg-gray-50">
          <div className="text-xs text-gray-500">ID do Relatório: {reportData.reportId}</div>
          <Link to={
            `/reports/${id}/view`
          }>
            <Button variant="default" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
              Voltar ao relatório
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
