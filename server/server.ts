import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

import { registerGrunnskolerRoute } from "./routes/grunnskoler";
import { registerAddressesNearSchoolsRoute } from "./routes/addresses-near-schools";
import { registerNearestSchoolRoute } from "./routes/nearest-school";

const postgresql = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost/postgres",
});

const app = new Hono();

registerGrunnskolerRoute(app, postgresql);
registerAddressesNearSchoolsRoute(app, postgresql);
registerNearestSchoolRoute(app, postgresql);

app.get("*", serveStatic({ root: "../dist" }));

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000,
});
