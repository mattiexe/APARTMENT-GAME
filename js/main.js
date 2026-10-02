// Characters who can speak. Use these ids as `speaker` in floor nodes.
Game.registerCharacters({
  you:     { name: "You",         color: "#e0b25a" },
  okafor:  { name: "Mrs. Okafor", color: "#c792ea" },
  dez:     { name: "Dez",         color: "#7fc8a9" },
  voice:   { name: "???",         color: "#ff6b5e" },
  intercom:{ name: "Intercom",    color: "#9aa5b1" },
});

document.getElementById("menu-btn").addEventListener("click", () => {
  if (confirm("Restart from the top floor? Your progress will be lost.")) Game.restart();
});

Game.start();
