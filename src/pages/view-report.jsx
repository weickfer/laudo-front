import { Download, FileEdit } from "lucide-react"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ImageEditorWithTools } from "../modules/annotations/components/image-editor/modal"
import { useAnnotations } from "../modules/annotations/contexts/annotations"
import { api, API_URL } from "../services/api"
const mapperExtension = {
  pdf: {
    bg: "bg-red-100",
    text: "text-red-600"
  },
  png: {
    bg: "bg-yellow-100",
    text: "text-yellow-600"
  },
  jpg: {
    bg: "bg-yellow-100",
    text: "text-yellow-600"
  },
  docx: {
    bg: "bg-blue-100",
    text: "text-blue-600"
  },
  xls: {
    bg: "bg-green-100",
    text: "text-green-600"
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
  }
}

export function ViewReport() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const { currentAttachment, deselectAttachment, selectAttachment } = useAnnotations()

  useEffect(() => {
    api(`/api/relatorios/${id}`)
      .then(data => {
        setData(data)
      })
  }, [])

  if (!data) return <div>Carregando...</div>

  const geolocationsFiles = data?.geolocations.map(geolocation => ({
    id: geolocation.id,
    url: geolocation.url,
    filename: geolocation.url.split('/')?.pop(),
    extension: geolocation.url.split('.')?.pop(),
  }))
  const pdfFile = {
    url: data.pdfUrl,
    filename: data.pdfUrl.split('/')?.pop(),
    extension: data.pdfUrl.split('.')?.pop(),
  }
  const evidencesFiles = data.evidencias.map(evidence => evidence.arquivos)?.flat().map(
    arquivo => ({
      id: arquivo.id,
      url: arquivo.url,
      filename: arquivo.url.split('/')?.pop(),
      extension: arquivo.url.split('.')?.pop(),
    })
  )

  const handleDownloadFile = async (url, filename) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Erro ao baixar arquivo');

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename; // defina o nome do arquivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  const createFiles = () => {
    const render = ({ id, url, filename, extension }) => {
      const { bg, text } = mapperExtension[extension] ?? mapperExtension.default

      return (
        <div key={id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
          <div className="flex items-center gap-3">
            <div className={`${bg} w-10 h-10 rounded flex items-center justify-center`}>
              <span className={`${text} text-xs font-medium`}>{extension.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-medium">{decodeURIComponent(filename)}</p>
              <p className="text-xs text-gray-500">Adicionado em {new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Button onClick={() => handleDownloadFile(url, filename)} variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      )
    }

    return [
      pdfFile,
      ...geolocationsFiles,
      ...evidencesFiles
    ].map(render)
  }


  const environmentsLabels = data.evidencias.map(evidence => evidence.ambiente)

  const evidencesByEnvironment = data.evidencias.reduce((acc, evidence) => {
    if (!acc[evidence.ambiente]) {
      acc[evidence.ambiente] = []
    }
    acc[evidence.ambiente].push(evidence)
    return acc
  }, {})

  const flatEvidences = environmentsLabels.map(environment => evidencesByEnvironment[environment]).flat()

  return (
    <>
      {
        !!currentAttachment?.url && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] h-[90%] relative">
              <button
                onClick={deselectAttachment}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <div className="h-full w-full">
                <ImageEditorWithTools sidebarEnabled={false} imageUrl={currentAttachment?.url} vectors={currentAttachment?.vetores} />
              </div>
            </div>
          </div>
        )
      }
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-serif">
        <div className="max-w-5xl mx-auto bg-white shadow-md">
          {/* Ações fixas no topo */}
          <div className="sticky top-0 z-10 bg-white border-b p-4 hidden md:flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">Visualização do Laudo</h1>
            <div className="flex gap-2">
              <Link to={`/reports/${id}/update`}> 
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileEdit className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
              </Link>
              <Link to={`${API_URL}/api/relatorios/${id}/generate`} target="_blank">
                <Button variant="default" size="sm" className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900">
                  <Download className="h-4 w-4" />
                  <span>Exportar DOCX</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Navegação lateral */}
            <div className="md:w-64 p-4 border-r hidden md:block">
              <nav className="sticky top-24">
                <ul className="space-y-2">
                  <li>
                    <a href="#cabecalho" className="block text-blue-800 hover:text-blue-600">
                      Cabeçalho
                    </a>
                  </li>
                  <li>
                    <a href="#informacoes" className="block text-blue-800 hover:text-blue-600">
                      Informações do Imóvel
                    </a>
                  </li>
                  <li>
                    <a href="#caracteristicas" className="block text-blue-800 hover:text-blue-600">
                      Características Gerais
                    </a>
                  </li>
                  <li>
                    <a href="#infraestrutura" className="block text-blue-800 hover:text-blue-600">
                      Infraestrutura Urbana
                    </a>
                  </li>
                  <li>
                    <a href="#localizacoes" className="block text-blue-800 hover:text-blue-600">
                      Localizações
                    </a>
                  </li>
                  <li>
                    <a href="#evidencias" className="block text-blue-800 hover:text-blue-600">
                      Evidências
                    </a>
                  </li>
                  <li>
                    <a href="#arquivos" className="block text-blue-800 hover:text-blue-600">
                      Arquivos
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 p-6">
              {/* Cabeçalho do laudo */}
              <section id="cabecalho" className="mb-8">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-blue-900">Laudo de Vistoria Técnica</h1>
                      <p className="text-gray-600">Perito: {data.perito || 'Não especificado'}</p>
                      <p className="text-gray-600">Data: {new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Cód: {data.id}</p>
                    {/* <p className="text-sm text-gray-500">Versão: 1.0</p> */}
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Informações do imóvel */}
              <section id="informacoes" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Informações do Imóvel</h2>
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Proprietário</p>
                      <p className="font-medium">{data.proprietario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID do Imóvel</p>
                      <p className="font-medium">{data.idImovel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo do Imóvel</p>
                      <p className="font-medium">{data.tipoImovel || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Acompanhante</p>
                      <p className="font-medium">{data.acompanhante}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-sm text-gray-500">Endereço Completo</p>
                      <p className="font-medium">{data.endereco}</p>
                    </div>
                  </div>
                </Card>
              </section>

              <Separator className="my-6" />

              {/* Características gerais */}
              <section id="caracteristicas" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Características Gerais</h2>
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Área do Terreno</p>
                      <p className="font-medium">{data.area} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dimensões</p>
                      <p className="font-medium">{data.dimensoes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Forma do Terreno</p>
                      <p className="font-medium">{data.forma || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cobertura</p>
                      <p className="font-medium">{data.cobertura || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estrutura</p>
                      <p className="font-medium">{data.estrutura || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fundações</p>
                      <p className="font-medium">{data.fundacoes || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado de Conservação</p>
                      <p className="font-medium">{data.estadoConservacao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado de Ocupação</p>
                      <p className="font-medium">{data.estadoOcupacao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Idade Aparente</p>
                      <p className="font-medium">{data.idadeAparente} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Idade Real</p>
                      <p className="font-medium">{data.idadeReal} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Padrão Construtivo</p>
                      <p className="font-medium">{data.padraoConstrucao || 'Não especificado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uso Predominante</p>
                      <p className="font-medium">{data.usoPredominante || 'Não especificado'}</p>
                    </div>
                  </div>
                </Card>
              </section>

              <Separator className="my-6" />

              {/* Infraestrutura urbana */}
              <section id="infraestrutura" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Infraestrutura Urbana</h2>
                <Card className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Serviços Disponíveis</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {data.infraestruturas.map((infra) => (
                          <li key={infra.id}>{infra.tipo}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Serviços Comunitários Próximos</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {data.servicosComunitarios.map((servico) => (
                          <li key={servico.id}>{servico.tipo}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </section>

              <Separator className="my-6" />

              {/* Localizações */}
              <section id="localizacoes" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Localizações</h2>
                <Card className="p-4">
                  <div className="space-y-4">
                    {
                      data.geolocations.map((geolocation, index) => (
                        <div className="flex flex-col md:flex-row gap-4 border-b pb-4">
                          <div className="w-full md:w-32 h-24 bg-gray-200 flex-shrink-0">
                            <img
                              src={geolocation.url}
                              alt={`Localização ${index + 1}`}
                              width={128}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">Localização Principal</h3>
                            <p className="text-sm text-gray-600 mb-2">Coordenadas: {geolocation.latitude}, {geolocation.longitude}</p>
                            <Button variant="link" onClick={() => window.open(`https://www.google.com/maps?q=${geolocation.latitude},${geolocation.longitude}`, '_blank')} size="sm" className="p-0 h-auto text-blue-800">
                              Ver no mapa
                            </Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </Card>
              </section>

              <Separator className="my-6" />

              {/* Evidências */}
              <section id="evidencias" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Evidências</h2>

                <Tabs defaultValue="sala" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    {
                      environmentsLabels?.map(environment => (
                        <TabsTrigger value={environment}>{environment}</TabsTrigger>
                      ))
                    }
                  </TabsList>

                  {
                    flatEvidences?.map(evidence => {
                      return (
                        <TabsContent value={evidence.ambiente} className="mt-0">
                          <Card className="p-4">
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">Data: {new Date(evidence.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-700 mt-2">
                                {evidence.descricao}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {evidence.arquivos.map((arquivo) => (
                                <div key={arquivo.id} className="aspect-square bg-gray-200 relative group">
                                  <img
                                    src={arquivo.url}
                                    alt="Evidência"
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Button variant="secondary" size="sm" className="text-xs" onClick={() => selectAttachment(arquivo)}>
                                      Ampliar
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </TabsContent>
                      )
                    })
                  }

                  {/* <TabsContent value={environmentsLabels?.[0]} className="mt-0">
                  <Card className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium">{data.evidencias[0].ambiente}</h3>
                      <p className="text-sm text-gray-600">Data: {new Date(data.evidencias[0].date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-700 mt-2">
                        {data.evidencias[0].descricao}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {data.evidencias[0].arquivos.map((arquivo) => (
                        <div key={arquivo.id} className="aspect-square bg-gray-200 relative group">
                          <img
                            src={arquivo.url}
                            alt="Evidência"
                            width={150}
                            height={150}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button variant="secondary" size="sm" className="text-xs">
                              Ampliar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent> */}

                  {/* <TabsContent value="cozinha" className="mt-0">
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Cozinha</h3>
                    <p className="text-sm text-gray-600">Data: 12/04/2025</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Inspeção da cozinha identificou infiltração no teto próximo à tubulação da pia. Possível
                      vazamento na tubulação hidráulica do andar superior.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 1"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 2"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="banheiro" className="mt-0">
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Banheiro Social</h3>
                    <p className="text-sm text-gray-600">Data: 12/04/2025</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Inspeção do banheiro social identificou rejunte deteriorado no box e sinais de infiltração na
                      parede adjacente ao chuveiro.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 1"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 2"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 3"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="quarto" className="mt-0">
                <Card className="p-4">
                  <div className="mb-4">
                    <h3 className="font-medium">Quarto Principal</h3>
                    <p className="text-sm text-gray-600">Data: 12/04/2025</p>
                    <p className="text-sm text-gray-700 mt-2">
                      Inspeção do quarto principal identificou manchas de umidade no teto, próximo à parede externa.
                      Possível infiltração pela cobertura.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 1"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-200 relative group">
                      <img
                        src="/placeholder.svg?height=150&width=150"
                        alt="Evidência 2"
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="secondary" size="sm" className="text-xs">
                          Ampliar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent> */}
                </Tabs>
              </section>

              <Separator className="my-6" />

              {/* Arquivos */}
              <section id="arquivos" className="mb-8">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Arquivos</h2>
                <Card className="p-4">
                  <div className="space-y-3">
                    {/* Estrutura repetitiva */}
                    {
                      createFiles()
                    }

                    {/* <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-medium">DOC</span>
                        </div>
                        <div>
                          <p className="font-medium">Anexo_Técnico_IMV-2025-1234.docx</p>
                          <p className="text-xs text-gray-500">1.8 MB - Adicionado em 12/04/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-green-600 text-xs font-medium">XLS</span>
                        </div>
                        <div>
                          <p className="font-medium">Medições_IMV-2025-1234.xlsx</p>
                          <p className="text-xs text-gray-500">0.9 MB - Adicionado em 12/04/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div> */}
                  </div>
                </Card>
              </section>

              {/* Ações fixas no rodapé (visíveis apenas em mobile) */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-end gap-2 md:hidden">
                <Button onClick={() => navigate(`/reports/${id}/update`)} variant="outline" size="sm" className="flex items-center gap-1">
                  <FileEdit className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
                <Link to={`${API_URL}/api/relatorios/${id}/generate`} target="_blank">
                  <Button variant="default" size="sm" className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900">
                    <Download className="h-4 w-4" />
                    <span>Exportar DOCX</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
