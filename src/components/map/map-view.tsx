import { useEffect, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { createGrunnskolerLayer } from "../../layers/grunnskoler-layer";
import { fetchGrunnskoler } from "../../api/grunnskoler";
import Map from "ol/Map";
import View from "ol/View";

useGeographic();
export function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new Map({
      target: mapRef.current!,
      view: new View({
        center: [10.7, 59.9],
        zoom: 12,
      }),
      layers: [new TileLayer({ source: new OSM() })],
    });
    async function loadGroundskeeper() {
      try {
        const data = await fetchGrunnskoler();
        const groundskeeperLayer = createGrunnskolerLayer(data);
        map.addLayer(groundskeeperLayer);
      } catch (error) {
        console.error(error);
      }
    }

    void loadGroundskeeper();

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
}
