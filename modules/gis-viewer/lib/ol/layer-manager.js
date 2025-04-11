import { XYZ } from "ol/source";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import TileWMS from "ol/source/TileWMS";

export class LayerManager {
  constructor() {
    this.base_layers = [];
    this.org_layers = [];
    this.feact_layers = [];
    this.drawSource = new VectorSource();
    this.drawLayer = new VectorLayer({
      source: this.drawSource,
      title: "draw",
    });

    this.initializeLayers();
  }

  initializeLayers() {
    const roadLayer = new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyDv9tONOEg0imtjNV2g6TrE0udYcYVB3TU",
        crossOrigin: 'anonymous',
      }),
      visible: true,
      title: "roadmap",
    });

    const satelliteLayer = new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=AIzaSyDv9tONOEg0imtjNV2g6TrE0udYcYVB3TU",
        crossOrigin: 'anonymous'
      }),
      visible: false,
      title: "satellite",
    });

    const hybridLayer = new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=AIzaSyDv9tONOEg0imtjNV2g6TrE0udYcYVB3TU",
        crossOrigin: 'anonymous'
      }),
      visible: false,
      title: "hybrid",
    });

    const terrainLayer = new TileLayer({
      source: new XYZ({
        url: "https://mt1.google.com/vt/lyrs=t&x={x}&y={y}&z={z}&key=AIzaSyDv9tONOEg0imtjNV2g6TrE0udYcYVB3TU",
        crossOrigin: 'anonymous',
      }),
      visible: false,
      title: "terrain",
    });

    const osmLayer = new TileLayer({
      source: new OSM(),
      visible: false,
      title: "osm",
    });

    // adicionar URL do serviço WMS/WMTS
    const url_inpi1 =
      "https://terrabrasilis.dpi.inpe.br/geoserver/prodes-pantanal-nb/hydrography/ows";
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: url_inpi1,
      }),
      visible: false,
      // className: "wms",
      params: {
        LAYERS: "wms", // substitua pelo nome da camada
        TILED: true,
      },
      serverType: "mapserver", // ou 'mapserver', dependendo do seu servidor WMS
      transition: 0,
      title: "inp1",
    });

    this.base_layers = [roadLayer, satelliteLayer, hybridLayer, osmLayer];
    this.org_layers = [wmsLayer];
    this.feact_layers = [this.drawLayer];

    this.key_layer = {
      roadmap: roadLayer,
      satellite: satelliteLayer,
      hybrid: hybridLayer,
      terrain: terrainLayer,
      osm: osmLayer,
      wms: wmsLayer,
    };
  }

  getKeyLayers() {
    return Object.keys(this.key_layer);
  }

  // get all base layers
  getBaseLayers() {
    return this.base_layers;
  }

  getDrawLayer() {
    return this.drawLayer;
  }

  getDrawSource() {
    return this.drawSource;
  }

  // set the current base layer
  setCurrBaseLayer(curr_map, key) {
    var lyrList = curr_map.getLayers().getArray();

    for (const layer_ of lyrList) {
      var curr_title = layer_.get("title");
      if (curr_title === key || curr_title === "draw") {
        layer_.setVisible(true);
      } else {
        layer_.setVisible(false);
      }
    }
  }
}
