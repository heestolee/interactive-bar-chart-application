import { setData } from "../store/dataStore.js";
import { syncAll } from "../render/syncAll.js";
import { isValidId, isValidValue } from "../utils/validate.js";

export function applyJsonEdit() {
  try {
    const jsonTextareaEl = document.getElementById("json-editor");
    const parsedData = JSON.parse(jsonTextareaEl.value);

    if (!Array.isArray(parsedData)) {
      throw new Error("JSON은 배열이어야 합니다.");
    }

    const isValidFormat = parsedData.every(
      (entry) =>
        typeof entry === "object" &&
        isValidId(entry.id) &&
        isValidValue(entry.value)
    );
    if (!isValidFormat) throw new Error("ID와 VALUE 형식이 올바르지 않습니다.");

    const idSet = new Set();
    const hasDuplicateId = parsedData.some((entry) => {
      const normalizedId = String(entry.id).trim();
      if (idSet.has(normalizedId)) return true;
      idSet.add(normalizedId);
      return false;
    });
    if (hasDuplicateId) throw new Error("ID는 중복될 수 없습니다.");

    const normalizedData = parsedData.map((entry) => ({
      id: String(entry.id).trim(),
      value: entry.value,
    }));

    setData(normalizedData);
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
