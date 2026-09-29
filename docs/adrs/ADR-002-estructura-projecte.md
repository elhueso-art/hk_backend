# ADR-002: Estructura inicial del projecte

## Context

El projecte té una part frontend i una part backend que han de
treballar conjuntament.

## Decisió

Farem servir un monorepo amb les carpetes frontend i backend
dins del mateix repositori.

## Conseqüències

+ Tot el projecte està en un únic repositori.
+ És més fàcil gestionar els canvis del frontend i backend.
+ Facilita la coordinació entre les dues parts del projecte.
- El repositori pot créixer més ràpidament.