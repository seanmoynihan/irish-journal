const phrases = [
  // General phrases
  { irish: 'Dia dhuit / Dia daoibh', english: 'Hello', notes: 'Dia dhuit = singular, Dia daoibh = plural' },
  { irish: 'Conas atá tú? / Cén chaoi a bhfuil tú?', english: 'How are you?', notes: 'Regional variations — Conas atá tú is more common in Connacht/Leinster, Cén chaoi a bhfuil tú in Munster' },
  { irish: 'Tá mé go maith / Tá mé go breá', english: 'I am well / good' },
  { irish: 'Níl mé go maith', english: 'I am not well' },
  { irish: 'Go raibh maith agat / Go raibh maith agaibh', english: 'Thank you', notes: 'Go raibh maith agat = singular, Go raibh maith agaibh = plural', pronunciation: 'Guh rev mah agut / agiv' },
  { irish: 'Más é do thoil é / Más é bhur dtoil é', english: 'Please', notes: 'Más é do thoil é = singular, Más é bhur dtoil é = plural', pronunciation: 'Maws ay duh hull ay' },
  { irish: 'Sea / Tá', english: 'Yes', notes: 'Sea is a general yes, Tá is used when answering "is" questions' },
  { irish: 'Ní hea / Níl', english: 'No', notes: 'Ní hea is a general no, Níl is used when answering "is" questions' },
  { irish: 'Gabh mo leithscéal', english: 'Excuse me', pronunciation: 'Gov muh lesh-kayl' },
  { irish: 'Maidin mhaith', english: 'Good morning', pronunciation: 'Mad-in wah' },
  { irish: 'Tráthnóna maith', english: 'Good evening', pronunciation: 'Traw-nona mah' },
  { irish: 'Oíche mhaith', english: 'Good night', pronunciation: 'Ee-ha wah' },
  { irish: 'Cad is ainm duit?', english: 'What is your name?', pronunciation: 'Kod is an-im dwit' },
  { irish: 'Is mise Person', english: 'My name is Person', notes: 'Replace "Person" with the actual name', pronunciation: 'Is mish-a...' },
  { irish: 'Fáilte', english: 'Welcome', pronunciation: 'Fawl-cha' },
  { irish: 'Slán (leat/libh)', english: 'Goodbye (when you are leaving)', notes: 'Slán leat = to one person, Slán libh = to a group', pronunciation: 'Slawn lyat / liv' },
  { irish: 'Beannacht (leat/libh)', english: 'Goodbye (when someone else is leaving)', notes: 'Said to the person who is leaving', pronunciation: 'Ban-akht lyat / liv' },
  { irish: 'Cé mhéad atá air?', english: 'How much does it cost?', pronunciation: 'Kay vayd ata er' },
  { irish: 'Cá bhfuil an áit?', english: 'Where is the place?', notes: 'Replace "áit" with the specific place name', pronunciation: 'Kaw will un awt' },
  { irish: 'Ní thuigim', english: "I don't understand", pronunciation: 'Nee hig-im' },
  { irish: 'Labhair go mall', english: 'Speak slowly', pronunciation: 'Low-ir guh mowl' },
  { irish: 'Cén t-am é?', english: 'What time is it?', pronunciation: 'Kayn tam ay' },
  { irish: 'Lá maith agat', english: 'Have a nice day', pronunciation: 'Law mah agut' },
  { irish: 'Sláinte!', english: 'Cheers! / Good health!', pronunciation: 'Slawn-cha' },
  { irish: 'Tá grá agam duit', english: 'I love you', pronunciation: 'Taw graw agum dwit' },
  { irish: 'Breithlá sona duit', english: 'Happy Birthday', pronunciation: 'Breh-law sun-a dwit' },
  { irish: 'Nollaig Shona duit', english: 'Merry Christmas', pronunciation: 'Null-ig hun-a dwit' },
  { irish: 'Athbhliain faoi mhaise duit', english: 'Happy New Year', pronunciation: 'Ah-vlee-in fwee vash-a dwit' },

  // Around the house (with kids)
  { irish: 'Cuir ort do bhróga', english: 'Put on your shoes', pronunciation: 'Kwir urt duh vroe-ga' },
  { irish: 'Cá bhfuil do chóta?', english: 'Where is your coat?', pronunciation: 'Kaw will duh khoe-ta' },
  { irish: 'Gheobhaidh mé bainne duit', english: 'I will get you milk', pronunciation: 'Yoe-ig may ban-ya dwit' },
  { irish: 'Casfaidh mé an teilifís duit', english: 'I will turn on the TV for you', pronunciation: 'Kas-hig may un tel-ih-feesh dwit' },

  // Kids phrases
  { irish: 'An bhfuil ocras ort?', english: 'Are you hungry?', pronunciation: 'Un will uk-rus urt' },
  { irish: 'Am don leaba', english: 'Time for bed', pronunciation: 'Om dun lyab-a' },
  { irish: 'Scuab do chuid fiacla', english: 'Brush your teeth', pronunciation: 'Skoo-ab duh kwid fee-ak-la' },
  { irish: 'Téimis amach', english: "Let's go outside", pronunciation: 'Chay-mish a-mokh' },
  { irish: 'Abair "más é do thoil é"', english: 'Say please', pronunciation: 'Ab-ir maws ay duh hull ay' },
  { irish: 'Abair "go raibh maith agat"', english: 'Say thank you', pronunciation: 'Ab-ir guh rev mah agut' },
  { irish: 'Tar anseo', english: 'Come here', pronunciation: 'Tar an-shuh' },
  { irish: 'Tabhair barróg dom', english: 'Give me a hug', pronunciation: 'Toor ba-rogue dum' },
];

let added = 0;
let failed = 0;

for (const phrase of phrases) {
  const res = await fetch('http://localhost:3000/api/words', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(phrase),
  });
  if (res.ok) {
    console.log(`✓ ${phrase.english}`);
    added++;
  } else {
    console.log(`✗ ${phrase.english} (${res.status})`);
    failed++;
  }
}

console.log(`\nDone: ${added} added, ${failed} failed`);
