# Way Down

A dialogue-heavy survival game. You wake up on the top floor of your apartment
building in the middle of the night. Something is wrong with the building. Get
out alive, one floor at a time.

## Play

Open `index.html` in a browser. No install or build step.

- Click a choice, or press **1–9**.
- Click the text, or press **Space**, to skip the typing effect.
- Progress saves automatically in your browser. If you die, you can retry the floor you died on.

## How it works

- **Health**: physical damage. At 0, you die.
- **Sanity**: fear. Seeing awful things and making bad calls drain it. At 0, the building wins.
- **Inventory**: items unlock choices (`flashlight`, `crowbar`, …).
- **Flags**: invisible memory of what you did (talked to someone, learned a rule…). Later floors can react to them.

Each floor is one file in `js/floors/`. The top floor is the highest number registered.
Going below the lowest written floor shows a "to be continued" screen.

## Writing a new floor

1. Copy `js/floors/floor10.js` to `js/floors/floor9.js` and change `number`, `title` and the nodes.
2. Add `<script src="js/floors/floor9.js"></script>` to `index.html` with the other floors.
3. Run `node tools/check.js` to catch broken links between nodes.

A floor looks like this:

```js
Game.registerFloor({
  number: 9,
  title: "Short floor name",
  start: "landing",              // first node shown on this floor
  nodes: {
    landing: {
      speaker: "dez",            // omit for narration; ids are in js/main.js
      text: "What's shown on screen.",
      effects: { sanity: -10 },  // applied when this node is shown
      choices: [
        { text: "Use the crowbar.", next: "pry", requires: { item: "crowbar" } },
        { text: "Go back.", next: "hall" },
      ],
    },
    hall:  { text: "...", next: "stairs" },  // just a "Continue" button
    stairs: { text: "...", descend: true },  // a button that goes down a floor
  },
});
```

### Node fields

| Field          | What it does |
| -------------- | ------------ |
| `text`         | The text to show. Use `\n\n` for paragraph breaks. |
| `speaker`      | Character id (see `js/main.js`). No speaker = italic narration. |
| `choices`      | List of choices (see below). |
| `next`         | If there are no choices: a single **Continue** button to this node. |
| `descend`      | If `true`: a button that goes down to the next floor. `descendText` changes its label. |
| `effects`      | Changes applied when the node is shown (see below). |
| `death`        | Text for a death screen. Ends the run (the player can retry the floor). |
| `deathText`    | Custom death text if this node's effects drop health to 0. |
| `madnessText`  | Custom text if this node's effects drop sanity to 0. |
| `ending`       | Text for a win screen. Use it in the lobby. |

### Choice fields

| Field        | What it does |
| ------------ | ------------ |
| `text`       | The button label. |
| `next`       | The node to go to. |
| `descend`    | Go down a floor instead of to a node. |
| `requires`   | Only show this choice if the conditions are met (see below). |
| `lockedText` | Show the choice greyed out with this text instead of hiding it when it's locked. |
| `effects`    | Changes applied when this choice is picked. |

### Conditions (`requires`)

`item`, `notItem`, `flag`, `notFlag` (each a string or a list), `minSanity`,
`maxSanity`, `minHealth`.

### Effects

`health`, `sanity` (positive or negative numbers), `give`, `take` (items),
`set`, `unset` (flags). Item and flag fields take a string or a list.

## Story so far

| Floor | Title          | What happens |
| ----- | -------------- | ------------ |
| 12    | Home           | Wake up during a blackout. Mrs. Okafor knocks; her husband Tomas went to the lobby and never came back. Get the stairwell key. Don't lean into the elevator shaft. |
| 11    | The Barricade  | Stairwell A is blocked. Talk your way past Dez's barricade. Learn the rule: *never answer the voice*. Reach Stairwell B. |
| 10    | Laundry        | Stairwell B is flooded. "Building management" talks to you over the intercom. Cut the power to the sparking laundry room to reach the service stairs. |
| 9 → 1 | *not written*  | |

Ideas for later floors: find out what happened to Tomas, who "building management"
really is, what's in the stairwell water, and what's waiting in the lobby.
