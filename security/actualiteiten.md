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

## 2. CSRF vulnerability in Plesk
In mei van 2022 is er een CSRF vulnerability gevonden in Plesk, een webhosting control panel.

De vulnerability zat zich in de REST API Plesk. Externe websites konden cookieloos command's uitvoeren op de server van de gebruiker. Hiermee konden de aanvallers het wachtwoord van de adminstator veranderen en hiermee de volledige controle over de server krijgen.

De vulnerability is gevonden door Fortbridge, een cybersecurity bedrijf. Zij hebben de vulnerability gemeld bij Plesk, Plesk heeft hier vervolgens niks mee gedaan. 6 maanden na de melding van Fortbridge is de vulnerability openbaar gemaakt.

### CIA Aspecten

#### Confidentiality
Afhankelijk van de natuur van de data die op de verschillende Plesk servers stond, is deze informatie volledig openbaar geworden. Dit is een schending van de vertrouwelijkheid van de gegevens.

#### Integrity
Aanvallers konden volledig controle krijgen over de server van de gebruiker. Hiermee konden zij de integriteit van de data op de server aantasten.

#### Availability
Met adminstator rechten konden de aanvallers de server volledig platleggen. Hiermee is de beschikbaarheid van de diensten van de server volledig verminderd.

### Welke gegevens hadden beschermd moeten zijn?
De gegevens van de gebruikers van de Plesk servers hadden beschermd moeten zijn.

### Waar moeten deze gegevens tegen beschermd zijn?
Een andere site had niet in staat moeten zijn om commando's uit te voeren op de server van de gebruiker.

### Welke verzwakkingen waren gebruikt in de aanval?
De aanvallers hebben gebruik gemaakt van een CSRF vulnerability in de REST API van Plesk. 

### Welke schade is er aangericht and hoeveel?
Het is moeilijk te zeggen hoeveel schade er is aangericht. Plesk is een control panel dat wordt gebruikt door rond de 2 miljoen klanten in de VS alleen. Wel kan er gezegd worden dat de vertouwelijkheid, integriteit en beschikbaarheid van de data van deze klanten is aangetast.

### Hoe had dit voorkomen kunnen worden?
De vulnerability die de onderzoekers van Fortbridge hebben gevonden had op verschillende manieren voorkomen kunnen worden.

#### CORS Policy

Ten eerste de REST API van de Plesk server heeft een volledig open CORS policy. Dit betekent dat externe websites commando's konden uitvoeren op de server van de gebruiker. Dit had voorkomen kunnen worden door een stricte CORS policy toe te voegen aan de REST API.

#### Content-Type Header

Ten tweede. De CORS Header `Access-Control-Allow-Credentials` met een waarde van `true` maakt het mogelijk voor externe websites om met een fetch request credentials mee te sturen. Al had de server niet de CORS policy dat credentials toestond, hebben de onderzoekers het toch voor elkaar gekregen om credentials mee te kunnen sturen. Dit hebben ze voor elkaar gekregen door gebruik te maken van een form. Wanneer een form van type POST wordt opgestuurd, worden credentials wel meegestuurd, omdat de output van de POST request niet door de website zelf gelezen kan worden.

Bij het versturen van een form wordt er automatisch een `Content-Type` header meegestuurd met de waarde `application/x-www-form-urlencoded`. Dit is een header die de server verteld hoe de data die wordt meegestuurd in de body van de request moet worden geïnterpreteerd. Deze waarde werd echter niet gecontrolleerd door de Plesk server. De server van Plesk interpreteerde de data in de body van de request als een JSON object. Hierdoor konden de onderzoekers de CSRF vulnerability uitbuiten.

#### CSRF Token

Ten derde, de REST API van Plesk maakte geen gebruik van de synchronized token pattern of de double submit cookie pattern.

### Wat gaan we hiervan meenemen in onze eigen beveiliging?

Wij gaan gebruik maken van een strikte CORS policy. Hierdoor worden requests naar onze API geblokkeerd door de browser.

Onze API staat het niet toe om POST en GET requests te ontvangen wanneer de Origin of Referrer header niet overeenkomen met die van de website zelf.

Wanneer er een request wordt gemaakt naar onze API word de `Content-Type` header gecontroleerd. Wanneer de waarde van deze header niet overeenkomt met de verwachte waarde, wordt de request geblokkeerd. Hierdoor vangen we af dat er met behulp van forms geen requests kunnen worden gemaakt naar onze API.

### Bronnen
- [Compromising Plesk Via Its Rest API](https://fortbridge.co.uk/research/compromising-plesk-via-its-rest-api/)
