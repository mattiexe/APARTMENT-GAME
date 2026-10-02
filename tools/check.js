// Checks every floor for broken links between dialogue nodes.
// Run with: node tools/check.js
const fs = require("fs");
const path = require("path");

const floors = [];
global.Game = { registerFloor: (f) => floors.push(f) };
const dir = path.join(__dirname, "..", "js", "floors");
for (const file of fs.readdirSync(dir)) require(path.join(dir, file));

let errors = 0;
for (const floor of floors) {
  const ids = new Set(Object.keys(floor.nodes));
  const reached = new Set([floor.start]);
  const err = (msg) => { errors++; console.log(`Floor ${floor.number}: ${msg}`); };
  if (!ids.has(floor.start)) err(`start node "${floor.start}" does not exist`);
  for (const [id, node] of Object.entries(floor.nodes)) {
    const targets = [node.next, ...(node.choices || []).map((c) => c.next)].filter(Boolean);
    targets.forEach((t) => { reached.add(t); if (!ids.has(t)) err(`"${id}" points to missing node "${t}"`); });
    const ends = node.next || node.choices || node.descend || node.death || node.ending;
    if (!ends) err(`"${id}" is a dead end (no next, choices, descend, death or ending)`);
    for (const c of node.choices || []) if (!c.next && !c.descend) err(`a choice in "${id}" goes nowhere`);
  }
  for (const id of ids) if (!reached.has(id)) err(`"${id}" can never be reached`);
}
console.log(errors ? `\n${errors} problem(s) found.` : `All ${floors.length} floors OK.`);
process.exit(errors ? 1 : 0);
