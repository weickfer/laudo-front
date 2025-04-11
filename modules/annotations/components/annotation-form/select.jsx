import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../../lib/utils";

export function ControlledSelect({ name, placeholder, children, className, readOnly }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      disabled={readOnly}
      render={({ field }) => {
        return (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger disabled={readOnly} ref={field.ref} className={cn("p-2 w-full border border-gray-300 rounded-md shadow-sm sm:text-sm", className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {children}
            </SelectContent>
          </Select>
        )
      }}
    />
  )
}