# Technisch Ontwerp

## 1. Inleiding

In dit document wordt er beschreven hoe de applicatie is opgebouwd, welke tooling er wordt gebruikt en van welke externe services gebruik wordt gemaakt.

## 2. Systeem Context

![Systeem Context diagram](./images/System%20Context%20diagram.drawio.svg)

Het Webdev CV software systeem wordt bezocht en gebruikt door de een bezoeker. Een bezoeker kan ingelogd zijn, wanneer dit gebeurt wordt de bezoeker een gebruiker. Een gebruiker kan een bepaalde rol hebben zoals moderator of admin, die bepaalt welke rechten de gebruiker heeft. Een admin wordt als moderator beschouwd, maar niet andersom.

Het systeem maakt gebruik van twee externe services, dit zijn GitHub, reCAPTCHA en SendGrid.

### 2.1. GitHub

GitHub wordt gebruikt voor het authorizeren van gebruikers die gebruik willen maken van pagina's waarvoor je ingelogd moet zijn. Dit wordt gedaan door middel van OAuth2. Dit wordt in het NextAuth hoofdstuk verder uitgelegd.

### 2.2. SendGrid

SendGrid wordt gebruikt om e-mails te versturen. SendGrid wordt gebruikt voor de Contact pagina zodat gebruikers contact kunnen zoeken met de ontwikkelaar van de applicatie. Hoe deze communicatie tot stand wordt gebracht wordt later uitgelegd.

### 2.3. reCAPTCHA

reCAPTCHA wordt gebruikt om te voorkomen dat er spam wordt verstuurd via de contact pagina. Dit wordt gedaan door middel van een reCAPTCHA v3 token. Wanneer de token niet voldoet aan de eisen wordt de mail niet verstuurd.

## 3. Het systeem

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

De combinatie van NextJS, tRPC, NextAuth, Prisma en Tailwind komt voort uit de T3 Stack. De T3 Stack is een volledige starter kit voor NextJS. Het levert een volledige "type-safe" ontwikkel omgeving. Al is T3 Stack een starter pack, het heeft ook een [eigen website](https://create.t3.gg/en/introduction) met aanvullende documentatie over de verschillende onderdelen waaruit de stack bestaat.

### 3.1. NextJS

NextJS is een framework voor React. We gebruiken NextJS voor het statisch genereren van de pagina's en het serveren van de pagina's aan de gebruiker. NextJS wordt ook gebruikt voor het serveren van de API calls, dit wordt gedaan door middel van tRPC. NextJS maakt gebruik van file based routing. De verschillende pagina's staan in de pages map. Hoe de pages map werkt is uitgewerkt door NextJS in de [NextJS docs](https://nextjs.org/docs/routing/introduction). API calls worden gedaan door middel van de API map. Hoe de API map werkt is uitgewerkt door NextJS in de [NextJS docs](https://nextjs.org/docs/api-routes/introduction). In de API map staan de handlers voor NextAuth en tRPC. De handlers worden gebruikt om de API calls te routeren naar de juiste functie.

Voor het hosten van de Website maken wij gebruik van Vercel. Vercel is een hosting provider die gespecialiseerd is in NextJS. Vercel luistert naar de GitHub repository en wanneer er een push wordt gedaan naar de main branch, wordt de website automatisch gebuild en gedeployed. 

Het Vercel account wordt beveiligd met 2FA, via GitHub en Passkeys.

#### 3.1.1 XSS mitigation

Om de impact van XSS aanvallen te verzachten maken wij gebruik van Content Security Policy headers. Deze headers zorgen ervoor dat er geen data opgehaald of opgevraagd kan worden van cross-site adressen die wij niet expliciet toelaten.

### 3.2. Webdev CV database
Voor onze database provider maken wij gebruik van PostgreSQL. PostgreSQL is een relationele database. PostgreSQL is een open source database.

Wij hosten onze database op Supabase. Het Supabase account is beveiligd met 2FA.

### 3.3. Prisma
Prisma is een ORM voor de database. Prisma maakt het mogelijk om de database te benaderen met Typescript. Prisma maakt gebruik van een schema dat gedefineerd staat in de prisma folder. Dit schema wordt gebruikt om de database te migreren. Door het gebruik van Prisma vangen we ook SQL injetions op. Prisma heeft een [eigen website](https://www.prisma.io/) met aanvullende documentatie.

### 3.4. NextAuth
NextAuth verzorgt het inloggen en de sessie beheer van de app. NextAuth maakt gebruik van CSRF tokens om het mogelijk te maken voor gebruikers om veilig in te kunnen loggen. NextAuth ondersteund sessie beheer met JWT, maar wij maken gebruik van database sessies. NextAuth ondersteund tientallen services om mee in te kunnen loggen, dit gaat doormiddel van Providers. Wij maken gebruik van de GitHub provider zodat gebruikers kunnen inloggen met hun GitHub account. Welke data er gedeeld wordt met de client wordt bepaald in /src/server/auth.ts. Belangrijke events, bijvoorbeeld het registreren van nieuwe gebruikes en het inloggen van gebruikers worden gelogt. NextAuth heeft een [eigen website](https://next-auth.js.org/) met aanvullende documentatie.

Next Auth maakt gebruik van de Prisma adapter om gebruiker, sessie en account data op te halen en te slaan.

### 3.5. tRPC server

De showcase app maakt gebruik van tRPC. tRPC is een package om typesafe end-to-end API's te maken. tRPC maakt gebruik van Typescript zodat je aan de server kant een API route kan maken, waarna de type-definitie ook beschikbaar is aan de client kant. Wat tRPC veilig maakt is dat voor elke route waar input voor nodig is (denk aan een userId), die input wordt gecontrolleerd door een [Zod schema](https://zod.dev). Dit maakt voor een veilige, onderhoudbare en snelle developer experience. tRPC heeft NextJS als first class citizen. tRPC biedt de client kant een api client aan die binnen de React components gebruikt kan worden om data op te halen. Dit wordt verder uitgelegd in het hoofdstuk over de SPA. tRPC heeft een [eigen website](https://trpc.io/) met aanvullende documentatie.

Voor het vrijgeven van verschillende functionaliteit wordt er gebruik gemaakt van routes. Binnen tRPC zijn er verschillende soorten routes, zoals queries, mutations en subscriptions. Voor onze applicatie maken wij gebruik van queries en mutations. Queries worden gebruikt om data op te halen, mutations worden gebruikt om data te veranderen. Queries kunnen aangeroepen worden met een GET request, mutations met een POST request.

Verschillende tRPC routes maken gebruik van Prisma om de data op te halen en te bewerken. De tRPC server maakt gebruik van NextAuth om de sessie informatie door te spelen naar de API calls. De tRPC client maakt gebruik van de tRPC server om de API calls te maken. De API is onderverdeeld in verschillende routers. Elke router heeft zijn eigen functie. Bijvoorbeeld de Reversi router zorgt ervoor dat de juiste logica wordt aangeroepen voor de game en dat de data op de juiste plek terecht komt. De users router is verantwoordelijk voor de functies om gebruikers op te halen en te bewerken. De verschillende routers staan gedefineerd in `/src/server/api/routers`.

#### 3.5.1. SendGrid
Om email te versturen maken sommige mutaties gebruik van SendGrid. Voor het saniteren van de input wordt er gebruik gemaakt van `escape-html-template-tag`. Deze package geeft ons een template tag die ervoor zorgt dat de input die de gebruiker invoert niet kwaadaardig is.

#### 3.5.2. Cross-site request forgery (CSRF)
Mutatie en query requests kunnen alleen aangeroepen worden wanneer de referrer of de origin overeenkomen met een lijst van toegestaande origins. Hiermee wordt voorkomen dat de API calls gemaakt kunnen worden vanaf een andere website dan de SPA.

Ook word er gebruik gemaakt van CORS headers om te voorkomen dat de API calls gemaakt kunnen worden vanaf een andere origin dan de SPA.

#### 3.5.3. Role-based access control (RBAC)

Om de intergriteit van de data te waarborgen wordt er gebruik gemaakt van role-based access control. Dit betekent dat bepaalde gebruikers alleen bepaalde data kunnen ophalen of bewerken. Voor elke user is er beschreven welke rollen deze heeft aan de hand van de Prisma schema. Om te controlleren of een gebruiker een bepaalde rol heeft, wordt bepaald via role guards.

#### 3.5.4. Procedures

Om de api veilig te houden en ervoor te zorgen dat bepaalde gebruikers geen calls kunnen maken naar bepaalde API routes, worden er procedures gebruikt. Een procedure is een soort middleware dat draait voordat de volledige functie gedraaid wordt. Procedures worden gebruikt om te controleren of de gebruiker ingelogd is, of de gebruiker de juiste rechten heeft om de API call te maken. Procedures worden gebruikt om de API calls te beveiligen. Procedures worden uitgelegd in de [tRPC docs](https://trpc.io/docs/procedures). De procedures staan gedefinieerd in [/src/server/api/trpc.ts](/src/server/api/trpc.ts). tRPC krijgt de session informatie door NextAuth doorgespeeld en in de context voor de call gezet. Ook wordt de Prisma ORM wordt doorgespeeld in deze context. 

### 3.6. SPA (de client)

De SPA's worden gegenereerd door NextJS. NextJS doet dit doormiddel van de pagina's die gedefineerd staan in de pages map. NextJS vormt React code om naar statische HTML pagina's. Deze pagina's worden vervolgens door NextJS geserveerd aan de gebruiker. Wanneer de pagina laadt, neemt React het weer over.

React zorgt ervoor dat XSS aanvallen worden voorkomen. React zorgt ervoor dat gebruiker input niet ongesaniteerd in de HTML wordt geladen.

De client maakt gebruik van Tailwind CSS, tRPC client, NextAuth, HeadlessUI, en React Hook Form.

#### 3.6.1. Tailwind CSS

Tailwind CSS is een CSS framework. Het bied een aantal utility klassen die je kan combineren om je pagina te stijlen. Tailwind bied niet zoals Bootstrap volledige componenten, maar het bied klassen aan die je kan gebruiken om je eigen componenten te stijlen. Tailwind maakt gebruik van JIT compiling, dit betekent dat alleen de klassen die je nodig bent aanwezig zijn op een pagina en het is mogelijk om on the fly klassen te genereren. Tailwind CSS heeft een [eigen website](https://tailwindcss.com/) met aanvullende documentatie.

#### 3.6.2. tRPC client

De tRPC client wordt gebruikt om calls te maken naar de API binnen de app. tRPC geeft ons hiervoor een hook dat gebruik maakt van [React Query](https://react-query.tanstack.com/). React Query is een library om data te fetchen van een API en te cachen. React Query zorgt er ook voor dat wanneer de data "stale" is, de data opnieuw wordt opgehaald.

Doordat de tRPC client gebruik maakt van de type definitions die gedefineerd zijn op de server kan de developer gelijk zien wat de vorm is van de data die naar de server gestuurd wordt en de response. Wanneer je op de server een validatie schema veranderd en je past niks aan bij de client, dan zal je gelijk een type definitie error krijgen. Dit zorgt voor een veilige en onderhoudbare developer experience.

Elke route die de router vrijgeeft wordt automatisch een hook. Voor verschillende routes worden andere hooks gemaakt. Wanneer een route bijvoorbeeld data veranderd op de server wordt dit gedaan met een [mutation](https://trpc.io/docs/reactjs/usemutation). Wanneer een route alleen data ophaalt wordt dit gedaan met een [query](https://trpc.io/docs/reactjs/usequery).

#### 3.6.3. NextAuth

NextAuth wordt gebruikt om de gebruiker in te laten loggen en om de gebruiker te authenticeren. NextAuth maakt gebruik van een [React hook](https://next-auth.js.org/getting-started/client#use-session) om de sessie informatie te verkrijgen. Deze sessie data wordt gebruikt om je eigen gebruiker te laten zien, en om ervoor te zorgen dat er een melding komt dat de gebruiker zich niet op bepaalde pagina's kan bevinden. De gebruiker wordt naar juiste login pagina doorgestuurd door signIn("github") te callen. NextAuth heeft een [eigen website](https://next-auth.js.org/) met aanvullende documentatie.

#### 3.6.4. HeadlessUI

HeadlessUI is een React component library. HeadlessUI bied componenten aan zoals een dropdown menu. De stijling van HeadlessUI is minimaal, je moet zelf de styling toevoegen aan de componenten. HeadlessUI is in principe alleen een behavioural component library, zodat elementen zoals dropdowns ook te gebruiken zijn door mensen met bijvoorbeeld een screenreader, maar met de mogelijkheid om de componenten te stijlen zoals jij dat wil. HeadlessUI heeft een [eigen website](https://headlessui.dev/) met aanvullende documentatie en voorbeelden voor de stijling.

#### 3.6.5. React Hook Form

React Hook Form is een library om formulieren te maken. In combinatie met Zod is het mogelijk om formulieren te maken die automatisch gevalideerd worden, met dezelfde schema's die gebruikt worden om de input te valideren op de API. React Hook Form heeft een [eigen website](https://react-hook-form.com/) met aanvullende documentatie.

#### 3.6.6. reCAPTCHA

Voor het ophalen van een reCAPTCHA maken wij gebruik van een package genaamd `react-google-recaptcha-v3`. Deze package geeft ons een hook die we kunnen gebruiken om een reCAPTCHA token. Deze token wordt vervolgens samen met de data van de email opgestuurd naar de API.

### 3.7. SendGrid

SendGrid wordt gebruikt om e-mails te versturen. Deze communicatie wordt verzorgt via de `@sendgrid/mail` package. Voor SendGrid moet er een API token worden gegenereerd, deze wordt doorgegeven aan de server via een environment variable.

#### 3.7.1. XSS

Om te voorkomen dat er kwaadaardige code wordt uitgevoerd wanneer een gebruiker een e-mail opent, wordt er gebruik gemaakt van sanitatie.
