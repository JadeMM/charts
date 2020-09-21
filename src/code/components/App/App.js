import React, { Component } from 'react';
import './App.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { data } from './text';
import * as d3 from "d3";

const padding = {
    left: 20,
    right: 20,
    top: 50,
    bottom: 20
}

class App extends Component {
    componentDidMount() {
        this.redrawChart();
    }

    redrawChart() {
        const { svgId } = this.props;

        d3.select("#" + svgId).remove();
        this.renderChart();
    }

    render() {
        return <div id="canvas-div" className="canvas"/>
    }

    renderChart() {
        const svgWidth = d3.select(".canvas").node().getBoundingClientRect().width;
        const svgHeight = d3.select(".canvas").node().getBoundingClientRect().height;
        
        let svg = d3.select("#canvas-div")
            .append("svg")
            .attr("id", "canvas")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("background-color", "white");

        //x and y axis
        const xScale = this.getXScale(svgWidth);
        const yScale = this.getYScale(svgHeight);

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5)
            .tickFormat(this.getXTickFormat);

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .tickSize(0);

        svg.append("g")
            .attr("class", "axis line-chart-x-axis")
            .attr("transform", "translate( " + 0 + "," + (svgHeight - (padding.top + padding.bottom)) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis line-chart-y-axis")
            .attr("transform", "translate(" + padding.left + ", 0)")
            .call(yAxis);

        //line
        const lineGenerator = d3.line()
            .x((d) => xScale(new Date(d.date)))
            .y((d) => yScale(d.value));

        let path = svg.append("path")
            .datum(data)
            .attr("d", lineGenerator)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        const pathLength = path.node().getTotalLength();
        path.attr("stroke-dasharray", pathLength)
            .attr("stroke-dashoffset", pathLength)
            .transition()
            .duration(500)
            .attr("stroke-dashoffset", 0);

        //annotation
        svg.selectAll(".annotation")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "annotation")
            .attr("text-anchor", this.getLabelStartPoint(data))
            .attr("fill", "black")
            .attr("dx", this.getLabelXPosition(xScale, data))
            .attr("dy", this.getLabelYPosition(yScale, data))
            .text(this.getLabel)
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);


        //line pointing to label
        svg.selectAll(".label-y-line")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "label-y-line")
            .attr("fill", "none")
            .attr("stroke", (d) => d.message ? "black" : "none")
            .attr("x1", this.getCircleXPosition(xScale))
            .attr("y1", this.getCircleYPosition(yScale))
            .attr("x2", this.getCircleXPosition(xScale))
            .attr("y2", this.getLabelYPosition(yScale, data))
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);
            
        svg.selectAll(".label-x-line")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "label-x-line")
            .attr("fill", "none")
            .attr("stroke", (d) => d.message ? "black" : "none")
            .attr("x1", this.getCircleXPosition(xScale))
            .attr("y1", this.getLabelYPosition(yScale, data))
            .attr("x2", this.getLabelXPosition(xScale, data))
            .attr("y2", this.getLabelYPosition(yScale, data))
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1);

        //point
        svg.selectAll(".line-chart-point")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "line-chart-point")
            .attr("r", 3)
            .attr("cx", this.getCircleXPosition(xScale))
            .attr("cy", this.getCircleYPosition(yScale))
            .attr("fill", "red")
            .attr("opacity", 0)
            .transition()
            .duration(1000)
            .attr("opacity", 1.0);
    }

    getXScale(svgWidth) {
        const dateArray = data.map(item => new Date(item.date));
        return d3.scaleTime()
            .domain([d3.min(dateArray), d3.max(dateArray)])
            .range([padding.left, svgWidth - (padding.left + padding.right)]);
    }

    getYScale(svgHeight) {
        const valueArray = data.map(item => item.value);
        return d3.scaleLinear()
            .domain([0, d3.max(valueArray)])
            .range([svgHeight - (padding.bottom + padding.top), padding.top]);
    }

    getXTickFormat(d) {
        const date = new Date(d);
        return `${(Number(date.getMonth()) + 1)}/${(Number(date.getDate()))}/${date.getFullYear()}`;
    }

    getCircleXPosition(xScale) {
        return (d) => {
            return xScale(new Date(d.date));
        }
    }

    getCircleYPosition(yScale) {
        return (d) => {
            return yScale(d.value)
        }
    }

    getLabelStartPoint(data) {
        return (d) => {
            return d === data[data.length-1] ? "end": "start";
        }
    }

    getLabelXPosition(xScale, data) {
        return (d) => {
            const length = d === data[data.length-1] ? -10 : 10;
            return xScale(new Date(d.date)) + length;
        }
    }

    getLabelYPosition(yScale, data) {
        return (d) => {
            let currentValue;
            let nextIndex;
            data.map((item, index) => {
                if(item === d) {
                    currentValue = item.value;
                    nextIndex = index+1;
                }
            })

            const pad = (data[nextIndex] && currentValue < data[nextIndex].value) ? 30 : -30;
            return yScale(d.value) + pad;
        }
    }

    getLabel(d) {
        return d.message;
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
