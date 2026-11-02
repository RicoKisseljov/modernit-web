
import fs from "node:fs/promises";
import path from "node:path";

export async function lueData(tiedosto) {
  const sisalto = await fs.readFile(tiedosto, "utf8");
  return JSON.parse(sisalto);
}

export async function kirjoitaData(tiedosto, data) {
  const valiaikainen = `${tiedosto}.tmp`;

  await fs.writeFile(
    valiaikainen,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  await fs.rename(valiaikainen, tiedosto);
}

let muutosjono = Promise.resolve();

export function jonotaMuutos(toiminto) {
  const tulos = muutosjono.then(toiminto);

  muutosjono = tulos.catch(() => {});

  return tulos;
}
