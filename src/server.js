
import { fileURLToPath } from "node:url";
import path from "node:path";
import { luoSovellus } from "./app.js";

const kansio = path.dirname(fileURLToPath(import.meta.url));

const tiedosto = process.env.VARAUKSET_TIEDOSTO ||
  path.join(kansio, "../data/varaukset.json");

const app = luoSovellus({ tiedosto });

const portti = process.env.PORT || 3000;

app.listen(portti, () => {
  console.log(`Palvelin käynnissä: http://localhost:${portti}`);
});
