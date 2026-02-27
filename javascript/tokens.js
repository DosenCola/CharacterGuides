(function () {
  "use strict";

  const container = document.querySelector(".guide-sections");

  // Regex für Tokens: 1–3 Zeichen (ohne Klammern oder Schrägstriche) gefolgt von S, K, H, P oder D
  // Ausschlusszeichen: whitespace, (), / und \\ (Vorwärt-/Rückwärtsschrägstrich)
  const tokenRegex = /([^\s()\/\\]{1,6})([SKHPD])/g;

  function applyNotation(node) {
    let child = node.firstChild;
    while (child) {
      const next = child.nextSibling;
      // Nur Textknoten betrachten
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.nodeValue;
        if (tokenRegex.test(text)) {
          // Reset regex state
          tokenRegex.lastIndex = 0;
          // Fragment erstellen, um die neuen Knoten einzufügen
          const frag = document.createDocumentFragment();
          let lastIndex = 0;
          // Text durchgehen und Tokens ersetzen
          text.replace(tokenRegex, (match, p1, p2, offset) => {
            if (offset > lastIndex) {
              frag.appendChild(
                document.createTextNode(text.slice(lastIndex, offset)),
              );
            }
            const span = document.createElement("span");
            // Klasse basierend auf dem Token-Typ (S/K/H/P/D) (wichtig für die Farbgebung in CSS)
            span.className = "token token-" + p2;
            // Text des Tokens (z.B. "abcS")
            span.textContent = p1 + p2;
            // Token zum Fragment hinzufügen
            frag.appendChild(span);
            lastIndex = offset + match.length;
            return match;
          });
          // Restlichen Text nach dem letzten Token hinzufügen
          if (lastIndex < text.length)
            frag.appendChild(document.createTextNode(text.slice(lastIndex)));
          child.parentNode.replaceChild(frag, child);
        }
        // Wenn kein Token gefunden wurde, bleibt der Text unverändert
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Rekursiver Funktionsaufruf für Kindknoten
        applyNotation(child);
      }
        child = next;
    }
  }

  // applyNotation aufrufen, wenn das DOM bereit ist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      applyNotation(container),
    );
  } else {
    applyNotation(container);
  }
})();
