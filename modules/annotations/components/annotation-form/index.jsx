import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from "react"
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { useAnnotations } from "../../contexts/annotations"
import { useToast } from "../../hooks/use-toast"
import { SelectItem } from "../ui/select"
import { ToastAction } from "../ui/toast"

import { Input, Label } from '@inbimplus/components'
import { AttachmentInput } from "./atachment-input"
import { Attachment } from "./attachment"
import { CreateGroup } from "./create-group"
import { ControlledSelect } from "./select"
import { TableInput } from "./table-input"

const createAnnotationSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  visibility: z.string().nonempty(),
  groupId: z.string().nullish(),
  priority: z.string().nonempty(),
  disciplines: z.array(
    z.object({
      disciplineId: z.string().nonempty(),
      status: z.string().nonempty(),
      deadline: z.string().nullish(),
      completedIn: z.string().nullish(),
    })
  ).min(1),
}).refine((data) => {
  if(data.visibility === 'group' && !data.groupId) {
    return false
  }

  return true
}, {
  path: ["groupId"],
})

export function AnnotationForm({
  readOnly = false, 
  onClose, 
  onSave, 
  onScreenshotStart, 
  onScreenshotEnd, 
  fields = {}, 
  onCreateGroup, 
  project,
  onViewAttachment,
}) {
  const form = useForm({
    resolver: zodResolver(createAnnotationSchema),
    values: fields,
  })
  const FormComponent = readOnly ? 'div' : 'form'
  const { handleSubmit, formState, register, control, watch } = form
  const { isSubmitting } = formState
  const { 
    attachments,
    watched,
    registerScreenshotFunction,
    selectAttachment, 
    addAttachment, 
    removeAttachment,
  } = useAnnotations()
  const { disciplines, groups, users } = project
  const editHasEnabled = !!fields?.id
  
  const [screenshotFunction,] = registerScreenshotFunction
  const { toast } = useToast()

  const visibility = watch('visibility')

  useEffect(() => {
    if (fields?.attachments) {
      const items = fields.attachments?.map(attachment => ({
        id: attachment.id,
        url: attachment.publicUrl,
        ...attachment,
      }))

      addAttachment(items)
      // attachments.populate(items)
    }
  }, [fields]);

  const handleScreenshot = async () => {
    const screenshotUrl = await Promise.resolve(screenshotFunction())

    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

    addAttachment({
      id,
      url: screenshotUrl,
      vectors: []
    })

    onScreenshotEnd && onScreenshotEnd()
  }

  const handleAddAttachment = (e) => {   
    const file = e?.target?.files?.[0]

    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        addAttachment({
          id,
          url: e.target.result,
          vectors: [],
        })
        // setAttachments([...attachments, { id, url: e.target.result, vectors: [] }])
      };
      reader.readAsDataURL(file);
      
      return
    }

    onScreenshotStart && onScreenshotStart()

    toast({
      title: "Aponte a Câmera.",
      description: "Direcione a câmera para o local indicado para continuar.",
      duration: Infinity,
      close: false,
      action: <ToastAction altText="Try again" onClick={handleScreenshot}>Tirar foto</ToastAction>,
    })
  }

  const onSubmit = async (data) => {
    const insertType = editHasEnabled ? 'update' : 'create'

    await onSave({
      type: insertType,
      formData: { ...data, attachments, watched, id: fields?.id }
    })
  }

  return (
    <FormProvider {...form}>
      <FormComponent className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label required data-error={!!formState.errors?.title}>Título</Label>
            <Input
              type="text"
              disabled={readOnly}
              readOnly={readOnly}
              {...register('title')}
            />
          </div>
          <div>
            <Label required data-error={!!formState.errors?.description}>
              Descrição
            </Label>
            <textarea
              disabled={readOnly}
              readOnly={readOnly}
              className="disabled:cursor-not-allowed disabled:opacity-50 p-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
              rows="4"
              {...register('description')}
            />
          </div>
          <div>
            <Label data-error={!!formState.errors?.visibility} required>
              Visibilidade
            </Label>
            <ControlledSelect readOnly={readOnly} className="mt-1" name="visibility" placeholder="Selecione">
              <SelectItem value="public">Público</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="group">Grupo</SelectItem>
              <SelectItem value="admin">Coordenação</SelectItem>
            </ControlledSelect>
          </div>
          {
            visibility === 'group' && (
              <div>
                <Label data-error={!!formState.errors?.groupId} required>
                  Grupo
                </Label>
                <div className="flex mt-1 flex-row gap-2">
                  <ControlledSelect readOnly={readOnly} name="groupId" placeholder="Selecione um grupo">
                    {/* <SelectItem value="admin">Coordenação</SelectItem> */}
                    {
                      groups.map(group => (
                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                      ))
                    }
                  </ControlledSelect>

                  {
                    !readOnly && <CreateGroup users={users} onCreate={onCreateGroup} />
                  }
                </div>
              </div>
            )
          }
          <div>
            <Label data-error={!!formState.errors?.priority} required>
                Prioridade
            </Label>
            <ControlledSelect readOnly={readOnly} className="mt-1" name="priority" placeholder="Selecione">
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
            </ControlledSelect>
          </div>
          <div>
            <Label data-error={!!formState.errors?.disciplines} required>
              Disciplinas
            </Label>
            <Controller 
              name="disciplines"
              control={control}
              render={({ field }) => (
                <TableInput readOnly={readOnly} rows={field.value} onChange={field.onChange} disciplines={disciplines} />
              )}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Anexar imagens</label>
            <div className="mt-1 w-full flex flex-row gap-2">
              {
                attachments.map((attachment) => (
                  <Attachment 
                    key={attachment.id} 
                    url={attachment.url} 
                    onRemove={!readOnly ? () => removeAttachment(attachment) : undefined} 
                    onEdit={!readOnly ? () => selectAttachment(attachment) : undefined}
                    {...(readOnly && { onView: () => onViewAttachment(attachment) })}
                  />
                ))
              }

              {
                !readOnly && (
                  <AttachmentInput 
                    onAddAttachment={handleAddAttachment}
                    screenshotFunction={screenshotFunction}
                  />
                )
              }
            </div>
          </div>

          {
            readOnly 
            ? (
              <div className="flex flex-row gap-2 justify-between">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 border-gray-200 text-gray-700 p-2 border rounded-lg"
                >
                  Fechar
                </button>
              </div>
            )
            : (
              <div className="flex flex-row gap-2 justify-between">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full bg-gray-100 border-gray-200 text-gray-700 p-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  // disabled={!!fields?._id}
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {
                    isSubmitting ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : 'Salvar'
                  }
                </button>
              </div>
            )
          }
      </FormComponent>
    </FormProvider>
  )
}