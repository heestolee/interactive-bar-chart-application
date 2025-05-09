import { getData, setData } from "./store/dataStore.js";
import { syncAll } from "./render/syncAll.js";
import { applyTableChanges } from "./features/applyTableChanges.js";

function addEntry() {
  const idInputEl = document.getElementById("id-input");
  const valueInputEl = document.getElementById("value-input");
  const id = parseInt(idInputEl.value);
  const value = parseInt(valueInputEl.value);

  if (isNaN(id) || isNaN(value)) {
    alert("숫자를 입력하세요.");
    return;
  }

  const currentData = getData();
  if (currentData.some((entry) => entry.id === id)) {
    alert("중복된 ID입니다.");
    return;
  }

  setData([...currentData, { id, value }]);
  idInputEl.value = "";
  valueInputEl.value = "";
  syncAll();
}

function applyJsonEdit() {
  try {
    const jsonTextareaEl = document.getElementById("json-editor");
    const parsedData = JSON.parse(jsonTextareaEl.value);

    if (!Array.isArray(parsedData)) {
      throw new Error("JSON은 배열이어야 합니다.");
    }

    const isValidFormat = parsedData.every(
      (entry) =>
        typeof entry === "object" &&
        typeof entry.id === "number" &&
        typeof entry.value === "number"
    );
    if (!isValidFormat) throw new Error("유효한 JSON을 입력하세요.");

    const idSet = new Set();
    const hasDuplicateId = parsedData.some((entry) => {
      if (idSet.has(entry.id)) return true;
      idSet.add(entry.id);
      return false;
    });
    if (hasDuplicateId) throw new Error("ID는 중복될 수 없습니다.");

    setData(parsedData);
    syncAll();
  } catch (error) {
    if (error instanceof SyntaxError) {
      alert(
        "❌ JSON 문법 오류:\n\n" + "올바른 문법으로 작성되었는지 확인해주세요."
      );
    } else {
      alert("❌ JSON 형식 오류:\n\n" + error.message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  syncAll();
  document.getElementById("value-add-button").onclick = addEntry;
  document.getElementById("table-apply-button").onclick = applyTableChanges;
  document.getElementById("json-apply-button").onclick = applyJsonEdit;
});
