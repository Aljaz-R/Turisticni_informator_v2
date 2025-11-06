exports.up = k => k.schema.createTable("city_images", t=>{
  t.increments("id").primary();
  t.integer("city_id").notNullable().references("cities.id").onDelete("CASCADE");
  t.text("url").notNullable();
  t.integer("sort_order").notNullable().defaultTo(0);
  t.index(["city_id"]);
});
exports.down = k => k.schema.dropTableIfExists("city_images");
