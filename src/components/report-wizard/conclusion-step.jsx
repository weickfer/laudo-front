import { CheckCircle, Loader2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

import { useParams } from "react-router";
import { api } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

export function ConclusionStep({ formData }) {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isLoadingConclusion, setIsLoadingConclusion] = useState(false);
  const [conclusion, setConclusion] = useState(formData.conclusao?.conclusao ?? "");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'success', 'error'
  const { id } = useParams();

  const showAISuggestion = !!aiSuggestion;
  const hasEditedConclusion = conclusion !== formData?.conclusao?.conclusao;

  const handleAIComplement = async () => {
    setIsLoadingAI(true);
    const response = await api(`/api/v2/relatorios/${id}/ai-conclusao`, 'POST')

    if (response?.conclusao) {
      setAiSuggestion(response?.conclusao)
    }

    setIsLoadingAI(false)
  }

  const handleAddAISuggestion = () => {
    const newConclusion = !!conclusion ? `${conclusion}\n${aiSuggestion}` : aiSuggestion;
    setConclusion(newConclusion);
    setAiSuggestion(null);
  }

  const handleSaveConclusion = async () => {
    setIsLoadingConclusion(true);
    const response = await api(`/api/v2/relatorios/${id}/conclusao`, 'POST', {
      conclusao: conclusion,
    })

    setIsLoadingConclusion(false);
    setSaveStatus('success');
  }

  return (
    <div>
      <p className="text-sm text-gray-700 font-normal">Insira sua conclusão e utilize a nossa IA para complementar sua análise.</p>

      <div className="mt-4 space-y-2">
        <div className="flex flex-row justify-between items-center">
          <Label className="font-medium">Conclusão do relatório</Label>

          <Button
            onClick={handleAIComplement}
            disabled={isLoadingAI}
            size="sm"
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800"
          >
            {isLoadingAI ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {isLoadingAI ? "Analisando..." : "Complementar com IA"}
          </Button>
        </div>
        <textarea
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 mt-2" 
          rows="4" 
          placeholder="Insira sua conclusão aqui..."
          value={conclusion}
          onChange={(e) => setConclusion(e.target.value)}
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500">{conclusion.length} caracteres</p>
          {isLoadingAI && (
            <div className="text-xs text-blue-600 flex items-center">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />A IA está analisando os dados do relatório...
            </div>
          )}
        </div>
      </div>

      {showAISuggestion && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                      <Sparkles className="w-5 h-5" />
                      Sugestão da IA
                    </CardTitle>
                    <div className="bg-blue-100 text-blue-700">
                      Gerado por IA
                    </div>
                  </div>
                  <CardDescription className="text-blue-600">
                    Revise o conteúdo sugerido antes de adicionar à sua conclusão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{aiSuggestion}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleAddAISuggestion} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar à Conclusão
                    </Button>
                    <Button
                      onClick={() => setAiSuggestion(null)}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Descartar
                    </Button>
                  </div>
                </CardContent>
              </Card>
      )}

      {saveStatus === 'success' && (
        <Card className="p-2 mt-4 text-green-600 border-green-200">
          <CheckCircle className="w-4 h-4 inline-block mr-2" />
          Conclusão salva com sucesso!
        </Card>
      )}

      <Button 
        disabled={showAISuggestion || !conclusion || isLoadingConclusion || !hasEditedConclusion}
        onClick={handleSaveConclusion}
        className="mt-5 w-full bg-slate-700 hover:bg-slate-800 text-white"
      >
        {
          isLoadingConclusion? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Conclusão"
          )
        }
      </Button>
    </div>
  )
}