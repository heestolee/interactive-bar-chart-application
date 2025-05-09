import { getData, setData } from "../store/dataStore.js";
import { syncAll } from "../render/syncAll.js";

export function applyTableChanges() {
  const valueInputElements = document.querySelectorAll(
    "#value-table tbody input"
  );

  const updatedData = getData().map((dataItem) => {
    const matchedInputEl = [...valueInputElements].find(
      (inputEl) => parseInt(inputEl.dataset.id) === dataItem.id
    );

    return matchedInputEl
      ? { ...dataItem, value: parseInt(matchedInputEl.value) }
      : dataItem;
  });

  setData(updatedData);
  syncAll();
}
