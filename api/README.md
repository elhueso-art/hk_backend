# API de la pastisseria

## Posada en marxa

1. Instal·la les dependències amb `npm install`.
2. Copia `.env.example` a `.env` i configura `MONGO_URI`.
3. Arrenca el servidor amb `npm run dev` o `npm start`.

Per defecte, l'API escolta al port `3000` i MongoDB fa servir la base de dades `pastisseria`.

## Productes

Els productes tenen nom, descripció, categoria, preu i estoc. El model també permet desar sabors, farcits, cobertures, ingredients, al·lèrgens, etiquetes dietètiques i imatges. Per a pastissos es poden definir porcions i mides amb preu i estoc propis. També es poden indicar si s'elaboren per encàrrec, si són personalitzables, si accepten un missatge i quants dies de preparació necessiten.

Les categories són registres de MongoDB, no valors fixos del producte. La càrrega local de mostra crea Pasteles, Cupcakes, Galletas, Bollería i Postres.

## Rutes

- `GET /api/products`: llista productes actius. Admet `category`, `q`, `preuMin`, `preuMax`, `destacat`, `page` i `limit`.
- `GET /api/products/:id`: consulta un producte.
- `POST /api/products`: crea un producte.
- `PUT /api/products/:id`: actualitza un producte.
- `PATCH /api/products/:id`: actualitza un producte.
- `DELETE /api/products/:id`: elimina un producte.
- Els productes fan servir `category` amb l'identificador d'una categoria; les respostes de lectura inclouen la categoria resolta amb `populate()`.
- Les operacions d'escriptura de productes i categories només s'accepten en local mentre no hi hagi autenticació i RBAC.

## Categories

El model de categoria desa `name`, `slug` únic, `description` i `active`. Si hi ha productes que la fan servir, l'API rebutja l'eliminació amb un conflicte.

- `POST /api/categories`: crea una categoria.
- `GET /api/categories`: llista categories; admet `?active=true` o `?active=false`.
- `GET /api/categories/:id`: consulta una categoria.
- `PUT /api/categories/:id`: actualitza `name`, `slug`, `description` i `active`.
- `DELETE /api/categories/:id`: elimina una categoria sense productes associats.

## Usuaris locals de prova

Els endpoints següents només funcionen des de localhost amb una URI MongoDB local i rebutgen connexions remotes o `NODE_ENV=production`. Fins que hi hagi JWT i RBAC, fes servir només dades fictícies i no publiquis aquests endpoints.

- `POST /api/users`: crea un usuari amb `name`, `email` i `password` (mínim 12 caràcters); el servidor assigna `role=client`.
- `GET /api/users` i `GET /api/users/:id`: consulten usuaris sense retornar hashes.
- `PUT /api/users/:id`: només permet `name`, `email`, `password` i `active`.
- `DELETE /api/users/:id`: fa una baixa lògica amb `active=false`.

Per provar-ho a Postman, fes servir només `http://localhost:3000/api/users` i dades fictícies. El cos de creació és:

```json
{
  "name": "Cliente de prueba",
  "email": "cliente@example.test",
  "password": "Pastel-de-prueba-2026"
}
```

El servidor no accepta `role` ni `passwordHash` del client; les respostes tampoc inclouen el hash.

## Dades de mostra i comprovació

Amb MongoDB local iniciat i `.env` apuntant a `localhost`, executa `npm run seed:bakery`. El script crea cinc categories de pastisseria i dos productes per categoria només si no existeixen, i després mostra cada producte amb la categoria carregada amb `populate()`.

Per provar-ho a Postman, importa la col·lecció `postman/ecommerce-api.postman_collection.json` i l'entorn `postman/ecommerce-local.postman_environment.json`; selecciona `Ecommerce Local` i inicia l'API amb `npm run dev`. Executa primer Categories, després Products i finalment Users. Les peticions inclouen comprovacions d'estat, JSON, slug i email duplicats, camps obligatoris, `populate()`, rol client i absència de `passwordHash`. Per crear un producte manualment, envia el `_id` d'una categoria al camp `category`:

```json
{
  "nom": "Pastel de cumpleaños",
  "preu": 32,
  "category": "OBJECT_ID_DE_LA_CATEGORIA",
  "sabors": ["chocolate"],
  "porcions": 8,
  "sotaComanda": true,
  "diesPreparacio": 2
}
```

En MongoDB Compass, abre la colección `productes` y revisa que `category` contenga un ObjectId de la colección `categories`. En `mongosh`, también puedes comprobar la relación con:

```javascript
db.productes.aggregate([
  { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "categoryInfo" } },
  { $project: { nom: 1, categoryInfo: { name: 1, slug: 1 } } }
])
```

Per a la resta de comprovacions a Compass:

- A `categories`, revisa `name`, `slug`, `active` i `updatedAt` després d'un PUT. A la pestanya d'índexs, comprova que `slug_1` sigui únic.
- A `users`, comprova que `passwordHash` estigui guardat i comenci per `$2b$`; no l'incloguis en captures. L'índex `email_1` ha de ser únic.
- Per revisar la baixa lògica, filtra `{ active: false }`; el document ha de continuar a `users`.
- Per fer captures sense exposar hashes, mostra només `name`, `role`, `active` i un booleà calculat `passwordHashPresent`, mai el valor del hash.

Exemple de producte:

```json
{
  "nom": "Pastís de xocolata",
  "descripcio": "Pa de pessic de xocolata amb ganache",
  "category": "OBJECT_ID_DE_LA_CATEGORIA",
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
