import { Input, Label, SelectGroupMembers } from "@inbimplus/components";
import { Popover, PopoverContent, PopoverTrigger } from "@inbimplus/components/ui/popover";
import { Users } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(1),
  members: z.array(z.string()).min(1),
})

export function CreateGroup({ users, onCreate }) {
  const [name, setName] = useState('')
  const [members, setMembers] = useState([])
  const [errors, setErrors] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [open, setOpen] = useState(false)

  const onSubmit = async () => {
    setErrors(null)
    const { error } = await createGroupSchema.safeParseAsync({ name, members })

    if(error) {
      setErrors(error.flatten().fieldErrors)
      return
    }

    setIsFetching(true)

    const formData = { name, members }

    await onCreate({ formData })

    setIsFetching(false)
    setOpen(false)
    setName('')
    setMembers([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="size-9 p-2 text-gray-300 border border-gray-300 rounded-lg flex items-center justify-center">
          <Users />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <h2>Criar grupo</h2>

          <div>
            <Label required data-error={!!errors?.name}>Nome</Label>
            <Input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <Label required data-error={!!errors?.members}>Membros</Label>
            <SelectGroupMembers users={users} selectedMembers={members} onChange={setMembers} />
          </div>

          <button disabled={isFetching} className="border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-700 mt-2 rounded w-full bg-primary flex items-center justify-center py-1 text-white" type="button" onClick={onSubmit}>Criar</button>
        </div>
      </PopoverContent>
    </Popover>
  )
}