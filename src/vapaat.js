
function kellonaikaMinuuteiksi(aika) {
  const kellonaika = aika.includes("T")
    ? aika.slice(11, 16)
    : aika;

  const [tunnit, minuutit] = kellonaika.split(":").map(Number);

  if (
    !Number.isInteger(tunnit) ||
    !Number.isInteger(minuutit) ||
    tunnit < 0 ||
    tunnit > 23 ||
    minuutit < 0 ||
    minuutit > 59
  ) {
    throw new Error(`Virheellinen kellonaika: ${aika}`);
  }

  return tunnit * 60 + minuutit;
}

function minuutitKellonajaksi(minuutit) {
  const tunnit = Math.floor(minuutit / 60);
  const minuutitOsa = minuutit % 60;

  return (
    String(tunnit).padStart(2, "0") +
    ":" +
    String(minuutitOsa).padStart(2, "0")
  );
}

export function vapaatAjat(tila, varaukset, minimi = 30) {
  if (!Number.isFinite(minimi) || minimi < 0) {
    throw new Error("Minimiajan pitää olla vähintään 0");
  }

  const aukiAlku = kellonaikaMinuuteiksi(
    tila.aukiolo.alku
  );

  const aukiLoppu = kellonaikaMinuuteiksi(
    tila.aukiolo.loppu
  );

  if (aukiAlku >= aukiLoppu) {
    throw new Error("Virheellinen aukioloaika");
  }

  const ajat = varaukset.map(varaus => ({
    alku: kellonaikaMinuuteiksi(varaus.alku),
    loppu: kellonaikaMinuuteiksi(varaus.loppu)
  }));

  ajat.sort((a, b) => a.alku - b.alku);

  const yhdistetyt = [];

  for (const varaus of ajat) {
    const alku = Math.max(varaus.alku, aukiAlku);
    const loppu = Math.min(varaus.loppu, aukiLoppu);

    if (alku >= loppu) {
      continue;
    }

    const edellinen = yhdistetyt[yhdistetyt.length - 1];

    if (edellinen && alku <= edellinen.loppu) {
      edellinen.loppu = Math.max(edellinen.loppu, loppu);
    } else {
      yhdistetyt.push({ alku, loppu });
    }
  }

  const vapaat = [];
  let nykyinen = aukiAlku;

  for (const varaus of yhdistetyt) {
    if (varaus.alku > nykyinen) {
      const kesto = varaus.alku - nykyinen;

      if (kesto >= minimi) {
        vapaat.push({
          alku: minuutitKellonajaksi(nykyinen),
          loppu: minuutitKellonajaksi(varaus.alku),
          minuutit: kesto
        });
      }
    }

    nykyinen = Math.max(nykyinen, varaus.loppu);
  }

  if (aukiLoppu > nykyinen) {
    const kesto = aukiLoppu - nykyinen;

    if (kesto >= minimi) {
      vapaat.push({
        alku: minuutitKellonajaksi(nykyinen),
        loppu: minuutitKellonajaksi(aukiLoppu),
        minuutit: kesto
      });
    }
  }

  return vapaat;
}
