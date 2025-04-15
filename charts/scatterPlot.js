// === charts/scatterPlot.js ===
export function renderScatterPlot(data, labels, width, height, margin) {
    const svgScatter = d3.select("#scatter-plot");
  
    const scatterX = d3.scaleLinear().domain(d3.extent(data, d => d[' Flow Duration'])).range([margin.left, width - margin.right]);
    const scatterY = d3.scaleLinear().domain(d3.extent(data, d => d[' Total Fwd Packets'])).range([height - margin.bottom, margin.top]);
  
    const updateScatter = label => {
      const filtered = label === 'ALL' ? data : data.filter(d => d[' Label'] === label);
      svgScatter.selectAll("circle").remove();
  
      svgScatter.selectAll("circle")
        .data(filtered)
        .join("circle")
        .attr("cx", d => scatterX(d[' Flow Duration']))
        .attr("cy", d => scatterY(d[' Total Fwd Packets']))
        .attr("r", 3)
        .attr("fill", "tomato")
        .attr("opacity", 0.6);
    };
  
    svgScatter.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(scatterX));
  
    svgScatter.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(scatterY));
  
    const labelSelect = d3.select("#labelFilter");
    labelSelect.append("option").text("ALL").attr("value", "ALL");
    labels.forEach(label => labelSelect.append("option").text(label).attr("value", label));
  
    labelSelect.on("change", function () {
      updateScatter(this.value);
    });
  
    updateScatter("ALL");
  }