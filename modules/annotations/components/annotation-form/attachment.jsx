import { Settings2 } from "lucide-react";
import { useRef } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

export function Attachment({ url, onRemove, onEdit, onView }) {
  const divRef = useRef()

  const handleLeftClick = (e) => {
    e.preventDefault(); // Evitar o comportamento padrão do clique esquerdo
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: e.clientX,
      clientY: e.clientY,
    });

    // Disparar o evento "contextmenu" (que seria equivalente ao clique direito)
    divRef.current.dispatchEvent(event);
  };


  return (
    <ContextMenu>
      <ContextMenuTrigger onClick={handleLeftClick}>
        <div
        ref={divRef}
        // src={attachment}
        className={`
          group size-14 rounded-sm border border-gray-300 text-gray-500 cursor-pointer
          flex items-center justify-center
          relative
        `} 

      >
        <img src={url} className="absolute inset-0 w-full h-full object-cover" />
        <div className="z-50 bg-white rounded-full size-9 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <Settings2 className="size-5 m-auto" />
        </div>
      </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {
          (onEdit) && <ContextMenuItem onClick={onEdit}>Editar</ContextMenuItem>
        }
        {
          onView && <ContextMenuItem onClick={onView}>Visualizar</ContextMenuItem>
        }
        {
          onRemove && <ContextMenuItem onClick={onRemove}>Deletar</ContextMenuItem>
        }
      </ContextMenuContent>
    </ContextMenu>
    
  )
}