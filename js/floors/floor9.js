/*
 * Floor 9 — The Restaurant (opening only, the rest is still to be written)
 *
 * Seven places set for eight people. Every glass is full of water —
 * bad news for whoever is hiding something under their hat.
 * Quota: every plate and every glass must be empty. One plate is poisoned.
 */
Game.registerFloor({
  number: 9,
  title: "The Restaurant",
  background: "linear-gradient(180deg, #3a1218 0%, #160709 100%)",
  start: "arrive",
  hub: "table",
  rule: {
    text: "Quota: every plate and every glass on the table must be empty. One plate is poisoned.",
    requires: { flag: "table_cleared" },
  },
  nodes: {
    arrive: {
      show: [],
      text: "The elevator opens onto red carpet and candlelight. Soft piano music from nowhere. The smell of roast meat.\n\nA restaurant. One long table, set with white linen and silver.",
      next: "handlers_here",
    },

    handlers_here: {
      show: ["h1", "h2", "h3"],
      text: "The Handlers are already here, standing beside a door marked STAFF. One of them holds its arm a little stiffly.\n\nOn the table, propped against a candle, a new rule sheet.",
      next: "rule",
    },

    rule: {
      speaker: "sign",
      text: "FLOOR 9 — THE RESTAURANT\n\nQuota: every plate and every glass on the table must be empty.\n\nOne plate is poisoned.",
      effects: { sms: { from: "game", text: "FLOOR 9 — THE RESTAURANT\nQuota: every plate and every glass on the table must be empty.\nOne plate is poisoned." } },
      next: "count",
    },

    count: {
      show: ["jun", "tess"],
      speaker: "jun",
      text: "Seven plates. Seven glasses of water.\n\nThere are eight of us.",
      next: "tess_count",
    },

    tess_count: {
      speaker: "tess",
      text: "So, what, one of us just... doesn't eat? Or one of us eats twice? Or...\n\n...or one of us isn't supposed to still be here by dinner.",
      next: "table",
    },

    table: {
      show: ["mira", "bram", "odile", "tess", "jun", "elias", "noor"],
      text: "Nobody sits down. Nobody wants to be the first.\n\n[Floor 9 continues here. It hasn't been written yet.]",
      elevator: true,
    },
  },
});
