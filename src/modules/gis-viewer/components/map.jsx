import "ol/ol.css";
import React from "react";
import { FeatureDialog } from "./feature-dialog";

import { useMap } from "../contexts/map-context";

export function OlMap() {
  const { 
    mapRef
  } = useMap()
  const darkMode = "brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)"
  const darkModeHasAvailable = false // ['roadmap', 'osm'].includes(selectedLayer)

  return (
    <>
      <div 
        ref={mapRef}
        style={{ 
          width: "100%", 
          height: "100%",

          ...(darkModeHasAvailable && {
            filter: darkMode
          })
        }} 
      />
      <FeatureDialog />
    </>
  );
};