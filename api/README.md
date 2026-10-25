# API de la pastisseria

## Posada en marxa

1. Instal·la les dependències amb `npm install`.
2. Copia `.env.example` a `.env` i configura `MONGO_URI`.
3. Arrenca el servidor amb `npm run dev` o `npm start`.

Per defecte, l'API escolta al port `3000` i MongoDB fa servir la base de dades `pastisseria`.

## Productes

Els productes tenen nom, descripció, categoria, preu i estoc. El model també permet desar sabors, farcits, cobertures, ingredients, al·lèrgens, etiquetes dietètiques i imatges. Per a pastissos es poden definir porcions i mides amb preu i estoc propis. També es poden indicar si s'elaboren per encàrrec, si són personalitzables, si accepten un missatge i quants dies de preparació necessiten.

Categories admeses: `pastissos`, `cupcakes`, `galetes`, `brioixeria`, `postres` i `altres`.

## Rutes

- `GET /api/products`: llista productes actius. Admet `categoria`, `q`, `preuMin`, `preuMax`, `destacat`, `page` i `limit`.
- `GET /api/products/:id`: consulta un producte.
- `POST /api/products`: crea un producte.
- `PATCH /api/products/:id`: actualitza un producte.
- `DELETE /api/products/:id`: elimina un producte.

Exemple de producte:

```json
{
  "nom": "Pastís de xocolata",
  "descripcio": "Pa de pessic de xocolata amb ganache",
  "categoria": "pastissos",
  "preu": 28,
  "sabors": ["xocolata"],
  "farcits": ["ganache"],
  "alergens": ["gluten", "llet", "ou"],
  "mides": [
    { "nom": "Petit", "porcions": 6, "preu": 28, "stock": 2 },
    { "nom": "Gran", "porcions": 12, "preu": 45, "stock": 1 }
  ],
  "personalitzable": true,
  "acceptaMissatge": true,
  "sotaComanda": true,
  "diesPreparacio": 2,
  "imatges": []
}
```
