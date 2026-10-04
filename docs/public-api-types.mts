import { analyze, toHtml, type Dossier, type Report } from "../src/index.mjs";
import { createJevClient } from "../src/jev.mjs";
import * as adapters from "../src/adapters.mjs";
const dossier: Dossier = {
  date: "2026-10-04",
  siret: "12345678900011",
  lines: [
    {
      id: "L1",
      docId: "a",
      domainCode: "isolation_combles",
      description: "Isolation thermique des combles perdus.",
    },
  ],
  qualifications: [
    {
      id: "Q1",
      docId: "b",
      siret: "12345678900011",
      domainCode: "isolation_combles",
      from: "2026-01-01",
      to: "2026-12-31",
      scope: "Pose d’isolant dans les combles non aménagés.",
    },
  ],
  id: "jev-rge-devis-proof-dev-paraphrase",
  documents: [
    {
      id: "a",
      text: 'dossier.lines.0 : {"id": "L1", "domainCode": "isolation_combles", "description": "Isolation thermique des combles perdus."}',
      source: {
        uri: "fixture:a",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
    {
      id: "b",
      text: 'dossier.qualifications.0 : {"id": "Q1", "siret": "12345678900011", "domainCode": "isolation_combles", "from": "2026-01-01", "to": "2026-12-31", "scope": "Pose d’isolant dans les combles non aménagés."}',
      source: {
        uri: "fixture:b",
        date: "2026-10-04",
        licence: "CC0",
        kind: "synthetique",
      },
    },
  ],
};
const report: Report = await analyze(dossier, {
  mode: "jev",
  provider: createJevClient({ apiKey: "exemple-de-type" }),
});
const html: string = toHtml(report);
void html;
void adapters;
// @ts-expect-error Un dossier vide ne respecte pas le contrat métier.
await analyze({ id: "incomplet", documents: [] });
