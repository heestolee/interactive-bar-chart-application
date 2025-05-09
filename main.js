import { syncAll } from "./render/syncAll.js";
import { applyTableChanges } from "./features/applyTableChanges.js";
import { addEntry } from "./features/addEntry.js";
import { applyJsonEdit } from "./features/applyJsonEdit.js";

document.addEventListener("DOMContentLoaded", () => {
  syncAll();

  const idInputEl = document.getElementById("id-input");
  const valueInputEl = document.getElementById("value-input");

  document.getElementById("value-add-button").onclick = addEntry;
  document.getElementById("table-apply-button").onclick = applyTableChanges;
  document.getElementById("json-apply-button").onclick = applyJsonEdit;

  [idInputEl, valueInputEl].forEach((inputEl) => {
    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addEntry();
      }
    });
  });
});
