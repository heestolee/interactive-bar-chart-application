import { setData } from "../store/dataStore.js";
import { syncAll } from "../render/syncAll.js";
import { isValidId, isValidValue } from "../utils/validate.js";
import { cleanJsonInput } from "../utils/cleanJsonInput.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

export function applyJsonEdit() {
  try {
    const jsonTextareaEl = document.getElementById("json-editor");
    const cleanedJson = cleanJsonInput(jsonTextareaEl.value);
    const parsedData = JSON.parse(cleanedJson);

    if (!Array.isArray(parsedData)) {
      throw new Error(ERROR_MESSAGES.INVALID_JSON_FORMAT);
    }

    const isValidFormat = parsedData.every(
      (entry) =>
        typeof entry === "object" &&
        isValidId(entry.id) &&
        isValidValue(entry.value)
    );
    if (!isValidFormat) throw new Error(ERROR_MESSAGES.INVALID_JSON_ENTRY);

    const idSet = new Set();
    const hasDuplicateId = parsedData.some((entry) => {
      const normalizedId = String(entry.id).trim();
      if (idSet.has(normalizedId)) return true;
      idSet.add(normalizedId);
      return false;
    });
    if (hasDuplicateId) throw new Error(ERROR_MESSAGES.DUPLICATE_ID);

    const normalizedData = parsedData.map((entry) => ({
      id: String(entry.id).trim(),
      value: entry.value,
    }));

    setData(normalizedData);
    syncAll();
  } catch (error) {
    if (error instanceof SyntaxError) {
      alert(ERROR_MESSAGES.INVALID_JSON_SYNTAX);
    } else {
      alert("❌ JSON 형식 오류:\n\n" + error.message);
    }
  }
}
