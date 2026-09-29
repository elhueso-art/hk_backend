# ADR-001: Elecció de base de dades

## Context

Necessitem una base de dades per emmagatzemar els usuaris,
productes, comandes i pagaments de la botiga online de pastissos
de Hello Kitty.

## Decisió

Farem servir MongoDB com a base de dades principal del projecte,
gestionada mitjançant Docker.

## Conseqüències

+ Flexibilitat per afegir nous camps als productes.
+ Bona integració amb Node.js i Express.
+ Fàcil d'executar mitjançant Docker.
- Les consultes amb moltes relacions poden ser més complexes.