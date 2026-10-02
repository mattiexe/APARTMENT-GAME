/*
 * Way Down — visual novel engine.
 *
 * The building is a stack of floors. Each floor is a "stage" with its own
 * theme and its own rule. The elevator only goes down once that rule is met;
 * it can always go back up to floors you've already cleared.
 *
 * Floors register themselves with Game.registerFloor({...}) and characters
 * with Game.registerCharacters({...}). See README.md for the full format.
 */
const Game = (() => {
  const SAVE_KEY = "waydown-save-v2";

  const floors = {};       // floor number -> floor definition
  const characters = {};   // id -> { name, color, bio, image, silent }

  let state = null;        // the live game state
  let checkpoint = null;   // copy of state when the current floor was first entered
  let typing = null;       // active typewriter, if any
  let pendingChanges = []; // changes from a choice, shown on the next node

  const $ = (id) => document.getElementById(id);
  const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
  const clone = (obj) => JSON.parse(JSON.stringify(obj));

  // ---------- Registration ----------

  function registerFloor(floor) {
    floors[floor.number] = floor;
  }

  function registerCharacters(map) {
    Object.assign(characters, map);
  }

  const topFloor = () => Math.max(...Object.keys(floors).map(Number));

  // ---------- State ----------

  function freshState() {
    return {
      floor: topFloor(),
      node: null,
      inventory: [],
      flags: {},
      met: [],       // characters the player knows
      dead: [],      // characters who have died
      bios: {},      // dossier entries rewritten during the story
      phone: [],     // text messages: { from, text, read }
      onStage: [],   // portraits currently shown
      visited: [],   // floors reached so far
    };
  }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ state, checkpoint })); } catch (e) { /* storage unavailable */ }
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!data || !data.state || !floors[data.state.floor]) return false;
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
  const alive = (id) => !state.dead.includes(id);

  // ---------- Conditions & effects ----------

  function meets(req) {
    if (!req) return true;
    if (!list(req.item).every(has)) return false;
    if (list(req.notItem).some(has)) return false;
    if (!list(req.flag).every((f) => state.flags[f])) return false;
    if (list(req.notFlag).some((f) => state.flags[f])) return false;
    if (!list(req.alive).every(alive)) return false;
    if (list(req.dead).some(alive)) return false;
    if (req.deaths !== undefined && state.dead.length < req.deaths) return false;
    if (req.anyFlag && !list(req.anyFlag).some((f) => state.flags[f])) return false;
    return true;
  }

  // Applies effects and returns the visible changes to show the player.
  function apply(fx) {
    const changes = [];
    if (!fx) return changes;

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
    for (const id of list(fx.meet)) {
      if (!state.met.includes(id)) {
        state.met.push(id);
        changes.push({ text: `Dossier: ${characters[id] ? characters[id].name : id}`, good: true });
      }
    }
    for (const [id, text] of Object.entries(fx.bio || {})) {
      state.bios[id] = text;
      changes.push({ text: `Dossier updated: ${characters[id] ? characters[id].name : id}`, good: true });
    }
    for (const sms of list(fx.sms)) {
      state.phone.push({ from: sms.from, text: sms.text, read: false });
      changes.push({ text: `📱 ${characters[sms.from] ? characters[sms.from].name : sms.from}`, good: true });
    }
    for (const id of list(fx.kill)) {
      if (alive(id)) {
        state.dead.push(id);
        changes.push({ text: `${characters[id] ? characters[id].name : id} died`, good: false });
      }
    }
    return changes;
  }

  // ---------- Flow ----------

  function start(useSave = true) {
    if (useSave && load()) return goTo(state.node, { skipEffects: true });
    state = freshState();
    enterFloor(state.floor);
  }

  function restart() {
    clearSave();
    start(false);
  }

  function retryFloor() {
    state = clone(checkpoint);
    goTo(floors[state.floor].start);
  }

  // Arrive on a floor by elevator (or at the start of the game).
  function enterFloor(number) {
    const floor = floors[number];
    if (!floor) return showScreen(toBeContinued(number));
    const firstVisit = !state.visited.includes(number);
    state.floor = number;
    if (firstVisit) {
      state.visited.push(number);
      checkpoint = clone(state);
      goTo(floor.start);
    } else {
      goTo(floor.hub || floor.start);
    }
  }

  function goTo(nodeId, opts = {}) {
    const floor = floors[state.floor];
    const node = floor.nodes[nodeId];
    if (!node) {
      console.error(`Floor ${state.floor}: missing node "${nodeId}"`);
      return;
    }
    state.node = nodeId;
    if (node.show) state.onStage = list(node.show);

    const changes = opts.skipEffects ? [] : apply(node.effects);

    if (node.death) return showScreen(deathScreen(node.death));
    if (node.ending) { clearSave(); return showScreen(endingScreen(node.ending)); }

    save();
    render(floor, node, changes);
  }

  function choose(choice) {
    pendingChanges = apply(choice.effects);
    if (choice.floor !== undefined) return enterFloor(choice.floor);
    goTo(choice.next);
  }

  // The rule of a floor is met when its `requires` conditions are true.
  const ruleMet = (floor) => !floor.rule || meets(floor.rule.requires);

  // ---------- Rendering ----------

  function renderHud(floor) {
    $("floor-num").textContent = state.floor;
    $("floor-theme").textContent = floor ? floor.title : "";
    $("stage").style.background = (floor && floor.background) || "";
    renderPhoneBadge();
  }

  function renderPhoneBadge() {
    const unread = (state.phone || []).filter((m) => !m.read).length;
    const badge = $("phone-badge");
    badge.textContent = unread;
    badge.hidden = unread === 0;
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

  function portraitEl(id, extraClass = "") {
    const who = characters[id] || { name: id };
    const el = document.createElement("div");
    el.className = `portrait ${extraClass}`;
    el.style.setProperty("--c", who.color || "#888");
    if (who.image) {
      const img = document.createElement("img");
      img.src = who.image;
      img.alt = who.name;
      el.appendChild(img);
    } else {
      el.innerHTML = `<div class="head"><span class="initial">${who.name.charAt(0)}</span></div><div class="body"></div>`;
      if (who.hat) el.classList.add("hat");
    }
    if (!alive(id)) el.classList.add("dead");
    return el;
  }

  function renderPortraits(speaker) {
    const box = $("portraits");
    box.innerHTML = "";
    for (const id of state.onStage) {
      const cls = speaker ? (id === speaker ? "speaking" : "dim") : "";
      box.appendChild(portraitEl(id, cls));
    }
  }

  function render(floor, node, changes) {
    changes = [...pendingChanges, ...changes];
    pendingChanges = [];

    renderHud(floor);
    renderInventory(changes.filter((c) => c.item).map((c) => c.item));
    renderPortraits(node.speaker);

    const who = node.speaker ? characters[node.speaker] || { name: node.speaker } : null;
    const nameEl = $("speaker");
    nameEl.textContent = who ? who.name : "";
    nameEl.style.display = who ? "" : "none";
    nameEl.style.setProperty("--c", who && who.color ? who.color : "#888");

    const textEl = $("text");
    textEl.className = who ? "" : "narration";

    if (changes.some((c) => !c.good && !c.item)) {
      const stage = $("stage");
      stage.classList.remove("shake");
      void stage.offsetWidth; // restart the animation
      stage.classList.add("shake");
    }

    $("choices").innerHTML = "";
    typeText(textEl, node.text, () => {
      for (const c of changes) {
        const tag = document.createElement("span");
        tag.className = "stat-change " + (c.good ? "good" : "bad");
        tag.textContent = c.text;
        textEl.appendChild(tag);
      }
      renderChoices(floor, node);
    });
  }

  function optionsFor(floor, node) {
    let options = [];
    if (node.choices) options = node.choices.filter((c) => meets(c.requires) || c.lockedText);
    else if (node.next) options = [{ text: "Continue", next: node.next }];

    if (node.elevator) {
      const met = ruleMet(floor);
      options.push({
        text: "Take the elevator down.",
        lockedText: `Elevator down — locked until the rule is met.`,
        floor: state.floor - 1,
        locked: !met,
        elevator: true,
      });
      if (floors[state.floor + 1] && state.visited.includes(state.floor + 1)) {
        options.push({ text: `Take the elevator back up to floor ${state.floor + 1}.`, floor: state.floor + 1, elevator: true });
      }
    }
    return options;
  }

  function renderChoices(floor, node) {
    const box = $("choices");
    box.innerHTML = "";
    optionsFor(floor, node).forEach((choice, i) => {
      const unlocked = !choice.locked && meets(choice.requires);
      const btn = document.createElement("button");
      btn.className = "choice" + (choice.elevator ? " elevator" : "");
      btn.innerHTML = `<span class="key">${i + 1}</span>`;
      btn.appendChild(document.createTextNode(unlocked ? choice.text : choice.lockedText));
      if (unlocked && choice.requires && choice.requires.item) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `[${list(choice.requires.item).join(", ")}]`;
        btn.appendChild(tag);
      }
      if (!unlocked) btn.disabled = true;
      else btn.addEventListener("click", () => choose(choice));
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
    renderHud(floors[state.floor]);
    renderInventory();
    state.onStage = [];
    renderPortraits(null);
    $("speaker").style.display = "none";
    const textEl = $("text");
    textEl.className = "narration";
    $("choices").innerHTML = "";
    typeText(textEl, `${screen.title.toUpperCase()}\n\n${screen.text}`, () => {
      screen.buttons.forEach(([label, fn], i) => {
        const btn = document.createElement("button");
        btn.className = "choice";
        btn.innerHTML = `<span class="key">${i + 1}</span>`;
        btn.appendChild(document.createTextNode(label));
        btn.addEventListener("click", fn);
        $("choices").appendChild(btn);
      });
    });
  }

  function deathScreen(text) {
    clearSave();
    return {
      title: `You died on floor ${state.floor}`,
      text,
      buttons: [
        [`Retry floor ${state.floor}`, retryFloor],
        ["Start over from the top", restart],
      ],
    };
  }

  function endingScreen(text) {
    return { title: "The End", text, buttons: [["Play again", restart]] };
  }

  function toBeContinued(number) {
    state.floor = number;
    return {
      title: `Floor ${number}`,
      text: "The elevator doors open on a floor that hasn't been written yet.\n\nTo be continued.",
      buttons: [["Start over from the top", restart]],
    };
  }

  // ---------- Side panels ----------

  function openPanel(title, html) {
    $("panel-title").textContent = title;
    $("panel-body").innerHTML = html;
    $("panel").hidden = false;
  }

  function closePanel() {
    $("panel").hidden = true;
  }

  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function showRules() {
    const rows = [...state.visited]
      .sort((a, b) => b - a)
      .map((n) => floors[n])
      .filter((f) => f && f.rule)
      .map((f) => `
        <div class="rule ${ruleMet(f) ? "met" : ""}">
          <div class="rule-head">Floor ${f.number} — ${escape(f.title)} <span>${ruleMet(f) ? "✓ met" : "not met"}</span></div>
          <div class="rule-text">${escape(f.rule.text)}</div>
        </div>`);
    openPanel("Rules", rows.join("") || "<p>No rules yet.</p>");
  }

  function showCast() {
    const rows = state.met.map((id) => {
      const who = characters[id] || { name: id };
      const tmp = document.createElement("div");
      tmp.appendChild(portraitEl(id, "small"));
      return `
        <div class="cast ${alive(id) ? "" : "is-dead"}">
          ${tmp.innerHTML}
          <div>
            <div class="cast-name" style="color:${who.color || "inherit"}">${escape(who.name)}${alive(id) ? "" : " <small>(dead)</small>"}</div>
            <div class="cast-bio">${escape(state.bios[id] || who.bio || "???")}</div>
          </div>
        </div>`;
    });
    openPanel("Dossier", rows.join("") || "<p>You don't know anyone yet.</p>");
  }

  function showPhone() {
    const msgs = state.phone || [];
    const html = msgs.map((m) => {
      const who = characters[m.from] || { name: m.from };
      return `
        <div class="sms ${m.read ? "" : "unread"}">
          <div class="sms-from" style="color:${who.color || "inherit"}">${escape(who.name)}</div>
          <div class="sms-text">${escape(m.text)}</div>
        </div>`;
    });
    openPanel("Phone", html.join("") || "<p>No messages.</p>");
    msgs.forEach((m) => { m.read = true; });
    renderPhoneBadge();
    save();
  }

  // ---------- Input ----------

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closePanel();
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

  return { registerFloor, registerCharacters, start, restart, showRules, showCast, showPhone, closePanel };
})();
