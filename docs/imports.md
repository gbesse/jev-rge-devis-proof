# Importer des données

`fetchRge(siret)` consulte l’API Data Fair ADEME, filtre à nouveau le SIRET, suit la pagination et échoue si elle reste incomplète. La période de qualification utilise `lien_date_debut` et `lien_date_fin`, distinctes des dates d’existence de la ligne. `domainMap` est une correspondance explicite entre libellé ADEME et domaine de devis ; sans mapping, le libellé ADEME est conservé. Les données ne sont pas copiées dans le corpus synthétique.

```sh
npm run demo:import
```

[Code complet de l’import](../examples/import.mjs). Ce parcours passe réellement du format source au rapport JSON/HTML. Les fichiers générés ne contiennent que des données synthétiques. Pour des documents réels confidentiels, écrire les rapports dans `reports/private/` (ignoré par Git), contrôler les droits de fichier et informer les personnes concernées avant un envoi externe.
