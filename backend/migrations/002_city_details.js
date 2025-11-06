// migrations/002_city_details.js
exports.up = k => k.schema.alterTable('cities', t=>{
  t.text('description');
  t.text('hero_url');
});
exports.down = k => k.schema.alterTable('cities', t=>{
  t.dropColumn('description'); t.dropColumn('hero_url');
});
