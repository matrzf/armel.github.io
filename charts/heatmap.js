// === charts/heatmap.js ===
export function renderHeatmap(data, heatVars) {
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
    const cleanData = data.filter(d =>
      heatVars.every(v => d[v] !== undefined && !isNaN(+d[v]) && isFinite(+d[v]))
    );
  
    const matrix = getCorrelationMatrix(cleanData, heatVars);
    const heatSvg = d3.select("#heatmap"),
          size = +heatSvg.attr("width"),
          cellSize = size / heatVars.length;
  
    const heatGroup = heatSvg.append("g");
  
    const colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["blue", "white", "red"]);
  
    heatGroup.selectAll("rect")
      .data(d3.cross(heatVars, heatVars))
      .join("rect")
      .attr("x", d => heatVars.indexOf(d[0]) * cellSize)
      .attr("y", d => heatVars.indexOf(d[1]) * cellSize)
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", d => colorScale(matrix[heatVars.indexOf(d[1])][heatVars.indexOf(d[0])]))
      .on("mouseover", (event, d) => {
        const value = matrix[heatVars.indexOf(d[1])][heatVars.indexOf(d[0])];
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`<b>${d[1]}</b> vs <b>${d[0]}</b><br>Corrélation : <b>${value}</b>`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(300).style("opacity", 0);
      });
  
    heatGroup.selectAll("text")
      .data(d3.cross(heatVars, heatVars))
      .join("text")
      .attr("x", d => heatVars.indexOf(d[0]) * cellSize + cellSize / 2)
      .attr("y", d => heatVars.indexOf(d[1]) * cellSize + cellSize / 2 + 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text(d => matrix[heatVars.indexOf(d[1])][heatVars.indexOf(d[0])]);
  
    // Labels axes
    heatGroup.selectAll(".row-label")
      .data(heatVars)
      .join("text")
      .attr("x", 0)
      .attr("y", (d, i) => i * cellSize + cellSize / 2 + 5)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .text(d => d)
      .attr("transform", `translate(-5,0)`);
  
    heatGroup.selectAll(".col-label")
      .data(heatVars)
      .join("text")
      .attr("x", (d, i) => i * cellSize + cellSize / 2)
      .attr("y", -5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(d => d);
  
    // Légende
    const legendWidth = 300, legendHeight = 10;
    const legendSvg = d3.select("#heatmap-legend")
      .append("svg")
      .attr("width", legendWidth)
      .attr("height", 40);
  
    const legendScale = d3.scaleLinear().domain([-1, 1]).range([0, legendWidth]);
    const legendAxis = d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format(".2"));
  
    legendSvg.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .selectAll("stop")
      .data(d3.range(0, 1.01, 0.01))
      .enter().append("stop")
      .attr("offset", d => d)
      .attr("stop-color", d => d3.interpolateRdBu(1 - d));
  
    legendSvg.append("rect")
      .attr("x", 0)
      .attr("y", 10)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");
  
    legendSvg.append("g")
      .attr("transform", "translate(0, 20)")
      .call(legendAxis);
  }
  
  function getCorrelationMatrix(data, variables) {
    const matrix = [];
    for (let i = 0; i < variables.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < variables.length; j++) {
        const xi = data.map(d => +d[variables[i]]);
        const xj = data.map(d => +d[variables[j]]);
        const meanI = d3.mean(xi);
        const meanJ = d3.mean(xj);
        const num = d3.sum(xi.map((x, k) => (x - meanI) * (xj[k] - meanJ)));
        const den = Math.sqrt(
          d3.sum(xi.map(x => (x - meanI) ** 2)) *
          d3.sum(xj.map(x => (x - meanJ) ** 2))
        );
        matrix[i][j] = +(num / den).toFixed(2);
      }
    }
    return matrix;
  }