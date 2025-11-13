exports.up = k => k.schema.createTable('attractions', t=>{
  t.increments('id').primary();
  t.integer('city_id').notNullable().references('cities.id').onDelete('CASCADE');
  t.text('name').notNullable();
  t.text('type').notNullable(); // "muzej","narava","spomenik","trznica"...
  t.text('description');
  t.text('hero_url');
  t.text('thumbnail_url');
  t.decimal('lat',10,6);
  t.decimal('lng',10,6);
  t.index(['city_id']);
  t.index(['type']);
  t.index(['name']);
});
exports.down = k => k.schema.dropTableIfExists('attractions');
