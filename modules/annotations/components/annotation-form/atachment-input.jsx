import { Plus } from "lucide-react";
import { useRef } from "react";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu";

export function AttachmentInput({ onAddAttachment, screenshotFunction }) {
  const inputRef = useRef()
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
    <>
      <input
        ref={inputRef}
        id="fileUpload"
        type="file"
        accept="image/*"
        onChange={onAddAttachment}
        className="hidden" 
      />
      {
        screenshotFunction ? (
          <ContextMenu>
            <ContextMenuTrigger onClick={handleLeftClick}>
              <div ref={divRef} className="flex items-center justify-center size-14 rounded-sm border border-gray-300 text-gray-300 cursor-pointer">
                <Plus className="size-10" />
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => inputRef?.current?.click()}>Buscar em arquivos</ContextMenuItem>
              <ContextMenuItem onClick={onAddAttachment}>Capturar Viewpoint</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          <div className="flex items-center justify-center size-14 rounded-sm border border-gray-300 text-gray-300 cursor-pointer">
            <label
              htmlFor="fileUpload"
              className="cursor-pointer"
            >
              <Plus className="size-10" />
            </label>
            
          </div>
        )
      }
    </>
  )
}