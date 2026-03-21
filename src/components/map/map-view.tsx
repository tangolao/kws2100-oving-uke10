import { useEffect, useRef } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import Overlay from "ol/Overlay";

import { createGrunnskolerLayer } from "../../layers/grunnskoler-layer";
import { fetchGrunnskoler } from "../../api/grunnskoler";

import { fetchAddressesNearSchools } from "../../api/addresses-near-schools";
import { createAddressesNearSchoolsLayer } from "../../layers/addresses-near-schools";

import { fetchNearestSchool } from "../../api/nearest-school";
import { createNearestSchoolLayer } from "../../layers/nearest-school-layer";

useGeographic();

export function MapView() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

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

    const popup = new Overlay({
      element: popupRef.current!,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -15],
    });

    map.addOverlay(popup);

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

    // Last inn adresser nær skoler ved oppstart
    async function loadAddressesNearSchools() {
      try {
        const data = await fetchAddressesNearSchools();
        const addressesLayer = createAddressesNearSchoolsLayer(data);
        map.addLayer(addressesLayer);
      } catch (error) {
        console.error(error);
      }
    }

    // Når brukeren klikker på kartet, finn nærmeste skole
    map.on("click", async (event) => {
      try {
        const [lon, lat] = event.coordinate as [number, number];
        const data = await fetchNearestSchool(lon, lat);

        if (nearestLayer) {
          map.removeLayer(nearestLayer);
        }

        nearestLayer = createNearestSchoolLayer(data);
        map.addLayer(nearestLayer);

        const feature = data.features?.[0];
        if (feature && popupRef.current) {
          const [popupLon, popupLat] = feature.geometry.coordinates;
          const skolenavn = feature.properties.skolenavn;
          const avstand = Math.round(feature.properties.avstand);

          popupRef.current.innerHTML = `
            <div>
              <strong>${skolenavn}</strong><br />
              Avstand: ${avstand} meter
            </div>
          `;
          popupRef.current.style.display = "block";
          popup.setPosition([popupLon, popupLat]);
        } else if (popupRef.current) {
          popupRef.current.style.display = "none";
        }
      } catch (error) {
        console.error(error);
      }
    });

    void loadGroundskeeper();
    void loadAddressesNearSchools();

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          minWidth: "160px",
          display: "none",
        }}
      />
    </>
  );
}
