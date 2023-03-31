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
* SPA (de client) - Single Page Application die NextJS serveert
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

De showcase app maakt gebruik van tRPC. tRPC is een package om typesafe end-to-end API's te maken. tRPC maakt gebruik van Typescript zodat je aan de server kant een API route kan maken, waarna de type-definitie ook beschikbaar is aan de client kant. Wat tRPC veilig maakt is dat voor elke route waar input voor nodig is (denk aan een userId), die input wordt gecontrolleerd door een [Zod schema](https://zod.dev). Dit maakt voor een veilige, onderhoudbare en snelle developer experience. tRPC heeft NextJS als first class citizen. tRPC biedt de client kant een api client aan die binnen de React components gebruikt kan worden om data op te halen. Dit wordt verder uitgelegd in het hoofdstuk over de SPA. tRPC heeft een [eigen website](https://trpc.io/) met aanvullende documentatie.

#### Procedures

Om de api veilig te houden en ervoor te zorgen dat bepaalde gebruikers geen calls kunnen maken naar bepaalde API routes, worden er procedures gebruikt. Een procedure is een soort middleware dat draait voordat de volledige functie gedraaid wordt. Procedures worden gebruikt om te controleren of de gebruiker ingelogd is, of de gebruiker de juiste rechten heeft om de API call te maken. Procedures worden gebruikt om de API calls te beveiligen. Procedures worden uitgelegd in de [tRPC docs](https://trpc.io/docs/procedures). De procedures staan gedefinieerd in [/src/server/api/trpc.ts](/src/server/api/trpc.ts). tRPC krijgt de session informatie door NextAuth doorgespeeld en in de context voor de call gezet. Ook wordt de Prisma ORM wordt doorgespeeld in deze context. 

De API is onderverdeeld in verschillende routers. Elke router heeft zijn eigen functie. Bijvoorbeeld de Reversi router zorgt ervoor dat de juiste logica wordt aangeroepen voor de game en dat de data op de juiste plek terecht komt. De users router is verantwoordelijk voor de functies om gebruikers op te halen en te bewerken. De verschillende routers staan gedefineerd in /src/server/api/routers.

### NextAuth
NextAuth verzorgt het inloggen en de sessie beheer van de app. NextAuth maakt gebruik van CSRF tokens om het mogelijk te maken voor gebruikers om veilig in te kunnen loggen. NextAuth ondersteund sessie beheer met JWT, maar wij maken gebruik van database sessies. NextAuth ondersteund tientallen services om mee in te kunnen loggen, dit gaat doormiddel van Providers. Wij maken gebruik van de GitHub provider zodat gebruikers kunnen inloggen met hun GitHub account. Welke data er gedeeld wordt met de client wordt bepaald in /src/server/auth.ts. Belangrijke events, bijvoorbeeld het registreren van nieuwe gebruikes en het inloggen van gebruikers worden gelogt. NextAuth heeft een [eigen website](https://next-auth.js.org/) met aanvullende documentatie.

### SPA (de client)

De SPA's worden gegenereerd door NextJS. NextJS doet dit doormiddel van de pagina's die gedefineerd staan in de pages map. NextJS vormt React code om naar statische HTML pagina's. Deze pagina's worden vervolgens door NextJS geserveerd aan de gebruiker. Wanneer de pagina laadt, neemt React het weer over.

De client maakt gebruik van Tailwind CSS, tRPC client, NextAuth, HeadlessUI, en React Hook Form.

#### Tailwind CSS

Tailwind CSS is een CSS framework. Het bied een aantal utility klassen die je kan combineren om je pagina te stijlen. Tailwind bied niet zoals Bootstrap volledige componenten, maar het bied klassen aan die je kan gebruiken om je eigen componenten te stijlen. Tailwind maakt gebruik van JIT compiling, dit betekent dat alleen de klassen die je nodig bent aanwezig zijn op een pagina en het is mogelijk om on the fly klassen te genereren. Tailwind CSS heeft een [eigen website](https://tailwindcss.com/) met aanvullende documentatie.

#### tRPC client

De tRPC client wordt gebruikt om calls te maken naar de API binnen de app. tRPC geeft ons hiervoor een hook dat gebruik maakt van [React Query](https://react-query.tanstack.com/). React Query is een library om data te fetchen van een API en te cachen. React Query zorgt er ook voor dat wanneer de data "stale" is, de data opnieuw wordt opgehaald.

Doordat de tRPC client gebruik maakt van de type definitions die gedefineerd zijn op de server kan de developer gelijk zien wat de vorm is van de data die naar de server gestuurd wordt en de response. Wanneer je op de server een validatie schema veranderd en je past niks aan bij de client, dan zal je gelijk een type definitie error krijgen. Dit zorgt voor een veilige en onderhoudbare developer experience.

Elke route die de router vrijgeeft wordt automatisch een hook. Voor verschillende routes worden andere hooks gemaakt. Wanneer een route bijvoorbeeld data veranderd op de server wordt dit gedaan met een [mutation](https://trpc.io/docs/reactjs/usemutation). Wanneer een route alleen data ophaalt wordt dit gedaan met een [query](https://trpc.io/docs/reactjs/usequery).

#### NextAuth

NextAuth wordt gebruikt om de gebruiker in te laten loggen en om de gebruiker te authenticeren. NextAuth maakt gebruik van een [React hook](https://next-auth.js.org/getting-started/client#use-session) om de sessie informatie te verkrijgen. Deze sessie data wordt gebruikt om je eigen gebruiker te laten zien, en om ervoor te zorgen dat er een melding komt dat de gebruiker zich niet op bepaalde pagina's kan bevinden. De gebruiker wordt naar juiste login pagina doorgestuurd door signIn("github") te callen. NextAuth heeft een [eigen website](https://next-auth.js.org/) met aanvullende documentatie.

#### HeadlessUI

HeadlessUI is een React component library. HeadlessUI bied componenten aan zoals een dropdown menu. De stijling van HeadlessUI is minimaal, je moet zelf de styling toevoegen aan de componenten. HeadlessUI is in principe alleen een behavioural component library, zodat elementen zoals dropdowns ook te gebruiken zijn door mensen met bijvoorbeeld een screenreader, maar met de mogelijkheid om de componenten te stijlen zoals jij dat wil. HeadlessUI heeft een [eigen website](https://headlessui.dev/) met aanvullende documentatie en voorbeelden voor de stijling.

#### React Hook Form

React Hook Form is een library om formulieren te maken. In combinatie met Zod is het mogelijk om formulieren te maken die automatisch gevalideerd worden, met dezelfde schema's die gebruikt worden om de input te valideren op de API. React Hook Form heeft een [eigen website](https://react-hook-form.com/) met aanvullende documentatie.

