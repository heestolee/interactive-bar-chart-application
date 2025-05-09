import { getData } from "../store/dataStore.js";

export function renderChart() {
  const chartContainerEl = document.getElementById("chart-container");
  chartContainerEl.textContent = "";

  const currentData = getData();
  const rawMaxValue = Math.max(...currentData.map((item) => item.value), 1);

  const getLogHeight = (value) => {
    return (Math.log(value + 1) / Math.log(rawMaxValue + 1)) * 100;
  };

  currentData.forEach((dataItem) => {
    const barEl = document.createElement("div");
    barEl.style.width = "30px";
    barEl.style.height = `${getLogHeight(dataItem.value)}%`;
    barEl.style.background = "lightgray";
    barEl.title = `id: ${dataItem.id}, value: ${dataItem.value}`;
    chartContainerEl.appendChild(barEl);
  });
}
