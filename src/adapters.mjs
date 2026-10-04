import { getJson, document } from "./io.mjs";
import { date, text } from "./index.mjs";
export function normalizeRge(
  rows,
  {
    source,
    date: at = new Date().toISOString().slice(0, 10),
    domainMap = {},
  } = {},
) {
  const qualifications = [],
    documents = [];
  for (const row of rows) {
    const id = "rge-" + (row._id ?? qualifications.length);
    const domainCode = domainMap[row.domaine] ?? row.domaine;
    text(domainCode);
    const from = date(row.lien_date_debut),
      to = date(row.lien_date_fin);
    qualifications.push({
      id,
      docId: id,
      siret: text(row.siret),
      domainCode,
      from,
      to,
      scope: row.domaine,
    });
    documents.push(
      document(
        id,
        JSON.stringify({
          siret: row.siret,
          domaine: row.domaine,
          nom_qualification: row.nom_qualification,
          lien_date_debut: from,
          lien_date_fin: to,
        }),
        {
          uri: source ?? "https://data.ademe.fr/datasets/historique-rge",
          date: at,
          kind: "donnee-publique",
          licence: "Licence Ouverte 2.0",
        },
      ),
    );
  }
  return { qualifications, documents };
}
export async function fetchRge(
  siret,
  { fetchImpl, signal, domainMap, maxPages = 10 } = {},
) {
  if (!/^\d{14}$/.test(siret)) throw new TypeError("SIRET invalide");
  if (!Number.isInteger(maxPages) || maxPages < 1 || maxPages > 100)
    throw new TypeError("maxPages invalide");
  const origin = "https://data.ademe.fr";
  let next = `${origin}/data-fair/api/v1/datasets/historique-rge/lines?size=100&qs=${encodeURIComponent('siret:"' + siret + '"')}`;
  const rows = [],
    seen = new Set();
  for (let n = 0; next && n < maxPages; n++) {
    const u = new URL(next);
    if (u.origin !== origin || !u.pathname.endsWith("/historique-rge/lines"))
      throw new TypeError("Pagination RGE inattendue");
    if (seen.has(next)) throw new TypeError("Boucle de pagination");
    seen.add(next);
    const d = await getJson(next, { fetchImpl, signal });
    if (!Array.isArray(d.results)) throw new TypeError("Réponse RGE invalide");
    rows.push(...d.results.filter((r) => r.siret === siret));
    next = d.next ?? null;
  }
  if (next) throw new RangeError("Pagination RGE incomplète");
  return normalizeRge(rows, { domainMap });
}
