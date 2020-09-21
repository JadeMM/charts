import * as d3 from "d3";

export function getTooltipLocation(tooltipId, clientX = undefined, clientY = undefined) {
    const tooltipHeight = d3.select("#" + tooltipId).node().getBoundingClientRect().height;
    
    if (clientX && clientY) {
        d3.select("#" + tooltipId).style("left", (clientX + 20) + "px");
        d3.select("#" + tooltipId).style("top", (clientY - tooltipHeight / 2) + "px");
    } else {
        d3.select("#" + tooltipId).style("left", (d3.event.clientX + 20) + "px");
        d3.select("#" + tooltipId).style("top", (d3.event.clientY - tooltipHeight / 2) + "px");
    }
    // d3.select("#" + chartTooltipId).style("opacity", 1);
}