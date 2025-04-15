// === script.js ===
import { renderBarChart } from "./charts/barChart.js";
import { renderScatterPlot } from "./charts/scatterPlot.js";
import { renderPieChart } from "./charts/pieChart.js";
import { renderHeatmap } from "./charts/heatmap.js";
import { renderSankeyDiagram } from "./charts/sankeyDiagram.js";

// Chargement et parsing CSV
d3.csv("Friday-WorkingHours-Afternoon-DDos.pcap_ISCX.csv").then(data => {
  data.forEach(d => {
    d[' Flow Duration'] = +d[' Flow Duration'];
    d[' Total Fwd Packets'] = +d[' Total Fwd Packets'];
    d[' Total Backward Packets'] = +d[' Total Backward Packets'];
  });

  const labelCounts = d3.rollup(data, v => v.length, d => d[' Label']);
  const labels = Array.from(labelCounts.keys());

  const width = 700, height = 400;
  const margin = { top: 20, right: 30, bottom: 50, left: 50 };

  renderBarChart(data, labels, labelCounts, width, height, margin);
  renderScatterPlot(data, labels, width, height, margin);
  renderPieChart(data, labelCounts, labels);
  renderHeatmap(data, [' Flow Duration', ' Total Fwd Packets', ' Total Backward Packets']);
  renderSankeyDiagram(data); // Ajout du Sankey
});