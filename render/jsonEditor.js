import { getData } from "../store/dataStore.js";

export function renderJsonEditor() {
  const jsonTextareaEl = document.getElementById("json-editor");
  jsonTextareaEl.value = JSON.stringify(getData(), null, 2);
}
