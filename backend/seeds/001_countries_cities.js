exports.seed = async function(knex){
  await knex("cities").del();
  await knex("countries").del();

  const countries = [
    {code:"SI", name:"Slovenija"},
    {code:"IT", name:"Italija"},
    {code:"AT", name:"Avstrija"}
  ];

  const ids = {};
  for (const c of countries){
    const [row] = await knex("countries").insert(c).returning(["id","code"]);
    ids[row.code] = row.id;
  }

  const cities = [
    {country_id: ids.SI, name:"Ljubljana", thumbnail_url:null},
    {country_id: ids.SI, name:"Maribor", thumbnail_url:null},
    {country_id: ids.IT, name:"Trst", thumbnail_url:null},
    {country_id: ids.AT, name:"Dunaj", thumbnail_url:null}
  ];
  await knex("cities").insert(cities);
};
