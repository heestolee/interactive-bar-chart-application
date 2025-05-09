import { getData, setData } from "../store/dataStore.js";
import { syncAll } from "./syncAll.js";

export function renderTableEditor() {
  const tableBodyEl = document.querySelector("#value-table tbody");
  tableBodyEl.textContent = "";

  const currentData = getData();

  currentData.forEach((dataItem) => {
    const rowEl = document.createElement("tr");
    const idCellEl = document.createElement("td");
    idCellEl.textContent = dataItem.id;
    rowEl.appendChild(idCellEl);

    const valueCellEl = document.createElement("td");
    const valueInputEl = document.createElement("input");
    valueInputEl.type = "number";
    valueInputEl.value = dataItem.value;
    valueInputEl.dataset.id = dataItem.id;
    valueCellEl.appendChild(valueInputEl);
    rowEl.appendChild(valueCellEl);

    const deleteCellEl = document.createElement("td");
    const deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "삭제";
    deleteButtonEl.addEventListener("click", () => {
      const updated = getData().filter((entry) => entry.id !== dataItem.id);
      setData(updated);
      syncAll();
    });
    deleteCellEl.appendChild(deleteButtonEl);
    rowEl.appendChild(deleteCellEl);

    tableBodyEl.appendChild(rowEl);
  });
}
