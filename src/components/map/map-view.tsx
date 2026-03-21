import { useEffect, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";

import { createGrunnskolerLayer } from "../../layers/grunnskoler-layer";
import { fetchGrunnskoler } from "../../api/grunnskoler";

import { fetchNearestSchool } from "../../api/nearest-school";
import { createNearestSchoolLayer } from "../../layers/nearest-school-layer";

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

    let nearestLayer: VectorLayer | null = null;

    // Last inn alle grunnskoler ved oppstart
    async function loadGroundskeeper() {
      try {
        const data = await fetchGrunnskoler();
        const groundskeeperLayer = createGrunnskolerLayer(data);
        map.addLayer(groundskeeperLayer);
      } catch (error) {
        console.error(error);
      }
    }

    // Når brukeren klikker på kartet, finn nærmeste skole
    map.on("click", async (event) => {
      try {
        const [lon, lat] = event.coordinate as [number, number];
        console.log("clicked:", lon, lat);

        const data = await fetchNearestSchool(lon, lat);
        if (nearestLayer) {
          map.removeLayer(nearestLayer);
        }
        console.log("nearest data:", data);

        // Opprett og legg til nytt layer for nærmeste skole
        nearestLayer = createNearestSchoolLayer(data);
        map.addLayer(nearestLayer);
      } catch (error) {
        console.error(error);
      }
    });

    void loadGroundskeeper();

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
}
