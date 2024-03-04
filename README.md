# Webdev Showcase

Dit project staat deployed op Vercel
https://cv.bebore.com/

## Installatie
Om de applicatie te installeren heb je Node en Yarn nodig. Vervolgens kan je de applicatie installeren door...

```shell
yarn
```

...te draaien. Om vervolgens tests uit te voeren draai...

```shell
yarn test
```
Om de applicatie te draaien moeten eerst Postgres, SendGrid, ReCaptcha en GitHub OAuth2 ingesteld zijn, doormiddel van een .env file.

Nadat dit is gebeurt kan je de app starten met

```shell
yarn dev
```

## Documentatie

In de docs directory staan het technisch ontwerp en de user stories beschreven, een analyse voor testing en een analyse naar hoe hoog de verficatie niveau van onze app.

In de security directory staan de activiteiten die uitgevoerd zijn voor security en het ASVS scoring model.
