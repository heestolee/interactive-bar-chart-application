import { getData, setData } from "../store/dataStore.js";
import { syncAll } from "../render/syncAll.js";
import { isValidId, isValidValue } from "../utils/validate.js";

export function addEntry() {
  const idInputEl = document.getElementById("id-input");
  const valueInputEl = document.getElementById("value-input");

  const idRaw = idInputEl.value;
  const value = parseFloat(valueInputEl.value);

  if (!isValidId(idRaw) || !isValidValue(value)) {
    alert("유효한 ID와 숫자 값을 입력하세요.");
    return;
  }

  const id = String(idRaw).trim();
  const currentData = getData();

  if (currentData.some((entry) => String(entry.id) === id)) {
    alert("중복된 ID입니다.");
    return;
  }

  setData([...currentData, { id, value }]);
  syncAll();

  idInputEl.value = "";
  valueInputEl.value = "";
  idInputEl.focus();
}
