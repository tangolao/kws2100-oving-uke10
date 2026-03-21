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
        featureProjection: "EPSG:3857",
      }),
    }),
    style: new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color: "red" }),
        stroke: new Stroke({ color: "white", width: 2 }),
      }),
    }),
    zIndex: 20,
  });
}
