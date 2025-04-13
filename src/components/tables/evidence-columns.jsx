import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns = [
  // {
  //   accessorKey: "imageName",
  //   header: "Nome da imagem",
  // },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "environment",
    header: "Ambiente",
  },
  {
    accessorKey: "location",
    header: "Local",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("date");

      if (!value) return "-";

      const date = new Date(value);
      return new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    },
  },
]
