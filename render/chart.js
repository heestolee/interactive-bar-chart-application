import { getData } from "../store/dataStore.js";

export function renderChart() {
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
