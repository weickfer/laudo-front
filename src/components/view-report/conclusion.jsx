import { FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router";
import { api } from "../../services/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

const markdownComponents = {
  h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
  h2: ({node, ...props}) => <h2 className="text-xl font-semibold my-3" {...props} />,
  h3: ({node, ...props}) => <h2 className="text-2xl font-semibold my-3" {...props} />,
  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
  ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
  ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
  li: ({node, ...props}) => <li className="mb-1" {...props} />,
  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
  em: ({node, ...props}) => <em className="italic" {...props} />,
};

export function Conclusion({ data }) {
  const [conclusion, setConclusion] = useState(data?.conclusao ?? null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateConclusion = async () => {
    setIsGenerating(true)

    const response = await api(`/api/v2/relatorios/${id}/ai-conclusao`, 'POST')

    if (response?.id) {
      setConclusion(response)
    }

    setIsGenerating(false)
  }
  const { id } = useParams()

  // useEffect(() => {
  //   api(`/api/v2/relatorios/${id}/ai-conclusao`, 'POST').then(response => {
  //     if (response?.id) {
  //       setConclusion(response)
  //     }
  //   })
  // }, [id])

  return (
    <section id="evidencias" className="mb-8">
      <h2 className="text-xl font-semibold text-blue-900 mb-4">Conclusão</h2>

      {
        conclusion ? (
          <Card className="p-2 max-w-full overflow-hidden">
            <div className="flex flex-row gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Gerado por IA</Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">{conclusion?.iaVersion}</Badge>

              <span className="text-xs text-gray-500">{
                new Date(conclusion?.criadoEm).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }</span>
            </div>
            <div className="max-w-[600px] overflow-x-auto break-words">
              <Markdown components={markdownComponents}>
                {conclusion.conclusao}
              </Markdown>
            </div>
            

            <span className="text-xs italic text-gray-500">
              Esta é uma avaliação gerada por IA baseada em evidências fotográficas. Recomenda-se uma inspeção profissional no local para confirmar estas conclusões.
            </span>
          </Card>
        ) : (
          <Card className="border-gray-200 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-700">Gerar conclusão</CardTitle>
              <CardDescription>
                Gere uma conclusão baseada nos dados e análises do seu relatório com o uso de inteligência artificial.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[180px]">
                <FileText className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 text-center max-w-md">
                  Clique no botão abaixo para gerar sua conclusão.
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button
                size="lg"
                onClick={handleGenerateConclusion}
                disabled={isGenerating}
                className="px-8 py-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando conclusão...
                  </>
                ) : (
                  "Gerar conclusão"
                )}
              </Button>
            </CardFooter>
          </Card>
        )
      }

    </section>
  )
}