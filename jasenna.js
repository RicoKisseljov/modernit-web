const TAPAHTUMAT = new Set(['VARAUS', 'PERUUTUS', 'HYLATTY']);

export function jasennaRivi(rivi) {
  const [aika, tapahtuma, tila, kayttaja, vali, ...syy] = rivi.trim().split(/\s+/);

  if (!TAPAHTUMAT.has(tapahtuma) || !tila || !kayttaja || !vali) {
    return null;
  }

  return { aika, tapahtuma, tila, kayttaja, vali, syy };
}

 const osat = AIKAVALI.exec(vali);
  if (!osat) {
    return null;
  }

  const [, paiva, ah, am, lh, lm] = osat;
  const minuutit = (Number(lh) * 60 + Number(lm)) - (Number(ah) * 60 + Number(am));

   return {
    aika, tapahtuma, tila, kayttaja, paiva, minuutit,
    syy: syy.join(' ') || null,
  };

  export function ohitettava(rivi) {
  const t = rivi.trim();
  return t === '' || t.startsWith('#');
}