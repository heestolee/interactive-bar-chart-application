import { getData, setData } from "../store/dataStore.js";
import { syncAll } from "../render/syncAll.js";

export function addEntry() {
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
  syncAll();

  idInputEl.value = "";
  valueInputEl.value = "";
  idInputEl.focus();
}
