export function onPaallekkain(a, b) {
  return (
    a.alku < b.loppu &&
    a.loppu > b.alku
  );
}

export function validoiVaraus(varaus, tilat) {
  const tila = tilat.find(t => t.id === varaus.tilaId);

  if (!tila) {
    throw new Error("Tilaa ei löydy");
  }

  if (!varaus.alku || !varaus.loppu) {
    throw new Error("Varausajalta puuttuu tietoja");
  }

  if (varaus.alku >= varaus.loppu) {
    throw new Error("Virheellinen varausaika");
  }

  const alku = varaus.alku.slice(11, 16);
  const loppu = varaus.loppu.slice(11, 16);

  if (
    alku < tila.aukiolo.alku ||
    loppu > tila.aukiolo.loppu
  ) {
    throw new Error("Varaus on aukioloajan ulkopuolella");
  }

  return true;
}

export function paallekkaiset(varaus, varaukset) {
  return varaukset.filter(v =>
    v.tilaId === varaus.tilaId &&
    v.id !== varaus.id &&
    onPaallekkain(varaus, v)
  );
}