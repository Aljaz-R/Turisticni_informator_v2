exports.seed = async k => {
  const cities = await k("cities").select("id","name");
  const byName = Object.fromEntries(cities.map(c=>[c.name, c.id]));
  const rows = [
    // Ljubljana (3 slike)
    { city_id: byName["Ljubljana"], url: "https://picsum.photos/seed/lj1/1200/800", sort_order: 0 },
    { city_id: byName["Ljubljana"], url: "https://picsum.photos/seed/lj2/1200/800", sort_order: 1 },
    { city_id: byName["Ljubljana"], url: "https://picsum.photos/seed/lj3/1200/800", sort_order: 2 },
    // Maribor
    { city_id: byName["Maribor"], url: "https://picsum.photos/seed/mb1/1200/800", sort_order: 0 },
    { city_id: byName["Maribor"], url: "https://picsum.photos/seed/mb2/1200/800", sort_order: 1 },
    { city_id: byName["Maribor"], url: "https://picsum.photos/seed/mb3/1200/800", sort_order: 2 },
    // Trst
    { city_id: byName["Trst"], url: "https://picsum.photos/seed/tr1/1200/800", sort_order: 0 },
    { city_id: byName["Trst"], url: "https://picsum.photos/seed/tr2/1200/800", sort_order: 1 },
    { city_id: byName["Trst"], url: "https://picsum.photos/seed/tr3/1200/800", sort_order: 2 },
    // Dunaj
    { city_id: byName["Dunaj"], url: "https://picsum.photos/seed/du1/1200/800", sort_order: 0 },
    { city_id: byName["Dunaj"], url: "https://picsum.photos/seed/du2/1200/800", sort_order: 1 },
    { city_id: byName["Dunaj"], url: "https://picsum.photos/seed/du3/1200/800", sort_order: 2 },
  ];
  await k("city_images").del();
  await k("city_images").insert(rows);
};
