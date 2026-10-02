/*
 * The cast. Use these ids as `speaker`, in `show`, and in `meet`/`kill`/`alive`.
 * `bio` is the starting dossier entry; story nodes can rewrite it with
 * effects: { bio: { id: "new text" } }.
 * Add `image: "img/name.png"` to replace a silhouette with real art.
 *
 * All names are placeholders — rename freely.
 */
Game.registerCharacters({
  // ---- The kidnapped ----
  mira: {
    name: "Mira",
    color: "#7fc8a9",
    bio: "Says she's a nurse. Woke up first and checked everyone's pulse. Very calm. Maybe too calm.",
  },
  bram: {
    name: "Bram",
    color: "#e0874a",
    bio: "Big, loud, works construction. Wants to punch his way out of this.",
  },
  odile: {
    name: "Odile",
    color: "#c792ea",
    hat: true,
    bio: "An old woman who hasn't stopped knitting since she woke up. Nothing seems to surprise her.",
  },
  tess: {
    name: "Tess",
    color: "#f2c94c",
    bio: "Nineteen. Says she streams for a living. Keeps checking a phone that has no signal.",
  },
  jun: {
    name: "Jun",
    color: "#6a8fd1",
    bio: "Quiet, glasses, notices things. Read the rules twice before anyone else read them once.",
  },
  elias: {
    name: "Elias",
    color: "#d9d6cf",
    bio: "Keeps his hood up. Hasn't said where he's from.",
  },
  noor: {
    name: "Noor",
    color: "#e8445a",
    bio: "Cap pulled low. Answers questions with questions.",
  },

  // ---- The Handlers: three silent figures who run the game ----
  h1: { name: "Handler", color: "#3d3d48", bio: "Black leather from head to toe, mirrored mask. Follows the rules. Does not speak." },
  h2: { name: "Handler", color: "#3d3d48" },
  h3: { name: "Handler", color: "#3d3d48" },

  // ---- Other voices ----
  game:    { name: "THE GAME", color: "#e8445a" },
  // The one person outside who texts you. Is actually locked in on a lower floor.
  contact: { name: "Unknown number", color: "#8fd19a", bio: "Texts you from somewhere. Nobody else's phone got a message." },
  you:  { name: "You", color: "#ece8f0" },
  tv:   { name: "TV", color: "#9aa5b1" },
  sign: { name: "Rule sheet", color: "#c9a227" },
});
