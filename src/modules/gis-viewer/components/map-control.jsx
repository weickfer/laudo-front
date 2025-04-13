import { Camera, Dot, GitBranch, MousePointer2, Spline, Square } from 'lucide-react'
import { useMap } from '../contexts/map-context'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const toolConfigs = {
  Point: {
    icon: <Dot className="size-8 text-secondary" />,
    onClickKey: 'toggleDrawPoint',
  },
  LineString: {
    icon: <Spline className="size-6 text-secondary" />,
    onClickKey: 'toggleDrawLineString',
  },
  Polygon: {
    icon: <GitBranch className="size-6 text-secondary" />,
    onClickKey: 'toggleDrawPolygon',
  },
  Select: {
    icon: <MousePointer2 className="size-6 text-secondary" />,
    onClickKey: 'toggleDrawSelect',
  },
  Rectangle: {
    icon: <Square className="size-6 text-secondary" />,
    onClickKey: 'toggleDrawRectangle',
  },
  Camera: {
    icon: <Camera className='size-6 text-secondary' />,
    onClickKey: 'handleCapture',
  }
}

export function MapControl({ enabledTools = ['Point', 'LineString', 'Polygon', 'Select', 'Rectangle'], onCapture }) {
  const {
    drawType,
    setSelectedLayer,
    toggleDrawPoint,
    toggleDrawLineString,
    toggleDrawPolygon,
    toggleDrawSelect,
    toggleDrawRectangle,
    mapInstance,
    screenshotFunction,
  } = useMap()

  const handleCapture = async () => {
    const imageUrl = await screenshotFunction()
    const [longitude, latitude] = mapInstance.current.getView().getCenter();

    onCapture({ imageUrl, coords: { latitude, longitude } })
  }

  const drawHandlers = {
    toggleDrawPoint,
    toggleDrawLineString,
    toggleDrawPolygon,
    toggleDrawSelect,
    toggleDrawRectangle,
    handleCapture,
  }

  return (
    <section className="ml-[260px] flex flex-row gap-3 w-[430px]">
      <Select onValueChange={(value) => setSelectedLayer(value)}>
        <SelectTrigger className="w-[180px] bg-foreground text-white">
          <SelectValue placeholder="Selecione o Layer" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="bg-foreground text-white">
            <SelectLabel>Maps</SelectLabel>
            <SelectItem value="roadmap">Google Street</SelectItem>
            <SelectItem value="satellite">Google Satélite</SelectItem>
            <SelectItem value="hybrid">Google Híbrido</SelectItem>
            <SelectItem value="osm">Open StreetMap</SelectItem>
            <SelectItem value="wms">INPE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="w-[250px] flex flex-row gap-0">
        {enabledTools.map((tool) => {
          const config = toolConfigs[tool]
          const isSelected = drawType === tool
          const handleClick = drawHandlers[config.onClickKey]

          return (
            <button
              key={tool}
              data-selected={isSelected}
              data-camera={config.onClickKey === 'handleCapture'}
              onClick={handleClick}
              className="bg-foreground size-9 data-[camera=true]:bg-green-500 data-[selected=true]:bg-stone-900 flex items-center justify-center"
            >
              {config.icon}
            </button>
          )
        })}
      </div>
    </section>
  )
}


// export function CaptureImage({ onClick }) {
//   const { screenshotFunction, mapInstance } = useMap()

//   const handleCapture = async () => {
//     const imageUrl = await screenshotFunction()
//     const [longitude, latitude] = mapInstance.current.getView().getCenter();

//     onClick({ imageUrl, coords: { latitude, longitude } })
//   }

//   return (
//     <button onClick={handleCapture} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
//       <Camera className="size-8 text-secondary" />
//     </button>
//   )
// }
