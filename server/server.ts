import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const postgresql = new pg.Pool({
  // user: "postgres",
  // host: "localhost",
  // database: "postgres",
  // port: 5432,
  // password: "postgres",
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost/postgres",
});

const app = new Hono();
// `serveStatic` makes Hono serve the output from `vite build`
app.get("/api/grunnskoler", async (c) => {
  const result = await postgresql.query(
    "select organisasjonsnummer, skolenavn, st_transform(posisjon, 4326)::json as geometry from grunnskoler_e39212a4d48d4cf284c6f63f254a3d42.grunnskole",
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
app.get("*", serveStatic({ root: "../dist" }));

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
