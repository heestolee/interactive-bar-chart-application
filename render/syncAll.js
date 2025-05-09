import { renderChart } from "./chart.js";
import { renderTableEditor } from "./tableEditor.js";
import { renderJsonEditor } from "./jsonEditor.js";

export function syncAll() {
  renderChart();
  renderTableEditor();
  renderJsonEditor();
}
