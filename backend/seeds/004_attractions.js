exports.seed = async k => {
  const cities = await k('cities').select('id','name');
  const idByName = Object.fromEntries(cities.map(c=>[c.name, c.id]));
  const rows = [
    { city_id:idByName['Ljubljana'], name:'Ljubljanski grad', type:'spomenik',
      description:'Grad nad mestom z razgledom.', hero_url:'https://picsum.photos/seed/lg-hero/1200/800',
      thumbnail_url:'https://picsum.photos/seed/lg-thumb/320/200', lat:46.048, lng:14.508 },
    { city_id:idByName['Ljubljana'], name:'Tromostovje', type:'spomenik',
      description:'Tri mostovi čez Ljubljanico.', hero_url:'https://picsum.photos/seed/trimo-hero/1200/800',
      thumbnail_url:'https://picsum.photos/seed/trimo-thumb/320/200', lat:46.051, lng:14.506 },

    { city_id:idByName['Maribor'], name:'Stara trta', type:'spomenik',
      description:'Najstarejša trta na svetu.', hero_url:'https://picsum.photos/seed/stara-hero/1200/800',
      thumbnail_url:'https://picsum.photos/seed/stara-thumb/320/200', lat:46.556, lng:15.646 },

    { city_id:idByName['Trst'], name:'Piazza Unità d\'Italia', type:'trg',
      description:'Glavni trg ob morju.', hero_url:'https://picsum.photos/seed/trieste-hero/1200/800',
      thumbnail_url:'https://picsum.photos/seed/trieste-thumb/320/200', lat:45.65, lng:13.77 },

    { city_id:idByName['Dunaj'], name:'Schönbrunn', type:'muzej',
      description:'Palača in vrtovi.', hero_url:'https://picsum.photos/seed/schon-hero/1200/800',
      thumbnail_url:'https://picsum.photos/seed/schon-thumb/320/200', lat:48.184, lng:16.312 }
  ];
  await k('attractions').del();
  await k('attractions').insert(rows);
};
