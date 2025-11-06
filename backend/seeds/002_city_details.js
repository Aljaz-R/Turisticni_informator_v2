exports.seed = async (k) => {
  // Ljubljana
  await k('cities').where({ name: 'Ljubljana' }).update({
    description: 'Glavno mesto Slovenije ob reki Ljubljanici, znano po starem mestnem jedru in gradu.',
    hero_url: 'https://picsum.photos/seed/ljubljana-hero/1200/600',
    thumbnail_url: 'https://picsum.photos/seed/ljubljana-thumb/96/96'
  });

  // Maribor
  await k('cities').where({ name: 'Maribor' }).update({
    description: 'Drugo največje slovensko mesto ob reki Dravi, dom najstarejše trte na svetu.',
    hero_url: 'https://picsum.photos/seed/maribor-hero/1200/600',
    thumbnail_url: 'https://picsum.photos/seed/maribor-thumb/96/96'
  });

  // Trst
  await k('cities').where({ name: 'Trst' }).update({
    description: 'Severnoitalijansko pristaniško mesto z bogato habsburško arhitekturo in tržnico Piazza Unità.',
    hero_url: 'https://picsum.photos/seed/trst-hero/1200/600',
    thumbnail_url: 'https://picsum.photos/seed/trst-thumb/96/96'
  });

  // Dunaj
  await k('cities').where({ name: 'Dunaj' }).update({
    description: 'Prestolnica Avstrije, znana po muzejih, Operi in palačah Schönbrunn ter Hofburg.',
    hero_url: 'https://picsum.photos/seed/dunaj-hero/1200/600',
    thumbnail_url: 'https://picsum.photos/seed/dunaj-thumb/96/96'
  });
};
