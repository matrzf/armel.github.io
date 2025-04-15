// === charts/sankeyDiagram.js ===
export function renderSankeyDiagram(data) {
    const sankeySvg = d3.select("#sankey");
    const sankeyWidth = +sankeySvg.attr("width");
    const sankeyHeight = +sankeySvg.attr("height");
  
    // Correction dynamique du label si présent
    const lastCol = Object.keys(data[0]).at(-1);
    if (!data[0]['Label'] && data[0][lastCol]) {
      data.forEach(d => {
        d.Label = d[lastCol];
      });
    }
  
    const totalFwdPacketsKey = Object.keys(data[0]).find(k => k.toLowerCase().includes("total fwd packets"));
    const destinationPortKey = Object.keys(data[0]).find(k => k.toLowerCase().includes("destination port"));
  
    if (!totalFwdPacketsKey || !destinationPortKey) {
      console.error("Champs requis non trouvés :", totalFwdPacketsKey, destinationPortKey);
      return;
    }
  
    const filteredData = data.filter(d =>
      d.Label && d[destinationPortKey] && !isNaN(+d[totalFwdPacketsKey])
    );
  
    const aggregated = d3.rollups(
      filteredData,
      v => d3.sum(v, d => +d[totalFwdPacketsKey]),
      d => d.Label,
      d => d[destinationPortKey]
    );
  
    const links = [];
    aggregated.forEach(([label, targets]) => {
      targets.forEach(([port, value]) => {
        links.push({ source: label, target: String(port), value });
      });
    });
  
    const validLinks = links.filter(d => typeof d.value === 'number' && !isNaN(d.value) && d.value > 0);
    console.log("Sankey - liens valides :", validLinks.length);
    console.log("Sankey - échantillon :", validLinks.slice(0, 5));
  
    const nodeNames = Array.from(new Set(validLinks.flatMap(d => [d.source, d.target])));
    const nodes = nodeNames.map(name => ({ name }));
    const nodeIndex = new Map(nodeNames.map((name, i) => [name, i]));
  
    const sankeyData = {
      nodes,
      links: validLinks.map(d => ({
        source: nodeIndex.get(d.source),
        target: nodeIndex.get(d.target),
        value: d.value
      }))
    };
  
    const sankey = d3.sankey()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[1, 1], [sankeyWidth - 1, sankeyHeight - 6]]);
  
    const { nodes: sankeyNodes, links: sankeyLinks } = sankey(sankeyData);
  
    sankeySvg.append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", "#888")
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("fill", "none")
      .attr("class", "link");
  
    const node = sankeySvg.append("g")
      .selectAll("g")
      .data(sankeyNodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
    node.append("rect")
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", "#69b3a2")
      .attr("stroke", "black");
  
    node.append("text")
      .attr("x", -6)
      .attr("y", d => (d.y1 - d.y0) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => d.name)
      .filter(d => d.x0 < sankeyWidth / 2)
      .attr("x", 6 + 20)
      .attr("text-anchor", "start");
  }