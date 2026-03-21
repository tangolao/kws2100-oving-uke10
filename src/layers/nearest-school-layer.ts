import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

export function createNearestSchoolLayer(data: any) {
  return new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      }),
    }),
    style: new Style({
      image: new CircleStyle({
        radius: 12,
        fill: new Fill({ color: "red" }),
        stroke: new Stroke({ color: "white", width: 3 }),
      }),
    }),
    zIndex: 999,
  });
}
