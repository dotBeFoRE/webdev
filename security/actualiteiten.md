# Bijhouden van actualiteit

## 1. 23andMe Lek
In october 2023 zijn er tijdens een grote data-lek bij 23andMe, een persoonlijk genetica bedrijf, de gegevens van 6.9 miljoen gebruikers gelekt. Hierbij zijn de profielen en etniciteit van gebruikers gelekt. Het lek is ontstaan door een credential stuffing attack, dit is een attack waarbij een hacker een lijst van gestolen gebruikersnamen en wachtwoorden gebruikt om in te loggen op accounts. Doordat 23andMe een feature heeft waarbij gebruikers DNA-verwanten kunnen vinden, konden de hackers ook de informatie van de DNA-verwanten van de gebruikers inzien. Een deel van de gegevens is op een online hacker forum vrijgegeven als een lijst van Asjkenazische Joden.

### CIA Aspecten

#### Confidentiality
Gevoelige informatie van de gebruikers is gelekt. Het gaat hier om informatie over de etniciteit en DNA-verwanten van de gehackte gebruikers. Dit is een schending van de vertrouwelijkheid van de gegevens.

#### Integrity
Op de accounts van de gehackte gebruikers konden hackers aanpassingen aanmaken. Al kon ik hier geen bewijs van vinden dat dit is gebeurt, is het wel een mogelijkheid.

#### Availability
Het lek heeft geen directe invloed gehad op de beschikbaarheid van de diensten van 23andMe. Door het lek zijn er door 23andMe zelf enkele diensten offline gehaald de effecten van het lek te minimaliseren. Hierdoor is de beschikbaarheid van de diensten van 23andMe wel verminderd.

### Welke gegevens hadden beschermd moeten zijn?
De gegevens van DNA-verwanten van de gebruikers hadden beschermd moeten zijn.

### Waar moeten deze gegevens tegen beschermd zijn?
Deze gegevens hadden beschermd moeten zijn tegen de inzage van onbevoegden, in dit geval de hackers, maar niet de gehackte gebruikers zelf.

### Welke verzwakkingen waren gebruikt in de aanval?
De hackers hebben gebruik gemaakt van een credential stuffing attack. Dit is een attack waarbij een hacker een lijst van gestolen gebruikersnamen en wachtwoorden gebruikt om in te loggen op accounts. Hierbij is er gebruik gemaakt van de zwakke wachtwoorden van de gebruikers.

### Welke schade is er aangericht and hoeveel?
De schade die is aangericht is dat de gegevens van 6.9 miljoen gebruikers zijn gelekt. Hierbij zijn de profielen en etniciteit van gebruikers gelekt. Deze gegevens zijn op een online hacker forum vrijgegeven als een lijst van Asjkenazische Joden om deze doelgericht te kunnen aanvallen.

Meer dan 24 rechtzaken zijn aangespannen tegen 23andMe. De waardeering van 23andMe is met 91% gedaald, van 3.5 miljard naar 300 miljoen.

### Hoe had dit voorkomen kunnen worden?
Gegevens van andere DNA-verwanden waarvan het account niet direct gehackt waren hadden niet inzichtelijk moeten zijn voor de hackers. Het beschermen van deze gegevens enkel door alleen een gebruikersnaam en wachtwoord was niet voldoende. In het geval van 23andMe hadden ze een extra beveiligingslaag moeten toevoegen, zoals een tweestapsverificatie. Hierdoor hadden de hackers niet alleen een gebruikersnaam en wachtwoord nodig, maar ook een extra beveiligingsstap die alleen de gebruiker zelf kan uitvoeren. Dit had de hackers kunnen tegenhouden. 

Tweestapsverificatie is nu, na jaren van kritiek, een verplichte beveiligingsmaatregel voor 23andMe.

### Wat gaan we hiervan meenemen in onze eigen beveiliging?
Binnen onze applicatie gaan wij geen gebruik maken van gebruikersnaam en wachtwoord voor onze authenticatie. Voor onze authenticatie maken wij gebruik van een OAuth provider. Hierdoor is het niet mogelijk voor hackers om een credential stuffing attack uit te voeren op onze applicatie, maar leunen wij op de beveiliging van GitHub.

Binnen onze applicatie slaan wij geen gegevens op die zo gevoelig zijn als die in het geval van 23andMe. Dus we zien geen noodzaak om een extra beveiligingslaag toe te voegen aan onze applicatie.

### Bronnen
- [23andMe User Data Stolen in Targeted Attack on Ashkenazi Jews](https://www.wired.com/story/23andme-credential-stuffing-data-stolen/)
- [Genetic testing firm 23andMe admits hackers accessed DNA data of 7m users](https://www.theguardian.com/technology/2023/dec/05/23andme-hack-data-breach)
- [Hackers got nearly 7 million people’s data from 23andMe. The firm blamed users in ‘very dumb’ move](https://www.theguardian.com/technology/2024/feb/15/23andme-hack-data-genetic-data-selling-response)
