import { ClipboardList, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { Link, useNavigate } from "react-router"
import { DataTable } from "../components/tables/data-table"
import { columns } from "../components/tables/reports-columns"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { api } from "../services/api"

export function Home() {
  const [data, setData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api('/api/relatorios')
      .then((data) => setData(data))
  }, [])

  const handleSelect = ({ id }) => {
    navigate(`/reports/${id}/view`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-800" />
          <h1 className="text-lg font-semibold">Sistema de Vistorias</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/reports/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Relatório
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Relatórios de Vistoria</CardTitle>
            <CardDescription>Gerencie todos os relatórios de vistoria de imóveis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <DataTable columns={columns} data={data} onSelect={handleSelect} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
