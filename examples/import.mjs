import { readFile, mkdir, writeFile } from "node:fs/promises";
import { analyze, toHtml } from "../src/index.mjs";
const base = JSON.parse(
  await readFile(new URL("./dossier.json", import.meta.url), "utf8"),
);

import { normalizeRge } from "../src/adapters.mjs";
const data = normalizeRge(
  [
    {
      _id: "Q1",
      siret: base.siret,
      domaine: "Isolation des combles perdus",
      lien_date_debut: "2026-01-01",
      lien_date_fin: "2026-12-31",
      nom_qualification: "Qualification fictive",
    },
  ],
  {
    source: "fixture:ademe",
    domainMap: { "Isolation des combles perdus": "isolation_combles" },
  },
);
const dossier = {
  ...base,
  qualifications: data.qualifications,
  documents: [base.documents.find((d) => d.id === "a"), ...data.documents],
};

for (const d of dossier.documents) {
  d.source.kind = "synthetique";
  d.source.licence = "CC0";
  if (!d.source.uri.startsWith("fixture:")) d.source.uri = "fixture:" + d.id;
}
const report = await analyze(dossier);
await mkdir(new URL("../reports/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../reports/import.html", import.meta.url),
  toHtml(report),
);
console.log(
  JSON.stringify(
    {
      id: report.id,
      status: report.status,
      summary: report.summary,
      outputs: report.outputs,
    },
    null,
    2,
  ),
);
export { dossier, report };
