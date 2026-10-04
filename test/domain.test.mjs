import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyze } from "../src/index.mjs";
const base = JSON.parse(
  await readFile(new URL("../examples/dossier.json", import.meta.url), "utf8"),
);
const clone = structuredClone;

import { fetchRge, normalizeRge } from "../src/adapters.mjs";
test("Date de qualification distincte de l’historique de ligne", () => {
  const r = normalizeRge([
    {
      _id: "x",
      siret: base.siret,
      domaine: "Isolation",
      date_debut: "2026-10-01",
      date_fin: "2026-12-31",
      lien_date_debut: "2025-01-01",
      lien_date_fin: "2027-01-01",
    },
  ]);
  assert.equal(r.qualifications[0].from, "2025-01-01");
});
test("Une pagination inconnue ne conclut pas", async () => {
  await assert.rejects(
    fetchRge(base.siret, {
      maxPages: 1,
      fetchImpl: async () =>
        Response.json({
          results: [],
          next: "https://data.ademe.fr/data-fair/api/v1/datasets/historique-rge/lines?after=1",
        }),
    }),
    /incomplète/,
  );
});
test("Réponse d’un autre SIRET filtrée", async () => {
  const r = await fetchRge(base.siret, {
    fetchImpl: async () =>
      Response.json({ results: [{ siret: "00000000000000" }] }),
  });
  assert.equal(r.qualifications.length, 0);
});
