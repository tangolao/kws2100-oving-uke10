import { Hono } from "hono";
import pg from "pg";

export function registerNearestSchoolRoute(app: Hono, postgresql: pg.Pool) {
  app.get("/api/nearest-school", async (c) => {
    const lon = Number(c.req.query("lon"));
    const lat = Number(c.req.query("lat"));

    if (Number.isNaN(lon) || Number.isNaN(lat)) {
      return c.json({ error: "Missing or invalid lon/lat" }, 400);
    }

    const result = await postgresql.query(
      `
        select
          s.skolenavn,
          st_distance(
            s.posisjon,
            st_transform(st_setsrid(st_makepoint($1, $2), 4326), 25833)
          ) as avstand,
          st_asgeojson(st_transform(s.posisjon, 4326))::json as geometry
        from grunnskoler_e39212a4d48d4cf284c6f63f254a3d42.grunnskole s
        order by s.posisjon <-> st_transform(st_setsrid(st_makepoint($1, $2), 4326), 25833)
          limit 1
      `,
      [lon, lat],
    );

    return c.json({
      type: "FeatureCollection",
      crs: { type: "name", properties: { name: "EPSG:4326" } },
      features: result.rows.map(({ geometry, ...properties }) => ({
        type: "Feature",
        geometry,
        properties,
      })),
    });
  });
}
