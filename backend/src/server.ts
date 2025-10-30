import "dotenv/config";
import express from "express";
import { db } from "./db";

const app = express();
app.use(express.json());

app.get("/countries", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const sql = q
      ? { text: "SELECT id,code,name FROM countries WHERE name ILIKE $1 ORDER BY name", values: [`%${q}%`] }
      : { text: "SELECT id,code,name FROM countries ORDER BY name", values: [] };
    const { rows } = await db.query(sql);
    res.json(rows);
  } catch (e) { next(e); }
});

app.get("/countries/:id/cities", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid_country_id" });
    const exists = await db.query("SELECT 1 FROM countries WHERE id=$1", [id]);
    if (!exists.rowCount) return res.status(404).json({ error: "country_not_found" });
    const { rows } = await db.query(
      "SELECT id,name,thumbnail_url FROM cities WHERE country_id=$1 ORDER BY name", [id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

app.use((_err:any, _req:any, res:any, _next:any) => res.status(500).json({ error: "internal_error" }));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {});
export default app;
