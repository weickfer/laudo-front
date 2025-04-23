import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'

import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { AttachmentInput } from '../modules/annotations/components/annotation-form/atachment-input'
import { Attachment } from '../modules/annotations/components/annotation-form/attachment'
import { useAnnotations } from '../modules/annotations/contexts/annotations'
import { useToast } from '../modules/annotations/hooks/use-toast'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../modules/gis-viewer/components/ui/select'

const createImageSchema = z.object({
  // imageName: z.string().nonempty("Nome da imagem é obrigatório"),
  description: z.string().nonempty("Descrição é obrigatória"),
  environment: z.string().nonempty("Ambiente é obrigatório"),
  location: z.string().nonempty("Local é obrigatório"),
  date: z.string().nonempty("Data é obrigatória"),
});

export function EvidenceForm({
  readOnly = false,
  onClose,
  onSave,
  fields = {},
  onScreenshotStart,
  onScreenshotEnd,
  onViewAttachment,
}) {
  const form = useForm({
    resolver: zodResolver(createImageSchema),
    values: fields,
  })

  const { register, handleSubmit, formState } = form
  const { isSubmitting } = formState

  const {
    attachments,
    registerScreenshotFunction,
    selectAttachment,
    addAttachment,
    removeAttachment,
  } = useAnnotations()

  const { toast } = useToast()
  const [screenshotFunction] = registerScreenshotFunction

  const handleScreenshot = async () => {
    const screenshotUrl = await Promise.resolve(screenshotFunction())
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
    addAttachment({ id, url: screenshotUrl, vectors: [] })
    onScreenshotEnd && onScreenshotEnd()
  }

  const handleAddAttachment = (e) => {
    const file = e?.target?.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        addAttachment({ id, url: e.target.result, vectors: [] })
      }
      reader.readAsDataURL(file)
      return
    }

    onScreenshotStart && onScreenshotStart()

    toast({
      title: "Aponte a Câmera.",
      description: "Direcione a câmera para o local indicado para continuar.",
      duration: Infinity,
      close: false,
      action: (
        <button onClick={handleScreenshot} className="underline text-sm">
          Tirar foto
        </button>
      ),
    })
  }

  const onSubmit = async (data) => {
    await onSave({
      formData: { ...data, attachments, id: fields?.id },
      type: fields?.id ? 'update' : 'create',
    })
  }

  const FormComponent = readOnly ? 'div' : 'form'

  return (
    <FormProvider {...form}>
      <FormComponent className="space-y-4 border rounded-md p-2" onSubmit={handleSubmit(onSubmit)}>
      <div>
          <label className="block text-sm text-gray-700">Anexar imagens</label>
          <div className="mt-1 w-full flex flex-row gap-2">
            {attachments.map((attachment) => (
              <Attachment
                key={attachment.id}
                url={attachment.url}
                onRemove={!readOnly ? () => removeAttachment(attachment) : undefined}
                onEdit={!readOnly ? () => selectAttachment(attachment) : undefined}
                {...(readOnly && { onView: () => onViewAttachment(attachment) })}
              />
            ))}
            {!readOnly && (
              <AttachmentInput
                onAddAttachment={handleAddAttachment}
                screenshotFunction={screenshotFunction}
              />
            )}
          </div>
        </div>

        {/* <div>
          <Label required data-error={!!formState.errors?.imageName}>
            Nome da Imagem
          </Label>
          <Input
            type="text"
            disabled={readOnly}
            readOnly={readOnly}
            {...register("imageName")}
          />
        </div> */}

        <div>
          <Label required data-error={!!formState.errors?.description}>
            Descrição
          </Label>
          <textarea
            rows={3}
            disabled={readOnly}
            readOnly={readOnly}
            className="w-full border rounded p-2"
            {...register("description")}
          />
        </div>

        <div>
          <Label required data-error={!!formState.errors?.environment}>
            Ambiente
          </Label>
          <Input
            type="text"
            disabled={readOnly}
            readOnly={readOnly}
            {...register("environment")}
          />
        </div>

        <div>
          <Label required data-error={!!formState.errors?.location}>
            Elemento Construtivo
          </Label>
          <Select
            disabled={readOnly}
            onValueChange={(value) => {
              form.setValue("location", value)
            }}
            value={form.getValues("location")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o elemento construtivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Parede">Parede</SelectItem>
                <SelectItem value="Piso">Piso</SelectItem>
                <SelectItem value="Teto">Teto</SelectItem>
                <SelectItem value="Porta">Porta</SelectItem>
                <SelectItem value="Janela">Janela</SelectItem>
                <SelectItem value="Estrutura">Estrutura</SelectItem>
                <SelectItem value="Instalação">Instalação</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label required data-error={!!formState.errors?.date}>
            Data
          </Label>
          <Input
            type="date"
            disabled={readOnly}
            readOnly={readOnly}
            {...register("date")}
          />
        </div>

        <div className="flex flex-row gap-2 justify-between">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            className="w-full bg-gray-100 border border-gray-300 p-2 rounded text-gray-700"
          >
            Cancelar
          </button>
          {!readOnly && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : "Salvar"}
            </button>
          )}
        </div>
      </FormComponent>
    </FormProvider>
  )
}
