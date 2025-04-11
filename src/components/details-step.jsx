import React from "react"

import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"

export function InspectionForm({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      
      {/* 🔹 1. Dados Gerais da Vistoria */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Dados Gerais da Vistoria</h2>

        <div className="grid gap-3">
          <Label htmlFor="idIndex">ID do Imóvel/Vistoria</Label>
          <Input
            id="idIndex"
            placeholder="Número de referência"
            value={formData.idIndex}
            onChange={(e) => updateFormData({ idIndex: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="acompanhante">Acompanhante</Label>
          <Input
            id="acompanhante"
            placeholder="Nome do acompanhante"
            value={formData.acompanhante}
            onChange={(e) => updateFormData({ acompanhante: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="createdAt">Data da Vistoria</Label>
          <Input
            id="createdAt"
            type="date"
            value={formData.createdAt}
            onChange={(e) => updateFormData({ createdAt: e.target.value })}
          />
        </div>
      </section>

      {/* 🔹 2. Identificação do Imóvel */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Identificação do Imóvel</h2>

        <div className="grid gap-3">
          <Label htmlFor="endereco">Endereço</Label>
          <Textarea
            id="endereco"
            placeholder="Rua, número, bairro, UF"
            value={formData.endereco}
            onChange={(e) => updateFormData({ endereco: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="proprietario">Proprietário</Label>
          <Input
            id="proprietario"
            placeholder="Nome do proprietário"
            value={formData.proprietario}
            onChange={(e) => updateFormData({ proprietario: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="estadoOcupacao">Estado de Ocupação</Label>
          <Select
            value={formData.estadoOcupacao}
            onValueChange={(value) => updateFormData({ estadoOcupacao: value })}
          >
            <SelectTrigger id="estadoOcupacao">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ocupado">Ocupado</SelectItem>
              <SelectItem value="ocupante">Ocupante</SelectItem>
              <SelectItem value="inquilino">Inquilino</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* 🔹 3. Caracterização da Região */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Caracterização da Região</h2>

        <div className="grid gap-3">
          <Label htmlFor="usoPredominante">Uso Predominante</Label>
          <Input
            id="usoPredominante"
            placeholder="Ex: residencial unifamiliar"
            value={formData.usoPredominante}
            onChange={(e) => updateFormData({ usoPredominante: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label>Infraestrutura Urbana</Label>
          <div className="flex flex-wrap gap-3">
            {["Pavimentação", "Água", "Esgoto", "Iluminação Pública"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <Checkbox
                  checked={formData.infraestruturaUrbana?.includes(item)}
                  onCheckedChange={(checked) =>
                    updateFormData({
                      infraestruturaUrbana: checked
                        ? [...(formData.infraestruturaUrbana || []), item]
                        : formData.infraestruturaUrbana.filter((i) => i !== item),
                    })
                  }
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <Label>Serviços Comunitários</Label>
          <div className="flex flex-wrap gap-3">
            {["Coleta de lixo", "Escola", "Posto de saúde", "Transporte"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <Checkbox
                  checked={formData.servicosComunitarios?.includes(item)}
                  onCheckedChange={(checked) =>
                    updateFormData({
                      servicosComunitarios: checked
                        ? [...(formData.servicosComunitarios || []), item]
                        : formData.servicosComunitarios.filter((i) => i !== item),
                    })
                  }
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 4. Caracterização do Imóvel */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Caracterização do Imóvel</h2>

        {/* 🟢 Terreno */}
        <div className="grid gap-3">
          <Label htmlFor="dimensoes">Dimensões (frente, fundo, lados)</Label>
          <Input
            id="dimensoes"
            placeholder="Ex: 10x20m"
            value={formData.dimensoes}
            onChange={(e) => updateFormData({ dimensoes: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="forma">Forma do Terreno</Label>
          <Input
            id="forma"
            placeholder="Ex: retangular"
            value={formData.forma}
            onChange={(e) => updateFormData({ forma: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="area">Área</Label>
          <Input
            id="area"
            placeholder="Ex: 70m²"
            value={formData.area}
            onChange={(e) => updateFormData({ area: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="fracaoIdeal">Fração Ideal</Label>
          <Input
            id="fracaoIdeal"
            placeholder="Ex: 1.00"
            value={formData.fracaoIdeal}
            onChange={(e) => updateFormData({ fracaoIdeal: e.target.value })}
          />
        </div>

        {/* 🟢 Imóvel */}
        <div className="grid gap-3">
          <Label htmlFor="tipoImovel">Tipo de Imóvel</Label>
          <Input
            id="tipoImovel"
            placeholder="Ex: casa"
            value={formData.tipoImovel}
            onChange={(e) => updateFormData({ tipoImovel: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="usoImovel">Uso do Imóvel</Label>
          <Input
            id="usoImovel"
            placeholder="Ex: residencial"
            value={formData.usoImovel}
            onChange={(e) => updateFormData({ usoImovel: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="estadoConservacao">Estado de Conservação</Label>
          <Input
            id="estadoConservacao"
            placeholder="Ex: regular"
            value={formData.estadoConservacao}
            onChange={(e) => updateFormData({ estadoConservacao: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="idadeReal">Idade Real</Label>
          <Input
            id="idadeReal"
            placeholder="Ex: 20 anos"
            value={formData.idadeReal}
            onChange={(e) => updateFormData({ idadeReal: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="idadeAparente">Idade Aparente</Label>
          <Input
            id="idadeAparente"
            placeholder="Ex: 15 anos"
            value={formData.idadeAparente}
            onChange={(e) => updateFormData({ idadeAparente: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="padraoConstrucao">Padrão de Construção</Label>
          <Input
            id="padraoConstrucao"
            placeholder="Ex: médio/baixo"
            value={formData.padraoConstrucao}
            onChange={(e) => updateFormData({ padraoConstrucao: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="fundacoes">Fundações</Label>
          <Input
            id="fundacoes"
            placeholder="Ex: não identificadas"
            value={formData.fundacoes}
            onChange={(e) => updateFormData({ fundacoes: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="estrutura">Estrutura</Label>
          <Input
            id="estrutura"
            placeholder="Ex: concreto armado"
            value={formData.estrutura}
            onChange={(e) => updateFormData({ estrutura: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="fechamento">Fechamento</Label>
          <Input
            id="fechamento"
            placeholder="Ex: alvenaria de blocos"
            value={formData.fechamento}
            onChange={(e) => updateFormData({ fechamento: e.target.value })}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="cobertura">Cobertura</Label>
          <Input
            id="cobertura"
            placeholder="Ex: cerâmica"
            value={formData.cobertura}
            onChange={(e) => updateFormData({ cobertura: e.target.value })}
          />
        </div>
      </section>
    </div>
  )
}
