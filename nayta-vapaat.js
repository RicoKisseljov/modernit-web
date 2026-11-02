
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { vapaatAjat } from "./src/vapaat.js";

const kansio = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);

  const paiva = args[0];

  if (!paiva) {
    console.log(
      "Käyttö: node nayta-vapaat.js YYYY-MM-DD [tila] --minimi 60"
    );
    process.exitCode = 1;
    return;
  }

  const tilaId = args[1]?.startsWith("--")
    ? undefined
    : args[1];

  const minimiIndeksi = args.indexOf("--minimi");

  const minimi = minimiIndeksi !== -1
    ? Number(args[minimiIndeksi + 1])
    : 30;

  if (!Number.isInteger(minimi) || minimi < 0) {
    throw new Error("Virheellinen minimiaika");
  }

  const tiedosto = process.env.VARAUKSET_TIEDOSTO ||
    path.join(kansio, "data", "varaukset.json");

  const data = JSON.parse(
    await fs.readFile(tiedosto, "utf8")
  );

  const tilat = tilaId
    ? data.tilat.filter(t => t.id === tilaId)
    : data.tilat;

  if (tilaId && tilat.length === 0) {
    console.log(`Tilaa ${tilaId} ei löydy.`);
    process.exitCode = 1;
    return;
  }

  for (const tila of tilat) {
    const varaukset = data.varaukset.filter(v =>
      v.tilaId === tila.id &&
      v.alku.slice(0, 10) === paiva
    );

    const vapaat = vapaatAjat(tila, varaukset, minimi);

    console.log(`\n${tila.id} - ${tila.nimi}`);

    if (vapaat.length === 0) {
      console.log("Ei käyttökelpoisia vapaita aikoja.");
      continue;
    }

    for (const aika of vapaat) {
      console.log(
        `${aika.alku}–${aika.loppu} (${aika.minuutit} min)`
      );
    }
  }
}

main().catch(virhe => {
  console.error("Virhe:", virhe.message);
  process.exitCode = 1;
});
