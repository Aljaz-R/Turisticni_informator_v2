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

app.get("/cities/:id", async (req,res,next)=>{
  try{
    const id = Number(req.params.id);
    if(!Number.isFinite(id)) return res.status(400).json({error:"invalid_city_id"});
    const { rows } = await db.query(
      "SELECT id,name,description,hero_url FROM cities WHERE id=$1",[id]
    );
    if(!rows.length) return res.status(404).json({error:"city_not_found"});
    res.json(rows[0]);
  }catch(e){ next(e); }
});

app.get("/cities/:id/images", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid_city_id" });
    const { rows } = await db.query(
      "SELECT url FROM city_images WHERE city_id=$1 ORDER BY sort_order, id",
      [id]
    );
    res.json(rows.map(r => r.url));
  } catch (e) { next(e); }
});
// GET /attractions?city_id=&type=&q=
app.get('/attractions', async (req,res,next)=>{
  try{
    const cityId = req.query.city_id ? Number(req.query.city_id) : undefined;
    const type = (req.query.type as string|undefined)?.trim();
    const q = (req.query.q as string|undefined)?.trim();
    const where:string[] = [];
    const vals:any[] = [];
    if (Number.isFinite(cityId)) { where.push(`city_id = $${vals.length+1}`); vals.push(cityId); }
    if (type) { where.push(`type ILIKE $${vals.length+1}`); vals.push(type); }
    if (q) { where.push(`(name ILIKE $${vals.length+1} OR description ILIKE $${vals.length+1})`); vals.push(`%${q}%`); }
    const sql =
      `SELECT id,city_id,name,type,thumbnail_url
       FROM attractions
       ${where.length?'WHERE '+where.join(' AND '):''}
       ORDER BY name`;
    const { rows } = await db.query(sql, vals);
    res.json(rows);
  }catch(e){ next(e); }
});

// GET /attractions/:id
app.get('/attractions/:id', async (req,res,next)=>{
  try{
    const id = Number(req.params.id);
    if(!Number.isFinite(id)) return res.status(400).json({error:'invalid_attraction_id'});
    const { rows } = await db.query(
      'SELECT id,city_id,name,type,description,hero_url,thumbnail_url,lat,lng FROM attractions WHERE id=$1',[id]
    );
    if(!rows.length) return res.status(404).json({error:'attraction_not_found'});
    res.json(rows[0]);
  }catch(e){ next(e); }
});


app.use((_err:any, _req:any, res:any, _next:any) => res.status(500).json({ error: "internal_error" }));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {});
export default app;
