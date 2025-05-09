import { getData } from "../store/dataStore.js";

export function renderChart() {
  const chartContainerEl = document.getElementById("chart-container");
  chartContainerEl.textContent = "";

  const currentData = getData();
  const rawMaxValue = Math.max(...currentData.map((item) => item.value), 1);

  const getLogHeight = (value) => {
    return (Math.log(value + 1) / Math.log(rawMaxValue + 1)) * 100;
  };

  currentData.forEach((dataItem, index) => {
    const barEl = document.createElement("div");
    barEl.className = "bar";
    barEl.title = `ID: ${dataItem.id}\nVALUE: ${dataItem.value}`;

    barEl.style.height = `${getLogHeight(dataItem.value)}%`;

    barEl.style.backgroundColor = index % 2 === 0 ? "#ccc" : "#eee";

    chartContainerEl.appendChild(barEl);
  });
}
