import { Hono } from "hono";
import pg from "pg";

export function registerAddressesNearSchoolsRoute(
  app: Hono,
  postgresql: pg.Pool,
) {
  app.get("/api/addresses-near-schools", async (c) => {
    const result = await postgresql.query(`
      select
        m.adresseid,
        m.adressetekst,
        s.skolenavn,
        st_asgeojson(st_transform(m.representasjonspunkt, 4326))::json as geometry
      from matrikkelenadresse_cc504ff63b9645a9afb67997f5525d90.matrikkeladresse m
      join grunnskoler_e39212a4d48d4cf284c6f63f254a3d42.grunnskole s
        on st_dwithin(m.representasjonspunkt, s.posisjon, 100)
      order by m.adresseid
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
