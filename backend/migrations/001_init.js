exports.up = knex =>
  knex.schema
    .createTable("countries", t => {
      t.increments("id").primary();
      t.string("code",2).notNullable().unique();
      t.text("name").notNullable();
      t.index(["name"]);
    })
    .then(() => knex.schema.createTable("cities", t => {
      t.increments("id").primary();
      t.integer("country_id").notNullable().references("countries.id").onDelete("CASCADE");
      t.text("name").notNullable();
      t.text("thumbnail_url");
      t.index(["country_id"]);
    }));
exports.down = knex =>
  knex.schema.dropTableIfExists("cities")
    .then(() => knex.schema.dropTableIfExists("countries"));
