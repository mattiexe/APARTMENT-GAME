# Way Down

Een death-game mystery visual novel. Acht vreemden worden wakker op de bovenste
verdieping van een appartementsgebouw. Elke verdieping is een stage met een regel;
de lift gaat pas naar beneden als de quota gehaald is. Vertrouw niemand.

Het verhaal, de wereld en de personages staan in **[STORY.md](STORY.md)**.

## Spelen

Open `index.html` in een browser. Niks te installeren.

- Klik op een keuze, of druk op **1–9**.
- Klik op de tekst of druk op **spatie** om het typen over te slaan.
- **Rules**: de regels van elke verdieping en of de quota al gehaald is.
- **Dossier**: wat je weet over iedereen. Dat verandert naarmate je dingen ontdekt.
- Voortgang wordt automatisch bewaard. Als je sterft, kan je de verdieping opnieuw doen.

## Bestanden

| Bestand | Wat |
| --- | --- |
| `js/characters.js` | Alle personages: naam, kleur, dossiertekst, hoed. |
| `js/floors/floor10.js`, `floor9.js`, … | Eén bestand per verdieping. |
| `js/engine.js` | De engine. Normaal hoef je hier niet aan te komen. |
| `tools/check.js` | Controleert je verdiepingen op fouten. |

## Een nieuwe verdieping schrijven

1. Kopieer `js/floors/floor9.js` naar `js/floors/floor8.js` en pas `number`, `title`, `rule` en de nodes aan.
2. Voeg `<script src="js/floors/floor8.js"></script>` toe in `index.html`, onder de andere verdiepingen.
3. Run `node tools/check.js` om kapotte links en onbekende personages te vinden.

Een verdieping ziet er zo uit:

```js
Game.registerFloor({
  number: 8,
  title: "The Bathhouse",
  background: "linear-gradient(180deg, #12303a, #071216)",  // kleur van het scherm
  start: "arrive",     // eerste scène als je hier voor het eerst aankomt
  hub: "hall",         // scène waar je terechtkomt als je later met de lift terugkomt
  rule: {
    text: "Quota: ...",                      // wat in het Rules-paneel staat
    requires: { flag: "quota_done" },        // wanneer de quota gehaald is
  },
  nodes: {
    arrive: {
      show: ["mira", "odile"],   // wie er op het scherm staat (blijft tot je het verandert)
      speaker: "mira",           // wie praat; weglaten = vertelling
      text: "Wat er gezegd wordt.",
      next: "hall",              // één "Continue"-knop
    },
    hall: {
      text: "...",
      elevator: true,            // voegt de liftknoppen toe (naar beneden / terug naar boven)
      choices: [
        { text: "Praat met Odile.", next: "odile_talk" },
        { text: "Gebruik de sleutel.", next: "door", requires: { item: "key" } },
      ],
    },
    // ...
  },
});
```

### Scènes (nodes)

| Veld | Wat het doet |
| --- | --- |
| `text` | De tekst. `\n\n` voor een nieuwe alinea. |
| `speaker` | Wie praat (id uit `characters.js`). Weglaten = cursieve vertelling. |
| `show` | Lijst van personages op het scherm. `[]` = niemand. |
| `next` | Eén **Continue**-knop naar deze scène. |
| `choices` | Lijst van keuzes (zie hieronder). |
| `elevator` | `true` = liftknoppen toevoegen. |
| `effects` | Wat er gebeurt als de scène getoond wordt (zie hieronder). |
| `death` | Tekst van een game-over scherm (de speler kan de verdieping opnieuw doen). |
| `ending` | Tekst van een eindscherm. |

### Keuzes

| Veld | Wat het doet |
| --- | --- |
| `text` | Tekst op de knop. |
| `next` | Naar welke scène. |
| `requires` | Alleen tonen als de voorwaarden kloppen. |
| `lockedText` | Toon de keuze grijs met deze tekst in plaats van ze te verbergen. |
| `effects` | Wat er gebeurt als je deze keuze kiest. |

### Voorwaarden (`requires`)

`item`, `notItem`, `flag`, `notFlag`, `anyFlag` (tekst of lijst), `alive`, `dead`
(personage-id's), `deaths` (minstens zoveel doden).

### Effecten (`effects`)

| Effect | Voorbeeld |
| --- | --- |
| `give` / `take` | `give: "brass key"`: voorwerp krijgen of verliezen. |
| `set` / `unset` | `set: "saw_tv"`: iets onthouden voor later. |
| `meet` | `meet: "noor"`: personage komt in het dossier. |
| `bio` | `bio: { noor: "Nieuwe dossiertekst." }`: dossier herschrijven na een ontdekking. |
| `kill` | `kill: "bram"`: personage sterft (grijs met een kruis, telt mee voor `deaths`). |
