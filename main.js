const dataSet = [
  { id: 0, value: 75 },
  { id: 1, value: 20 },
  { id: 2, value: 80 },
  { id: 3, value: 100 },
  { id: 4, value: 70 },
];

function getData() {
  return dataSet.map((dataItem) => ({ ...dataItem }));
}

function setData(newDataSet) {
  dataSet.length = 0;
  dataSet.push(...newDataSet.map(({ id, value }) => ({ id, value })));
}

function renderChart() {
  const chartContainerEl = document.getElementById("chart-container");
  chartContainerEl.textContent = "";

  const currentData = getData();
  const maxValue = Math.max(...currentData.map((item) => item.value), 100);

  currentData.forEach((dataItem) => {
    const barEl = document.createElement("div");
    barEl.style.width = "30px";
    barEl.style.height = `${(dataItem.value / maxValue) * 100}%`;
    barEl.style.background = "lightgray";
    barEl.title = `id: ${dataItem.id}, value: ${dataItem.value}`;
    chartContainerEl.appendChild(barEl);
  });
}

function renderTable() {
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
    deleteButtonEl.onclick = () => {
      const filteredData = getData().filter(
        (entry) => entry.id !== dataItem.id
      );
      setData(filteredData);
      syncAll();
    };
    deleteCellEl.appendChild(deleteButtonEl);
    rowEl.appendChild(deleteCellEl);

    tableBodyEl.appendChild(rowEl);
  });
}

function renderJson() {
  const jsonTextareaEl = document.getElementById("json-editor");
  jsonTextareaEl.value = JSON.stringify(getData(), null, 2);
}

function syncAll() {
  renderChart();
  renderTable();
  renderJson();
}

function applyTableChanges() {
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
