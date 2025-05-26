import { Download, FileEdit } from "lucide-react";
import { Link, useParams } from "react-router";
import { API_URL } from "../../services/api";
import { Button } from "../ui/button";

export function TopActions() {
  const { id } = useParams();

  return (
    <div className="sticky top-0 z-10 bg-white border-b p-4 hidden md:flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">Visualização do Laudo</h1>
      <div className="flex gap-2">
        {/* <Link to={`/reports/${id}/conclusion`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Sparkle className="h-4 w-4" />
            <span>Conclusão feita por IA</span>
          </Button>
        </Link> */}
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

  )
}