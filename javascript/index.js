'use strict';

const search = document.getElementById("charSearch");
const difficultySelect = document.getElementById("difficultyFilter");

const list = Array.from(document.querySelectorAll(".char-grid li"));
const noMsg = document.getElementById("noCharsMsg");

// Funktion zum Filtern der Charaktere basierend auf Suchanfrage und Schwierigkeitsgrad
function filter(q = "", difficulty = "all") {
  const needle = q.trim().toLowerCase();

  // erste Positionen der Listenelemente speichern, für Animation
  const firstRects = new Map(list.map((li) => [li, li.getBoundingClientRect()]));
  let visible = 0;

  // durch alle Listenelemente iterieren und entscheiden, ob sie angezeigt oder versteckt werden sollen
  list.forEach((li) => {
    const name = li.querySelector(".char-name").textContent.trim().toLowerCase();
    // Element soll angezeigt werden, wenn der Name die Suchanfrage enthält und die Schwierigkeit entweder "all" ist oder mit der Schwierigkeit des Elements übereinstimmt
    const shouldShow =
      name.includes(needle) && (difficulty === "all" || li.classList.contains(difficulty));
    // Element anzeigen oder verstecken
    li.hidden = !shouldShow;
    // visible inkrementieren, damit noMsg weiß, ob es angezeigt werden soll
    if (shouldShow) visible++;
  });

  // Animation der Listenelemente, die sich durch das Filtern verschieben
  list.forEach((li) => {
    if (li.hidden) return;
    // Position vor der Änderung
    const old = firstRects.get(li);
    // Position nach der Änderung
    const updated = li.getBoundingClientRect();
    if (old.left === 0 && old.top === 0) return;
    // Differenz berechnen, für Animation zur neuen Position
    const dx = old.left - updated.left;
    const dy = old.top - updated.top;
    if (!dx && !dy) return;
    // Auf alte Position transformieren, damit die Animation von der alten zur neuen Position läuft
    li.style.transition = "none";
    li.style.transform = `translate(${dx}px, ${dy}px)`;
    // reflow erzwingen, damit die vorherige Zeile wirksam wird
    li.getBoundingClientRect();
    // Animation zurück zur neuen Position
    li.style.transition = "transform 320ms ease";
    li.style.transform = "";
  });

  // noMsg anzeigen, wenn kein Charakter sichtbar ist
  noMsg.hidden = visible > 0;
}

// EventListener für die Suche und den Schwierigkeitsfilter die auf Änderungen der Eingaben reagieren
search.addEventListener("input", (e) => filter(e.target.value, difficultySelect.value));
difficultySelect.addEventListener("change", (e) => filter(search.value, e.target.value));

// EventListener für / um Fokus auf die Suche zu setzen
document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    search.focus();
  }
});

// Öffnet den Charakterguide in einem neuen Tab
document.addEventListener("click", (e) => {
  const a = e.target.closest("a.char-box");
  if (a) {
    e.preventDefault();
    window.open(a.href, "_blank");
  }
});
