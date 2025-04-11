import { Circle, MoveRight, RectangleHorizontal, Trash2, Type } from "lucide-react";
import { useSidebar } from "../../contexts/sidebar";


function Button(props) {
  return (
    <button className="w-16 h-16 flex items-center justify-center hover:bg-gray-300 cursor-pointer text-gray-400 hover:text-primary data-[selected=true]:bg-gray-300 data-[selected=true]:text-primary" {...props} />
  )
}

export function Sidebar() {
  const [tool, toggleTool] = useSidebar()

  return (
    <>
      <Button onClick={() => toggleTool('circle')} data-selected={tool === 'circle'}>
        <Circle className="size-9" />
      </Button>
      <Button onClick={() => toggleTool('arrow')} data-selected={tool === 'arrow'}>
        <MoveRight className="size-9" />
      </Button>
      <Button onClick={() => toggleTool('rect')} data-selected={tool === 'rect'}>
        <RectangleHorizontal className="size-9" />
      </Button>
      <Button onClick={() => toggleTool('text')} data-selected={tool === 'text'}>
        <Type className="size-9" />
      </Button>
      <Button onClick={() => toggleTool('trash')} data-selected={tool === 'trash'}>
        <Trash2 className="size-9" />
      </Button>
    </>
  )
}