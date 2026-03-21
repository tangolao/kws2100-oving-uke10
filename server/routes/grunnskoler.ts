import { Hono } from "hono";
import pg from "pg";

export function registerGrunnskolerRoute(app: Hono, postgresql: pg.Pool) {
  app.get("/api/grunnskoler", async (c) => {
    const result = await postgresql.query(`
      select
        organisasjonsnummer,
        skolenavn,
        st_transform(posisjon, 4326)::json as geometry
      from grunnskoler_e39212a4d48d4cf284c6f63f254a3d42.grunnskole
    `);

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
