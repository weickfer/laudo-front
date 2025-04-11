import { Input, Label } from '@inbimplus/components'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@inbimplus/components/ui/table"
import { Trash2 } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { Button } from "../ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"


export function TableInput({ rows = [], onChange, disciplines = [], readOnly }) {
  // console.log(disciplines)
  const { formState: { errors } } = useFormContext()
  const tableErrors = errors?.disciplines?.reduce?.((errors, current) => {
    const entries = Object.keys(current)

    entries.forEach((key) => {
      errors[key] += 1
    })

    return errors
  }, {
    discipline: 0,
    status: 0,
    deadline: 0,
    completedIn: 0,
  })

  const addRow = () => {
    const newRow = {
      rowId: String(Date.now() * (Math.random() * 99)),
      discipline: '',
      status: '',
      deadline: '',
      completedIn: ''
    }
    onChange([...rows, newRow])
  }

  const removeRow = (id) => {
    onChange(rows.filter(row => row.rowId !== id))
  }

  const updateRow = (id, field, value) => {
    const updatedRows = rows.map(row =>
      row.rowId === id ? { ...row, [field]: value } : row
    )

    onChange(updatedRows)
  }


  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Label required={rows.length > 0} data-error={tableErrors?.discipline > 0}>Disciplina</Label>
            </TableHead>
            <TableHead>
              <Label required={rows.length > 0} data-error={tableErrors?.status > 0}>Status</Label>
            </TableHead>
            <TableHead>
              <Label
                // required={rows.length > 0}
                // data-error={tableErrors?.deadline > 0}
              >Prazo</Label>
            </TableHead>
            <TableHead>
              <Label>Concluído em</Label>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.rowId ?? row.id}>
              <TableCell>
                <Select
                  value={row?.id ?? row.disciplineId}
                  onValueChange={(value) => updateRow(row.rowId, 'disciplineId', value)}
                >
                  <SelectTrigger disabled={readOnly} className="gap-2">
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      disciplines?.map(discipline => (
                        <SelectItem key={discipline.id} value={discipline.id}>
                          {`${discipline.slug} - ${discipline.name}`}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.status}
                  onValueChange={(value) => updateRow(row.rowId, 'status', value)}
                >
                  <SelectTrigger disabled={readOnly} className="gap-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="participar">Participar</SelectItem>
                      <SelectItem value="acompanhar">Acompanhar</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-gray-500 font-medium p-2">Pendente para disciplina</SelectLabel>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="ciente">Ciente</SelectItem>
                      <SelectItem value="revisar">Revisar</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel className="text-gray-500 font-medium p-2">Pendente para coordenação</SelectLabel>
                      <SelectItem value="validar">Validar</SelectItem>
                      <SelectItem value="validado">Validado</SelectItem>
                      <SelectItem value="concluído">Concluído</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={row.deadline ?? ''}
                  disabled={readOnly}
                  onChange={(e) => updateRow(row.rowId, 'deadline', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={row.completedIn ?? ''}
                  disabled={readOnly}
                  onChange={(e) => updateRow(row.rowId, 'completedIn', e.target.value)}
                />
              </TableCell>
              <TableCell>
                {
                  !readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.rowId)}
                      // disabled={rows.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        !readOnly && (
          <Button className="mt-2" type="button" onClick={addRow}>Adicionar</Button>
        )
      }
    </>
  )
}