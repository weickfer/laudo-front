export function Sidebar() {
  return (
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
  )
}