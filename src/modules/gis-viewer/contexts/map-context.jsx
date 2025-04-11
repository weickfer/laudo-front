import Map from "ol/Map";
import View from "ol/View";
import { MousePosition, ScaleLine, defaults as defaultControls } from "ol/control";
import { createStringXY } from "ol/coordinate";
import { click } from "ol/events/condition";
import { DragBox, Draw, Select } from "ol/interaction";
import { getArea, getLength } from "ol/sphere"; // Importa funções para calcular área e comprimento
import { createContext, useContext, useEffect, useRef, useState } from "react";

// import { useAnnotations } from "@inbimplus/annotations";
import { useRegisterFunction } from "../hooks/use-function";
import { LayerManager } from "../lib/ol/layer-manager";

const MapContext = createContext({})

export function MapProvider({ children }) {
  const [screenshotFunction, setScreenshotFunction] = useRegisterFunction()
  const layersManager = new LayerManager();
  const drawSource = useRef(layersManager.getDrawSource());
  const drawLayer = useRef(layersManager.getDrawLayer());

  // Estado inicial de configuração
  const [selectedLayer, setSelectedLayer] = useState("roadmap");
  const [drawType, setDrawType] = useState('')
  const [layers, setLayers] = useState({});
  const baseLayers = layersManager.getBaseLayers();
  baseLayers.push(drawLayer.current);

  // Referências para Mapa e Interações
  const mapRef = useRef();
  const mapInstance = useRef();
  const drawInteraction = useRef();
  const selectInteraction = useRef();
  const dragBoxInteraction = useRef();
  const measureInteraction = useRef();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [tempFeature, setTempFeature] = useState(null);

  useEffect(() => {
    setLayers(layersManager.getKeyLayers());

    // create map instance
    const map = new Map({
      target: mapRef.current,
      layers: baseLayers,
      view: new View({
        center: [-47.882777939356146, -15.793934129610017],
        zoom: 5,
        projection: "EPSG:4326",
      }),
      controls: defaultControls({
        zoom: false,
      })
    });
    mapInstance.current = map

    // Adicionar escala ao mapa
    const scaleLineControl = new ScaleLine({
      units: "metric",
      bar: true,
      steps: 4,
      text: true,
      minWidth: 100,
      target: document.getElementById('scale-line')
    });
    scaleLineControl.setMap(mapInstance.current);

    mapInstance.current.addControl(scaleLineControl);


    // Adicionar controle de posição do mouse ao mapa
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(8),
      projection: "EPSG:4326",
      className: "mouse-position",
      target: document.getElementById("mouse-position"),
      undefinedHTML: "&nbsp;",
    });
    mapInstance.current.addControl(mousePositionControl);

    setScreenshotFunction(async () => {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = map.getSize()[0];
      mapCanvas.height = map.getSize()[1];
      const mapContext = mapCanvas.getContext('2d');

      Array.from(document.querySelectorAll('.ol-layer canvas')).forEach(canvas => {
        mapContext.drawImage(canvas, 0, 0);
      });

      const dataUrl = mapCanvas.toDataURL('image/png');
      
      return dataUrl;
    })

    return () => {
      mapInstance.current.setTarget(null);
    };
  }, []);

  useEffect(() => {
    layersManager.setCurrBaseLayer(mapInstance.current, selectedLayer);
  }, [selectedLayer, layers]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && drawInteraction.current) {
        drawInteraction.current.abortDrawing();
      }
    };

    if (drawInteraction.current) {
      mapInstance.current.removeInteraction(drawInteraction.current);
    }

    if (
      drawType &&
      drawType !== "Select" &&
      drawType !== "SelectRectangle" &&
      drawType !== "Measure"
    ) {
      drawInteraction.current = new Draw({
        source: drawSource.current,
        type: drawType,
      });

      drawInteraction.current.on("drawend", (event) => {
        const feature = event.feature;
        const coordinates = feature.getGeometry().getCoordinates();
        console.log(coordinates);
        console.log(Array.isArray(coordinates[0]));

        let points = [];
        if (!Array.isArray(coordinates[0])) {
          points = [coordinates];
        } else if (coordinates.length > 1) {
          points = coordinates;
        } else {
          points = coordinates[0];
        }
        setCurrentPoints(points);
        setTempFeature(feature);
        setDialogOpen(true);
      });

      mapInstance.current.addInteraction(drawInteraction.current);
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (drawInteraction.current) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [drawType]);

  useEffect(() => {
    if (selectInteraction.current) {
      mapInstance.current.removeInteraction(selectInteraction.current);
    }
    if (dragBoxInteraction.current) {
      mapInstance.current.removeInteraction(dragBoxInteraction.current);
    }

    if (drawType === "Select") {
      selectInteraction.current = new Select({
        condition: click,
      });

      selectInteraction.current.on("select", (event) => {
        if (!event.mapBrowserEvent.originalEvent.shiftKey) {
          selectInteraction.current.getFeatures().clear();
        }
        event.selected.forEach((feature) => {
          if (
            !selectInteraction.current
              .getFeatures()
              .getArray()
              .includes(feature)
          ) {
            selectInteraction.current.getFeatures().push(feature);
          }
        });
      });

      mapInstance.current.addInteraction(selectInteraction.current);
    } else if (drawType === "SelectRectangle") {
      selectInteraction.current = new Select();
      mapInstance.current.addInteraction(selectInteraction.current);

      dragBoxInteraction.current = new DragBox();

      dragBoxInteraction.current.on("boxend", () => {
        const extent = dragBoxInteraction.current.getGeometry().getExtent();
        const selectedFeatures = selectInteraction.current.getFeatures();
        drawSource.current.forEachFeatureIntersectingExtent(
          extent,
          (feature) => {
            if (!selectedFeatures.getArray().includes(feature)) {
              selectedFeatures.push(feature);
            }
          }
        );
      });

      mapInstance.current.addInteraction(dragBoxInteraction.current);
    } else if (drawType === "Measure") {
      if (measureInteraction.current) {
        mapInstance.current.removeInteraction(measureInteraction.current);
      }
      measureInteraction.current = new Draw({
        source: drawSource.current,
        type: "LineString", // ou 'Polygon' dependendo do tipo de medição que você quer
      });

      measureInteraction.current.on("drawend", (event) => {
        const geometry = event.feature.getGeometry();
        const feature = event.feature;

        let output;
        if (geometry.getType() === "Polygon") {
          const area = getArea(geometry);
          output = `Area: ${area.toFixed(2)} square meters`;
        } else if (geometry.getType() === "LineString") {
          const length = getLength(geometry);
          output = `Length: ${length.toFixed(2)} meters`;
        }
        alert(output);
        drawSource.current.removeFeature(feature);
        drawSource.current.removeFeature(tempFeature);
      });

      mapInstance.current.addInteraction(measureInteraction.current);
    }
  }, [drawType]);

  // const enableSelect = () => {
  //   setDrawType("Select");
  // };

  // const enableSelectRectangle = () => {
  //   setDrawType("SelectRectangle");
  // };
  const toggleDrawSelect = () => {
    setDrawType(state => (
      state === 'Select' ? '' : 'Select'
    ))
  };

  const toggleDrawRectangle = () => {
    setDrawType(state => (
      state === 'SelectRectangle' ? '' : 'SelectRectangle'
    ))
  };


  const toggleDrawMeasure = () => {
    setDrawType(state => (
      state === 'Measure' ? '' : 'Measure'
    ))
  }

  const toggleDrawPoint = () => {
    setDrawType(state => (
      state === 'Point' ? '' : 'Point'
    ))
  }
  const toggleDrawLineString = () => {
    setDrawType(state => (
      state === 'LineString' ? '' : 'LineString'
    ))
  }
  const toggleDrawPolygon = () => {
    setDrawType(state => (
      state === 'Polygon' ? '' : 'Polygon'
    ))
  }

  const handleDialogClose = (shouldInclude) => {
    setDialogOpen(false);
    drawSource.current.removeFeature(tempFeature);
    if (shouldInclude) {
      drawSource.current.addFeature(tempFeature);
    }
    setTempFeature(null);
    setCurrentPoints([]);
  };

  const value = {
    // setDrawType,
    // enableMeasure,
    // enableSelectRectangle,
    // enableSelect,
    mapInstance,
    screenshotFunction,
    mapRef,
    dialogOpen,
    handleDialogClose,
    currentPoints,
    selectedLayer,
    setSelectedLayer,
    drawType,
    toggleDrawSelect,
    toggleDrawRectangle,
    toggleDrawMeasure,
    toggleDrawPoint,
    toggleDrawLineString,
    toggleDrawPolygon,
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}

export function useMap() {
  return useContext(MapContext)
}