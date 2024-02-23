# Data verificatie level

Het is van belang dat de data die wij gebruiken binnen onze app op een veilige manier behandeld worden. Dit document is ervoor bedoeld om in beeld te brengen welke data binnen de app wordt gebruikt en hoe zorgvuldig er omgegaan moet worden met deze data. 

## ASVS (Application Security Verification Standard)

Welke maatregelingen er worden genomen om de beveiliging van bepaalde data te waarborgen wordt gebaseerd op het ASVS-raamwerk. Het ASVS-raamwerk informeert developers welke maatregelingen er zouden getroffen moeten worden om de de beveiling van een systeem te waarborgen. Het ASVS kent meerdere niveaus van beveiliging, waar elk niveau hogere beveiligings normen vereist. De gevoeliger de informatie die het systeem behandeld de hoger het ASVS niveau.

Het ASVS kent 3 niveaus. **Niveau 1** heeft alleen de minimale beveiligings maatregelingen nodig. Het gaat het erom dat er rekening is gehouden met bijvoorbeeld de OWASP Top 10 en soortgelijke checklists, maar documentatie van beveiligingsmaatregelingen is niet verplicht. **Niveau 2** is voor systemen waar persoonsgegevens behandeld worden. Hiervoor moet de data beveiligd worden en er moet goed gedocumenteerd worden welke maatregelingen er genomen worden. **Niveau 3** is voor systemen waar een hoog niveau van vertrouwen aan toegekend wordt. Denk hier aan systemen die medische informatie behandelen.

## Gegevens

Hieronder wordt in kaart gebracht welke data de applicatie behandeld en onder welke ASVS-niveau deze data valt.

| Data | Niveau |
| -- | :--: |
| Contact bericht | 2 |
| Account info | 2 |
| Sessie info | 2 |
| Gebruiker info | 2 |
| Spel info | 1 |
| Audit info | 2 |

> Sessie informatie beoordeling is beoordeeld op basis van de gevoeligheid van de data waar een sessie toegang tot geeft

> Audit informatie is beoordeeld op basis van de gevoeligheid van de data die gelogt wordt

De applicatie maakt gebruik van persoonlijke gegevens, zoals de email en naam van de gebruiker. Ook slaan we berichten op die naar de developer van de applicatie gestuurd worden, dit wordt in vertrouwen gedaan. NextAuth slaat informatie op van GitHub om de identiteit van de gebruiker te kunnen verifieren.

## Conclusie

Op basis van de analyse is er vast gesteld dat de applicatie minimaal moet voldoen aan Niveau 2 moet voldoen van de ASVS-raamwerk.
