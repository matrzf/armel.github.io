// === charts/pieChart.js ===
export function renderPieChart(data, labelCounts, labels) {
    const pieSvg = d3.select("#pie-chart"),
          pieWidth = +pieSvg.attr("width"),
          pieHeight = +pieSvg.attr("height"),
          radius = Math.min(pieWidth, pieHeight) / 2;
  
    const pieGroup = pieSvg.append("g")
      .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);
  
    const color = d3.scaleOrdinal()
      .domain(labels)
      .range(d3.schemeSet2);
  
    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);
    const arcs = pie(Array.from(labelCounts.entries()));
  
    pieGroup.selectAll("path")
      .data(arcs)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data[0]))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .append("title")
      .text(d => `${d.data[0]}: ${d.data[1]}`);

      // === Légende ===
  const legend = pieSvg.append("g")
  .attr("transform", `translate(${pieWidth - 150}, ${20})`)
  .attr("class", "legend");

const legendItems = legend.selectAll(".legend-item")
  .data(labels)
  .enter().append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

legendItems.append("rect")
  .attr("x", 0)
  .attr("width", 15)
  .attr("height", 15)
  .attr("fill", d => color(d));

legendItems.append("text")
  .attr("x", 20)
  .attr("y", 12)
  .text(d => d)
  .attr("font-size", "12px")
  .attr("alignment-baseline", "middle");
}