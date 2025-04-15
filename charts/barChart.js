// === charts/barChart.js ===
export function renderBarChart(data, labels, labelCounts, width, height, margin) {
    const svgBar = d3.select("#label-bar-chart");
  
    const x = d3.scaleBand().domain(labels).range([margin.left, width - margin.right]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(Array.from(labelCounts.values()))]).nice().range([height - margin.bottom, margin.top]);
  
    svgBar.append("g")
      .selectAll("rect")
      .data(labels)
      .join("rect")
      .attr("x", d => x(d))
      .attr("y", d => y(labelCounts.get(d)))
      .attr("height", d => y(0) - y(labelCounts.get(d)))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue");
  
    svgBar.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
  
    svgBar.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }