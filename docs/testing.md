# Testing

Het doel van de applicatie is om mijn skills als een developer te laten zien. Hiervoor is het belangrijk dat de app goed functioneerd en dat de eerder ontwikkelde functionaliteit niet breekt wanneer er nieuwe functionaliteit geïntroduceerd word.

## De functionaliteiten

De meest belangrijke functionaliteiten van de website zijn het zien van de hoofdpagina en de mogelijkheid om het contact formulier in te kunnen vullen en te versturen. 

Daarnaast is het belangrijk dat de beveiliging van de app op orde is, sinds gebruikers kunnen inloggen moet hun GitHub account om Reversi te spelen. Hiervoor wordt gebruikers informatie opgeslagen die niet belangrijk is voor andere gebruikers.

De game-logica moet ook goed werken, het is een groot onderdeel van de website. Het geeft geen goede indruk op mij als developer als de logica van de game niet goed in elkaar zit.

## Teststrategie

Voor de verschillende onderdelen van onze applicatie zijn er verschillende manieren van testen nodig. Voor dingen zoals de gamelogica is het mogelijk om die logica in isolatie testen met behulp van unit tests. Om te unit testen maken wij gebruik van Jest. 

Voor andere elementen zoals de api is er informatie nodig vanuit de database, hiervoor hebben we integration tests nodig. Prisma kan gemockt worden om de database te mocken.

Sommige elementen van de app kunnen niet volledig worden gestest met unit tests en intergration tests. Bijvoorbeeld het contact formulier, omdat hier menselijke input voor nodig is, sinds we gebruik maken van ReCaptcha. Deze moeten handmatig getest worden.

E2E tests kunnen gebruikt worden om te kijken of de website de content laat zien die hij moet weergeven.

## Het risico

Om te bepalen welke functionaliteit getest moet worden en op welke mate, maken we gbruik van een risico matrix. De risico wordt bepaald op basis van de waarschijnlijkheid dat er problemen zijn met een functionaliteit en de gevolgen daarvan. Beide dimensies worden beoordeeld op een schaal van 1-3 waar 1 de laagste kans en de minste gevolgen heeft en 3 de hoogste kans en de meeste gevolgen. Het risico word berekend door beide dimensies met elkaar te vermenigvuldigen. Hoe hoger het risico de intensiever er getest moet worden op dat gebied. Zie *Figuur 1*.

![3x3 Risk Matrix](./images/3x3%20Risk%20matrix.png)
*Figuur 1: risico matrix*

Hieronder laat ik zien welke functionaliteit welk risico heeft en waarom.

| Functionaliteit | Risicoklasse | Argumentatie |
| --- | :---: | --- |
| Hoofdscherm laten zien | 3 | Ook al is het laten zien van het hoofdscherm een belangrijk deel van de applicatie, er is weinig kans dat er iets misgaat met het laten zien van het hoofdscherm sinds het een statisch scherm is met geen logica erachter. |
| Reversi spelen | 6 | Het spelen van Reversi is een belangrijk onderdeel van de applicatie. Het staat niet goed als de gamelogica niet goed werkt. Tevens zijn er veel edge-cases die verkeerd geïmplenteerd kunnen worden, hierdoor is er een verhoogde kans dat het spel problemen heeft. |
| Contact formulier versturen | 4 | De kans dat er zich problemen op doen bij het versturen van het contact formulier aan de kant van de applicatie is klein. Wat wel een gevaar is dat Sendgrid en/of ReCaptcha niet werken. De gevolgen zijn middelmatig. |
| Inloggen | 3 | De kans dat er problemen zijn met het inloggen is aardig klein, sinds we een bewezen library gebruiken om OAuth2 te implementeren en de kans dat GitHub problemen heeft is klein. De gevolgen zijn groot. |
| Op rol gebaseerde toegang | 6 | De kans dat dit hier problemen mee zijn is aardig klein sinds er maar een paar functies zijn die gebruik maken van rollen. De gevolgen van een fout in deze functionaliteit zijn echter zeer ernstig. |
| Aanpassen van profiel | 6 | Bij het aanpassen van het profiel is er de kans dat een gebruiker meer weet aan te passen dan dat hij zou moeten kunnen. De gevolgen hiervan zijn zeer ernstig. De kans hierop is middelmatig. |

*Tabel 1: Risicoklasse per functionaliteit*

## Testinspanning

De testinspanning zegt iets over in welke mate we een functionaliteit per testsoort gaan testen. De testinspanning wordt bepaald door de risicoklasse. Hoe hoger de risicoklasse, hoe intensiever de testinspanning. 

| Functionaliteit | Risicoklasse | Unit | Integration | E2E | Handmatig |
| --- | :---: | :---: | :---: | :---: | :---: |
| Hoofdscherm laten zien | 3 |  |  | I |  |
| Reversi spelen | 6 | II | I |  | I |
| Contact formulier versturen | 4 |  |  | I | II |
| Inloggen | 3 |  |  |  | I |
| Op rol gebaseerde toegang | 6 | II | II | I |  |
| Aanpassen van profiel | 6 | | III |  |  |

I Beperkte tests: er wordt enkel gekeken naar de happy flow  
II Gemiddelde dekking van de test: zowel de happy flow als de unhappy flow worden doorlopen  
III Grote dekking van de test: alle mogelijke flows in kaart brengen en aftesten
