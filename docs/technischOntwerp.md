# Technisch Ontwerp

## Inleiding

In dit document wordt er beschreven hoe de applicatie is opgebouwd, welke tooling er wordt gebruikt en van welke externe services gebruik wordt gemaakt.

## Systeem Context

![Systeem Context diagram](./images/System%20Context%20diagram.drawio.svg)

Het Webdev CV software systeem wordt bezocht en gebruikt door de een bezoeker. Een bezoeker kan ingelogd zijn, wanneer dit gebeurt wordt de bezoeker een gebruiker. Een gebruiker kan een bepaalde rol hebben zoals moderator of admin, die bepaalt welke rechten de gebruiker heeft. Een admin wordt als moderator beschouwd, maar niet andersom.

Het systeem maakt gebruik van twee externe services, dit zijn GitHub en SendGrid.

### GitHub

GitHub wordt gebruikt voor het authorizeren van gebruikers die gebruik willen maken van pagina's waarvoor je ingelogd moet zijn. Dit wordt gedaan door middel van OAuth2. Dit wordt in het NextAuth hoofdstuk verder uitgelegd.

### SendGrid

SendGrid wordt gebruikt om e-mails te versturen. SendGrid wordt gebruikt voor de Contact pagina zodat gebruikers contact kunnen zoeken met de ontwikkelaar van de applicatie. Hoe deze communicatie tot stand wordt gebracht wordt later uitgelegd.

## Het systeem

![Container diagram](./images/Container%20diagram.drawio.svg)

Het systeem is opgebouwd uit verschillende interne en externe onderdelen, elk onderdeel heeft een eigen functie. De onderdelen zijn:

* NextJS - Dient de pagina's voor aan de gebruiker en speelt API calls door naar tRPC
* SPA - Single Page Application die NextJS serveert
* tRPC server - Router voor de API calls
* NextAuth - Beheert de inlog en sessie functionaliteit
* Prisma - ORM voor de database
* Webdev CV database - Slaat de data op
* SendGrid - Verstuurt e-mails (extern)
* GitHub - Authorizeren van gebruikers (extern)

De combinatie van NextJS, tRPC, NextAuth, Prisma komt voort uit de T3 Stack. De T3 Stack is een volledige starter kit voor NextJS. Het levert een volledige "type-safe" ontwikkel omgeving. Al is T3 Stack een starter pack, het heeft ook een [eigen website](https://create.t3.gg/en/introduction) met aanvullende documentatie over de verschillende onderdelen waaruit de stack bestaat.

### NextJS
NextJS is een framework voor React. We gebruiken NextJS voor het statisch genereren van de pagina's en het serveren van de pagina's aan de gebruiker. NextJS wordt ook gebruikt voor het serveren van de API calls, dit wordt gedaan door middel van tRPC. NextJS maakt gebruik van file based routing. De verschillende pagina's staan in de pages map. Hoe de pages map werkt is uitgewerkt door NextJS in de [NextJS docs](https://nextjs.org/docs/routing/introduction). API calls worden gedaan door middel van de API map. Hoe de API map werkt is uitgewerkt door NextJS in de [NextJS docs](https://nextjs.org/docs/api-routes/introduction). In de API map staan de handlers voor NextAuth en tRPC. De handlers worden gebruikt om de API calls te routeren naar de juiste functie.

### tRPC server


### SPA

De SPA's worden gegenereerd door NextJS. NextJS doet dit doormiddel van de pagina's die gedefineerd staan in de pages map. NextJS vormt React code om naar statische HTML pagina's. Deze pagina's worden vervolgens door NextJS geserveerd aan de gebruiker. 

