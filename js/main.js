const $ = (id) => document.getElementById(id);

// Blur after clicking so Space (used to skip text) doesn't re-press the button.
$("rules-btn").addEventListener("click", (e) => { e.currentTarget.blur(); Game.showRules(); });
$("phone-btn").addEventListener("click", (e) => { e.currentTarget.blur(); Game.showPhone(); });
$("cast-btn").addEventListener("click", (e) => { e.currentTarget.blur(); Game.showCast(); });
$("panel-close").addEventListener("click", Game.closePanel);
$("panel").addEventListener("click", (e) => { if (e.target.id === "panel") Game.closePanel(); });
$("menu-btn").addEventListener("click", () => {
  if (confirm("Restart from the top floor? Your progress will be lost.")) Game.restart();
});

Game.start();
