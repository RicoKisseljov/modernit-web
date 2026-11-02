
import express from "express";

import {
  lueData,
  kirjoitaData,
  jonotaMuutos
} from "./tallennus.js";

import {
  validoiVaraus,
  paallekkaiset
} from "./varaukset.js";

export function luoSovellus({ tiedosto }) {
  const app = express();

  app.use(express.json());

  app.get("/api/tilat", async (req, res, next) => {
    try {
      const data = await lueData(tiedosto);
      res.json(data.tilat);
    } catch (virhe) {
      next(virhe);
    }
  });

  app.get("/api/varaukset", async (req, res, next) => {
    try {
      const data = await lueData(tiedosto);
      res.json(data.varaukset);
    } catch (virhe) {
      next(virhe);
    }
  });

  app.post("/api/varaukset", async (req, res, next) => {
    try {
      const uusi = await jonotaMuutos(async () => {
        const data = await lueData(tiedosto);

        validoiVaraus(req.body, data.tilat);

        const osumat = paallekkaiset(
          req.body,
          data.varaukset
        );

        if (osumat.length > 0) {
          const virhe = new Error("Varaus menee päällekkäin");
          virhe.status = 409;
          throw virhe;
        }

        const varaus = {
          id: crypto.randomUUID(),
          ...req.body
        };

        data.varaukset.push(varaus);

        await kirjoitaData(tiedosto, data);

        return varaus;
      });

      res.status(201).json(uusi);
    } catch (virhe) {
      next(virhe);
    }
  });

  app.delete("/api/varaukset/:id", async (req, res, next) => {
    try {
      await jonotaMuutos(async () => {
        const data = await lueData(tiedosto);

        const indeksi = data.varaukset.findIndex(
          v => v.id === req.params.id
        );

        if (indeksi === -1) {
          const virhe = new Error("Varausta ei löydy");
          virhe.status = 404;
          throw virhe;
        }

        data.varaukset.splice(indeksi, 1);

        await kirjoitaData(tiedosto, data);
      });

      res.status(204).end();
    } catch (virhe) {
      next(virhe);
    }
  });

  app.use((req, res, next) => {
    const virhe = new Error("Osoitetta ei löydy");
    virhe.status = 404;
    next(virhe);
  });

  app.use((virhe, req, res, next) => {
    const status = virhe.status || 400;

    res.status(status).json({
      virhe: virhe.message
    });
  });

  return app;
}
