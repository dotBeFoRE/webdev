## Definities
Bezoeker = Iemand die de site gebruikt  
Gebruiker = Bezoeker die ingelogd is  
Speler = Een gebruiker die aan een Reversi spel meedoet  
Moderator = Kan acties uitvoeren waar hogere privileges voor nodig zijn  
Admin = Een moderator die andere moderators kan aanwijzen  
Provider = Service die gebruikt kan worden om in te loggen  
Profiel = Gebruiker informatie in de database  
Account = Link tussen een provider en een profiel  

## Requirements
- Gebruikers moeten Reversi kunnen spelen
- Gebruikers moeten kunnen deelnemen aan een spel op een ander apparaat
- Het spel moet gespeeld worden in "real-time"
- Het spel moet zich houden aan de Othello regelset
- Belangrijke gebeurtenissen worden gelogt

## User-stories
### Als gebruiker, wil ik een Reversi spel kunnen starten, zodat ik Reversi kan spelen

![Explanation screen](./images/Explanation_Screen.png)

### Als gebruiker, wil ik een Reversi spel kunnen bijwonen, zodat ik met iemand anders Reversi kan spelen

- Gebruiker kan op hetzelfde profiel als de andere speler meedoen
- Gebruiker mag alleen deelnemen als de kleur nog niet is ingenomen door een andere speler
- Gebruiker deelnemen door een zet te doen met een beschikbare kleur

![Explanation screen](./images/Game_screen.png)

### Als gebruiker, wil ik kunnen inloggen, zodat de website weet dat ik het ben
- Gebruiker kan inloggen met GitHub
- Als er nog geen account bestaat wordt er een aangemaakt
- Als er nog geen profiel bestaat voor het account wordt er een profiel aangemaakt
- Als er een nieuwe account wordt aangemaakt wordt dit gelogt
- Als er een nieuwe profiel wordt aangemaakt wordt dit gelogt
- Als een gebruiker inlogt wordt dit gelogt

### Als speler, wil ik een zet kunnen zetten, zodat het spel door kan gaan

- Speler kan alleen een zet doen als die aan de beurt is en een zet kan doen
- De zet moet legaal zijn
- Het bord moet gelijk geüpdaten
- Er wordt laten zien welke zetten legaal zijn

![Do move](./images/Do_move.png)

### Als speler, wil ik altijd de meeste recente staat van het bord zien, zodat ik weet wat er op het bord gebeurt

- Wanneer de speler een stabiele verbinding gebruikt mag de staat van het bord niet langer dan 5 seconden "out of sync" zijn tussen server en client

### Als speler, wil ik zien wie er gewonnen heeft wanneer het spel voorbij is, zodat het duidelijk is dat het spel over is

![Winner](./images/Winner.png)

### Als aanvaller, wil ik de database overspoelen, zodat er geen spellen meer gespeeld kunnen worden

- Spelers mogen een gelimiteerd aantal spellen aanmaken over een bepaalde hoeveelheid tijd

### Als aanvaller, wil ik achter informatie kunnen komen van de gebruikers waar ik eigenlijk geen toegang tot zou moeten hebben, zodat ik informatie over iemand te weten kan komen waar ik niet hoor over te beschikken

- De server stuurt alleen de essentiele informatie naar de client
- Welke informatie een gebruiker kan ophalen wordt bepaald door hun rol

### Als moderator, wil ik alle gebruikers kunnen zien, zodat ik weet wie er gebruik maakt van de site

### Als moderator, wil ik gebruikers kunnen verbannen of schorsen, zodat ik spelers die valsspelen kan straffen

- Maatregelen worden geauditeert

### Als moderator, wil ik belangrijke gebeurtenissen kunnen zien, zodat ik de veiligheid van de applicatie kan waarborgen

### Als admin, wil ik gebruikers moderators maken en andersom, zodat ik niet alles zelf hoef te moderaten
