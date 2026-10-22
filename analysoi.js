import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';



  const tila = (tilat[t.tila] ??= { varaukset: 0, peruutukset: 0, hylatyt: 0, minuutit: 0 });

  if (t.tapahtuma === 'VARAUS') {
    tila.varaukset++;
    tila.minuutit += t.minuutit;
  } else if (t.tapahtuma === 'PERUUTUS') {
    tila.peruutukset++;
    tila.minuutit -= t.minuutit;
  } else {
    tila.hylatyt++;
  }

// ... silmukan jälkeen:
console.log(tilat);

// VARAUS-haaraan:
varaajat[t.kayttaja] = (varaajat[t.kayttaja] ?? 0) + 1;

// hylkäyshaaraan:
syyt[t.syy ?? 'tuntematon'] = (syyt[t.syy ?? 'tuntematon'] ?? 0) + 1;

const aktiivisimmat = Object.entries(varaajat)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .slice(0, 3)
  .map(([nimi, maara]) => ({ nimi, maara }));

  export function analysoi(teksti) {
  const tilat = {};
  const syyt = {};
  const varaajat = {};
  const virheelliset = [];

  // ... silmukka ja aktiivisimmat kuten edellä ...

  return { tilat, hylkaysten_syyt: syyt, aktiivisimmat, virheelliset_rivit: virheelliset };
} 

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}