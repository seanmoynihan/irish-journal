const phrases = [
  // Rooms
  { irish: 'an chistin', english: 'the kitchen', pronunciation: 'un khish-tin' },
  { irish: 'an seomra suí', english: 'the living room', pronunciation: 'un showm-ra see' },
  { irish: 'an seomra leapa', english: 'the bedroom', pronunciation: 'un showm-ra lyap-a' },
  { irish: 'an seomra folctha', english: 'the bathroom', pronunciation: 'un showm-ra folk-ha' },
  { irish: 'an gairdín', english: 'the garden', pronunciation: 'un gar-deen' },
  { irish: 'an halla', english: 'the hallway', pronunciation: 'un hal-a' },

  // Furniture & fixtures
  { irish: 'an bord', english: 'the table', pronunciation: 'un bord' },
  { irish: 'an chathaoir', english: 'the chair', pronunciation: 'un kha-heer' },
  { irish: 'an leaba', english: 'the bed', pronunciation: 'un lyab-a' },
  { irish: 'an fhuinneog', english: 'the window', pronunciation: 'un in-yogue' },
  { irish: 'an doras', english: 'the door', pronunciation: 'un dur-as' },
  { irish: 'an teilifís', english: 'the television', pronunciation: 'un tel-ih-feesh' },
  { irish: 'an lampa', english: 'the lamp', pronunciation: 'un lam-pa' },
  { irish: 'an tolg', english: 'the sofa / couch', pronunciation: 'un tulog' },

  // Kitchen items
  { irish: 'an cuisneoir', english: 'the fridge', pronunciation: 'un kwish-nore' },
  { irish: 'an oigheann', english: 'the oven', pronunciation: 'un eye-an' },
  { irish: 'an citeal', english: 'the kettle', pronunciation: 'un kit-al' },
  { irish: 'an sconna', english: 'the tap / faucet', pronunciation: 'un skun-a' },
  { irish: 'an pota', english: 'the pot', pronunciation: 'un pot-a' },
  { irish: 'an cupán', english: 'the cup / mug', pronunciation: 'un kup-awn' },

  // Common commands & phrases
  { irish: 'Dún an doras', english: 'Close the door', pronunciation: 'Doon un dur-as' },
  { irish: 'Oscail an doras', english: 'Open the door', pronunciation: 'Us-kil un dur-as' },
  { irish: 'Cas as an solas', english: 'Turn off the light', pronunciation: 'Koss as un sul-as' },
  { irish: 'Cas air an solas', english: 'Turn on the light', pronunciation: 'Koss er un sul-as' },
  { irish: 'Tar isteach', english: 'Come in', pronunciation: 'Tar ish-tyakh' },
  { irish: 'Suigh síos', english: 'Sit down', pronunciation: 'Sig shees' },
  { irish: 'Seas suas', english: 'Stand up', pronunciation: 'Shas soo-as' },
  { irish: 'Déan deifir', english: 'Hurry up', pronunciation: 'Djane def-ir' },
  { irish: 'Tá an bia réidh', english: 'The food is ready', pronunciation: 'Taw un bee-a ray' },
  { irish: 'Ith do bhricfeasta', english: 'Eat your breakfast', pronunciation: 'Ih duh vrik-fast-a' },
  { irish: 'Ní miste liom', english: "I don't mind", pronunciation: 'Nee mish-te lyum' },
  { irish: 'Glanaigh do sheomra', english: 'Clean your room', pronunciation: 'Glan-ig duh howm-ra' },
];

let added = 0;
let skipped = 0;

for (const phrase of phrases) {
  const res = await fetch('http://localhost:3000/api/words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(phrase),
  });
  if (res.ok) {
    console.log(`✓ ${phrase.irish}`);
    added++;
  } else {
    console.log(`✗ ${phrase.irish} (${res.status})`);
    skipped++;
  }
}

console.log(`\nDone: ${added} added, ${skipped} failed`);
