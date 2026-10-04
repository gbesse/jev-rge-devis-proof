import { text, list, cents, date, ref, check, pair } from "./index.mjs";

export function prepare(x) {
  text(x.siret);
  if (!/^\d{14}$/.test(x.siret))
    throw new TypeError("SIRET : 14 chiffres requis");
  const at = date(x.date);
  const lines = list(x.lines, "lines");
  const quals = Array.isArray(x.qualifications) ? x.qualifications : [];
  const checks = [],
    pairs = [],
    matrix = [];
  for (const l of lines) {
    text(l.id);
    text(l.domainCode);
    const candidates = quals.filter(
      (q) => q.siret === x.siret && q.domainCode === l.domainCode,
    );
    for (const q of candidates) {
      date(q.from);
      date(q.to);
      if (q.from > q.to) throw new TypeError("Période inversée");
    }
    const q =
      candidates.find((q) => q.from <= at && at <= q.to) ?? candidates[0];
    const refs = ref(l.docId, q?.docId);
    checks.push(
      check(
        l.id + "-entreprise",
        "Entreprise et domaine : " + l.id,
        q ? true : null,
        refs,
        "Obtenir la qualification correspondant au SIRET et au domaine exact.",
      ),
    );
    checks.push(
      check(
        l.id + "-periode",
        "Qualification valable à la date : " + l.id,
        q ? q.from <= at && at <= q.to : null,
        refs,
        "Vérifier la date pertinente et l’historique de qualification.",
      ),
    );
    pairs.push(
      pair(
        l.id + "-travaux",
        "Travaux couverts : " + l.id,
        l.description,
        q?.scope,
        refs,
        "Le passage de droite couvre-t-il explicitement les travaux décrits à gauche, sans étendre le domaine de qualification ?",
      ),
    );
    matrix.push({
      line: l.id,
      qualification: q?.id ?? null,
      date: at,
      domainCode: l.domainCode,
    });
  }
  return {
    checks,
    pairs,
    outputs: {
      matrix,
      limite:
        "La qualification ne prouve pas, à elle seule, l’éligibilité à une aide.",
    },
  };
}

function requiredDoc(o) {
  if (!o || typeof o !== "object") throw new TypeError("Objet métier requis");
  text(o.docId, "docId requis");
}
export function validateInput(x) {
  for (const l of list(x.lines, "lines")) requiredDoc(l);
  for (const q of x.qualifications ?? []) requiredDoc(q);
}
