// Checks every floor for broken links and unknown characters.
// Run with: node tools/check.js
const fs = require("fs");
const path = require("path");

const floors = [];
const characters = {};
global.Game = {
  registerFloor: (f) => floors.push(f),
  registerCharacters: (map) => Object.assign(characters, map),
};
const js = path.join(__dirname, "..", "js");
require(path.join(js, "characters.js"));
for (const file of fs.readdirSync(path.join(js, "floors"))) require(path.join(js, "floors", file));

const list = (v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
let errors = 0;

for (const floor of floors.sort((a, b) => b.number - a.number)) {
  const ids = new Set(Object.keys(floor.nodes));
  const reached = new Set([floor.start, floor.hub]);
  const err = (msg) => { errors++; console.log(`Floor ${floor.number}: ${msg}`); };
  const checkChar = (where, id) => { if (!characters[id]) err(`"${where}" uses unknown character "${id}"`); };
  const checkFx = (where, fx = {}) => {
    [...list(fx.meet), ...list(fx.kill), ...Object.keys(fx.bio || {}), ...list(fx.sms).map((m) => m.from)].forEach((id) => checkChar(where, id));
  };

  if (!ids.has(floor.start)) err(`start node "${floor.start}" does not exist`);
  if (floor.hub && !ids.has(floor.hub)) err(`hub node "${floor.hub}" does not exist`);

  for (const [id, node] of Object.entries(floor.nodes)) {
    if (node.speaker) checkChar(id, node.speaker);
    list(node.show).forEach((c) => checkChar(id, c));
    checkFx(id, node.effects);

    const targets = [node.next, ...(node.choices || []).map((c) => c.next)].filter(Boolean);
    targets.forEach((t) => { reached.add(t); if (!ids.has(t)) err(`"${id}" points to missing node "${t}"`); });

    if (!(node.next || node.choices || node.elevator || node.death || node.ending)) {
      err(`"${id}" is a dead end (no next, choices, elevator, death or ending)`);
    }
    for (const c of node.choices || []) {
      if (!c.next && c.floor === undefined) err(`a choice in "${id}" goes nowhere`);
      checkFx(id, c.effects);
    }
  }
  for (const id of ids) if (!reached.has(id)) err(`"${id}" can never be reached`);
}

console.log(errors ? `\n${errors} problem(s) found.` : `All ${floors.length} floors OK.`);
process.exit(errors ? 1 : 0);
