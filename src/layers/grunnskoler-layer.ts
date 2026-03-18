import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";

export function createGrunnskolerLayer(data: any) {
  return new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(data),
    }),
  });
}
