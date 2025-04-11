import { Camera, Dot, GitBranch, MousePointer2, Spline, Square } from 'lucide-react'
import { useMap } from '../contexts/map-context'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

export function MapControl() {
  const {
    drawType,
    setSelectedLayer,
    toggleDrawPoint,
    toggleDrawLineString,
    toggleDrawPolygon,
    toggleDrawSelect,
    toggleDrawRectangle,
    toggleDrawMeasure,
  } = useMap()

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
        <button data-selected={drawType === "Point"} onClick={toggleDrawPoint} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
          <Dot className="size-8 text-secondary" />
        </button>
        <button data-selected={drawType === "LineString"} onClick={toggleDrawLineString} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
          <Spline className="size-6 text-secondary" />
        </button>
        <button data-selected={drawType === "Polygon"} onClick={toggleDrawPolygon} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
          <GitBranch className="size-6 text-secondary" />
        </button>
        <button data-selected={drawType === "Select"} onClick={toggleDrawSelect} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
          <MousePointer2 className="size-6 text-secondary" />
        </button>
        <button data-selected={drawType === "Rectangle"} onClick={toggleDrawRectangle} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
          <Square className="size-6 text-secondary" />
        </button>
      </div>
    </section>
  )
}

export function CaptureImage({ onClick }) {
  const { screenshotFunction, mapInstance } = useMap()

  const handleClick = async () => {
    const imageUrl = await screenshotFunction()
    const [longitude, latitude] = mapInstance.current.getView().getCenter();

    onClick({ imageUrl, coords: { latitude, longitude } })
  }

  return (
    <button onClick={handleClick} className="bg-foreground size-9 data-[selected=true]:bg-stone-900 flex items-center justify-center">
      <Camera className="size-8 text-secondary" />
    </button>
  )
}
