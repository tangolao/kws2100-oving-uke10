import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

export function createGrunnskolerLayer(data: any) {
  return new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      }),
    }),
    style: new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: "rgba(0, 123, 255, 0.7)" }),
        stroke: new Stroke({ color: "white", width: 1 }),
      }),
    }),
    zIndex: 10,
  });
}
