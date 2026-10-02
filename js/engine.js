/*
 * Way Down — dialogue engine.
 *
 * Floors register themselves with Game.registerFloor({...}). Each floor is a
 * set of dialogue "nodes". A node shows some text and offers choices; choices
 * point at other nodes, can require items/flags, and can change stats.
 * See README.md for the full node format.
 */
const Game = (() => {
  const SAVE_KEY = "waydown-save";
  const MAX_STAT = 100;

  const floors = {};       // floor number -> floor definition
  const characters = {};   // id -> { name, color }

  let state = null;        // the live game state
  let checkpoint = null;   // copy of state at the start of the current floor
  let typing = null;       // active typewriter, if any

  const $ = (id) => document.getElementById(id);

  // ---------- Registration ----------

  function registerFloor(floor) {
    floors[floor.number] = floor;
  }

  function registerCharacters(map) {
    Object.assign(characters, map);
  }

  function topFloor() {
    return Math.max(...Object.keys(floors).map(Number));
  }

  // ---------- State ----------

  function freshState() {
    return {
      floor: topFloor(),
      node: null,
      health: MAX_STAT,
      sanity: MAX_STAT,
      inventory: [],
      flags: {},
    };
  }

  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ state, checkpoint })); } catch (e) { /* storage unavailable */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data.state || !floors[data.state.floor]) return false;
      state = data.state;
      checkpoint = data.checkpoint || clone(state);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  const has = (item) => state.inventory.includes(item);

  // ---------- Conditions & effects ----------

  // Returns true if every condition in `req` is met.
  function meets(req) {
    if (!req) return true;
    const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
    if (!list(req.item).every(has)) return false;
    if (list(req.notItem).some(has)) return false;
    if (!list(req.flag).every((f) => state.flags[f])) return false;
    if (list(req.notFlag).some((f) => state.flags[f])) return false;
    if (req.minSanity !== undefined && state.sanity < req.minSanity) return false;
    if (req.maxSanity !== undefined && state.sanity > req.maxSanity) return false;
    if (req.minHealth !== undefined && state.health < req.minHealth) return false;
    return true;
  }

  // Applies effects and returns a list of visible changes to show the player.
  function apply(fx) {
    const changes = [];
    if (!fx) return changes;
    const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

    for (const stat of ["health", "sanity"]) {
      if (fx[stat]) {
        const before = state[stat];
        state[stat] = Math.max(0, Math.min(MAX_STAT, state[stat] + fx[stat]));
        const diff = state[stat] - before;
        if (diff) changes.push({ text: `${diff > 0 ? "+" : ""}${diff} ${stat}`, good: diff > 0 });
      }
    }
    for (const item of list(fx.give)) {
      if (!has(item)) {
        state.inventory.push(item);
        changes.push({ text: `+ ${item}`, good: true, item });
      }
    }
    for (const item of list(fx.take)) {
      if (has(item)) {
        state.inventory = state.inventory.filter((i) => i !== item);
        changes.push({ text: `− ${item}`, good: false });
      }
    }
    for (const f of list(fx.set)) state.flags[f] = true;
    for (const f of list(fx.unset)) delete state.flags[f];
    return changes;
  }

  // ---------- Flow ----------

  function start(useSave = true) {
    if (!(useSave && load())) {
      state = freshState();
      enterFloor(state.floor);
    } else {
      goTo(state.node, { skipEffects: true });
    }
  }

  function restart() {
    clearSave();
    start(false);
  }

  function retryFloor() {
    state = clone(checkpoint);
    goTo(floors[state.floor].start);
  }

  function enterFloor(number) {
    const floor = floors[number];
    if (!floor) return showScreen(toBeContinued(number));
    state.floor = number;
    checkpoint = clone(state);
    goTo(floor.start);
  }

  function goTo(nodeId, opts = {}) {
    const floor = floors[state.floor];
    const node = floor.nodes[nodeId];
    if (!node) {
      console.error(`Floor ${state.floor}: missing node "${nodeId}"`);
      return;
    }
    state.node = nodeId;

    const changes = opts.skipEffects ? [] : apply(node.effects);

    if (state.health <= 0) return showScreen(deathScreen(node.deathText || "Your body gives out. The building keeps you."));
    if (state.sanity <= 0) return showScreen(deathScreen(node.madnessText || "You stop looking for the stairs. You sit down in the hallway, and you listen to the walls, and after a while they start to make sense."));

    if (node.death) return showScreen(deathScreen(node.death));
    if (node.ending) { clearSave(); return showScreen(endingScreen(node.ending)); }

    save();
    render(floor, node, changes);
  }

  function choose(choice) {
    const changes = apply(choice.effects);
    if (choice.descend) return descend();
    if (state.health <= 0 || state.sanity <= 0) return goTo(state.node, { skipEffects: true });
    // Show stat changes from the choice on the next node too.
    pendingChanges = changes;
    goTo(choice.next);
  }

  function descend() {
    enterFloor(state.floor - 1);
  }

  let pendingChanges = [];

  // ---------- Rendering ----------

  function updateHud() {
    $("floor-num").textContent = state.floor;
    $("health-bar").style.width = `${state.health}%`;
    $("sanity-bar").style.width = `${state.sanity}%`;
  }

  function renderInventory(newItems = []) {
    const inv = $("inventory");
    inv.innerHTML = "";
    for (const item of state.inventory) {
      const el = document.createElement("span");
      el.className = "item" + (newItems.includes(item) ? " new" : "");
      el.textContent = item;
      inv.appendChild(el);
    }
  }

  function render(floor, node, changes) {
    changes = [...pendingChanges, ...changes];
    pendingChanges = [];

    updateHud();
    renderInventory(changes.filter((c) => c.item).map((c) => c.item));

    $("floor-title").textContent = `Floor ${floor.number} — ${floor.title}`;

    const who = node.speaker ? characters[node.speaker] || { name: node.speaker } : null;
    const speakerEl = $("speaker");
    speakerEl.textContent = who ? who.name : "";
    speakerEl.style.color = who && who.color ? who.color : "";

    const textEl = $("text");
    textEl.className = who ? "" : "narration";

    if (changes.some((c) => !c.good && !c.item)) {
      const scene = $("scene");
      scene.classList.remove("shake");
      void scene.offsetWidth; // restart animation
      scene.classList.add("shake");
    }

    $("choices").innerHTML = "";
    typeText(textEl, node.text, () => {
      for (const c of changes) {
        const tag = document.createElement("span");
        tag.className = "stat-change " + (c.good ? "good" : "bad");
        tag.textContent = c.text;
        textEl.appendChild(tag);
      }
      renderChoices(node);
    });
  }

  function renderChoices(node) {
    const box = $("choices");
    box.innerHTML = "";

    let options;
    if (node.choices) {
      options = node.choices.filter((c) => meets(c.requires) || c.lockedText);
    } else if (node.descend) {
      options = [{ text: node.descendText || "Take the stairs down.", descend: true }];
    } else if (node.next) {
      options = [{ text: "Continue", next: node.next }];
    } else {
      options = [];
    }

    options.forEach((choice, i) => {
      const unlocked = meets(choice.requires);
      const btn = document.createElement("button");
      btn.className = "choice";
      btn.innerHTML = `<span class="key">${i + 1}.</span>`;
      btn.appendChild(document.createTextNode(unlocked ? choice.text : choice.lockedText));
      if (unlocked && choice.requires && choice.requires.item) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `[${[].concat(choice.requires.item).join(", ")}]`;
        btn.appendChild(tag);
      }
      if (!unlocked) {
        btn.disabled = true;
        btn.style.opacity = 0.45;
        btn.style.cursor = "not-allowed";
      }
      btn.addEventListener("click", () => choose(choice));
      box.appendChild(btn);
    });
  }

  function typeText(el, text, done) {
    if (typing) clearInterval(typing.timer);
    el.textContent = "";
    let i = 0;
    const finish = () => {
      clearInterval(typing.timer);
      typing = null;
      el.textContent = text;
      el.onclick = null;
      done();
    };
    typing = {
      finish,
      timer: setInterval(() => {
        i += 2;
        el.textContent = text.slice(0, i);
        if (i >= text.length) finish();
      }, 22),
    };
    el.onclick = finish;
  }

  function showScreen(screen) {
    updateHud();
    renderInventory();
    $("floor-title").textContent = screen.title;
    $("speaker").textContent = "";
    const textEl = $("text");
    textEl.className = "narration";
    $("choices").innerHTML = "";
    typeText(textEl, screen.text, () => {
      const box = $("choices");
      screen.buttons.forEach(([label, fn], i) => {
        const btn = document.createElement("button");
        btn.className = "choice";
        btn.innerHTML = `<span class="key">${i + 1}.</span>`;
        btn.appendChild(document.createTextNode(label));
        btn.addEventListener("click", fn);
        box.appendChild(btn);
      });
    });
  }

  function deathScreen(text) {
    clearSave();
    return {
      title: `Died on floor ${state.floor}`,
      text,
      buttons: [
        [`Retry floor ${state.floor}`, retryFloor],
        ["Start over from the top", restart],
      ],
    };
  }

  function endingScreen(text) {
    return { title: "Outside", text, buttons: [["Play again", restart]] };
  }

  function toBeContinued(number) {
    return {
      title: `Floor ${number}`,
      text: "The stairwell keeps going down, but this floor hasn't been written yet.\n\nTo be continued.",
      buttons: [["Start over from the top", restart]],
    };
  }

  // Keyboard: number keys pick a choice, space/enter skips the typewriter.
  document.addEventListener("keydown", (e) => {
    if (typing && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      return typing.finish();
    }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9) {
      const btn = document.querySelectorAll("#choices .choice")[n - 1];
      if (btn && !btn.disabled) btn.click();
    }
  });

  return { registerFloor, registerCharacters, start, restart };
})();
