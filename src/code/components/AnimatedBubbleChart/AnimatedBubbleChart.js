import React, { Component } from 'react';
import './AnimatedBubbleChart.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { data } from '../../data/bubbleData';
import play from '../../assets/temp_play.png';
import pause from '../../assets/temp_pause.png';
import * as d3 from "d3";
import { getTooltipLocation } from '../../helper functions/tooltip';

const padding = {
    left: 30,
    right: 20,
    top: 50,
    bottom: 20
}

let timer;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelineValue: 0,
            animationOn: false,
            tooltipVisible: false,
            tooltipContent: {
                xvalue: 0,
                yvalue: 0,
                intensity: 0
            }
        }
        this.redrawChart = this.redrawChart.bind(this);
        this.handleSlider = this.handleSlider.bind(this);
        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
        this.handleTimelineControl = this.handleTimelineControl.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
        this.hideTooltip = this.hideTooltip.bind(this);
        
    }
    componentDidMount() {
        this.redrawChart(0);
        window.addEventListener('resize', () => this.redrawChart(this.state.timelineValue));
        window.addEventListener('transitionend', () => this.redrawChart(this.state.timelineValue));
    }
    componentDidUpdate() {
        if(this.state.timelineValue === Object.keys(data).length-1 && this.state.animationOn) {
            this.stop();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.redrawChart);
        window.removeEventListener('transitionend', this.redrawChart);
    }

    redrawChart(timelineValue) {
        d3.select("#canvas").remove();
        this.renderChart(timelineValue);
    }

    render() {
        const dateArray = Object.keys(data);
        const date = new Date(dateArray[this.state.timelineValue]);
        const displayDate = `${(Number(date.getMonth()) + 1)}/${(Number(date.getDate()))}/${date.getFullYear()}`;
        return <div className="canvas-container">
            <div id="canvas-div"/>
            {this.renderTooltip()}
            <div className="slide-container">
                <img className="play-btn" src={this.state.animationOn ? pause : play} alt="Play Button" onClick={this.handleTimelineControl}/>
                <input className="slider" type="range" min="0" max={dateArray.length-1} value={this.state.timelineValue} onInput={this.handleSlider}/>
                <span className="date">{displayDate}</span>
            </div>
        </div>
    }

    renderTooltip() {
        const { tooltipVisible, tooltipContent} = this.state;
        if (!tooltipVisible) {
            return null;
        }

        return <div className="tooltip-content" id="animated-bubble-tooltip">
            <p>Intensity: {tooltipContent.intensity}</p>
            <p>X-Value: {tooltipContent.xvalue}</p>
            <p>Y-Value: {tooltipContent.yvalue}</p>
        </div>
    }

    renderChart(timelineValue) {
        const dateArray = Object.keys(data);

        const svgWidth = d3.select("#canvas-div").node().getBoundingClientRect().width;
        const svgHeight = d3.select("#canvas-div").node().getBoundingClientRect().height;
        
        const currentData = data[dateArray[timelineValue]];
        let svg = d3.select("#canvas-div")
            .append("svg")
            .attr("id", "canvas")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("background-color", "white");

        //x and y axis
        const xScale = this.getXScale(svgWidth);
        const yScale = this.getYScale(svgHeight);
        const color = this.getColorScale();

        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        svg.append("g")
            .attr("class", "axis line-chart-x-axis")
            .attr("transform", "translate( " + 0 + "," + (svgHeight - (padding.top + padding.bottom)) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis line-chart-y-axis")
            .attr("transform", "translate(" + padding.left + ", 0)")
            .call(yAxis);

        //point
        svg.selectAll(".circle")
            .data(currentData)
            .enter()
            .append("circle")
            .attr("class", "bubble")
            .attr("r", 3)
            .attr("cx", this.getCircleXPosition(xScale))
            .attr("cy", this.getCircleYPosition(yScale))
            .attr("r", this.getCircleRadius())
            .attr("fill", this.getCircleColor(color))
            .attr("opacity", 0)
            .on("mousemove", this.showTooltip())
            .on("mouseout", this.hideTooltip())
            .transition()
            .duration(500)
            .attr("opacity", 0.8);
    }

    showTooltip() {
        return (d) => {
            this.setState({
                tooltipVisible: true,
                tooltipContent: d
            });
            getTooltipLocation("animated-bubble-tooltip");
        }
    }

    hideTooltip() {
        return (d) => {
            this.setState({tooltipVisible: false})
        }
    }

    getXScale(svgWidth) {
        const xArray = [];
        Object.keys(data).map(date => {
            data[date].map(item => {
                xArray.push(item.xvalue);
            })
        });
        return d3.scaleLinear()
            .domain([0, d3.max(xArray)*1.5])
            .range([padding.left, svgWidth - (padding.left + padding.right)]);
    }

    getYScale(svgHeight) {
        const yArray = [];
        Object.keys(data).map(date => {
            data[date].map(item => {
                yArray.push(item.yvalue);
            })
        });
        return d3.scaleLinear()
            .domain([0, d3.max(yArray)*1.5])
            .range([svgHeight - (padding.bottom + padding.top), padding.top]);
    }

    getColorScale() {
        const valueArray = [];
        Object.keys(data).map(date => {
            data[date].map(item => {
                valueArray.push(item.intensity);
            })
        });
        return d3.scaleLinear()
            .domain([0, d3.max(valueArray)])
            .range(["pink", "red"]);
    }

    getCircleXPosition(xScale) {
        return (d) => {
            return xScale(d.xvalue);
        }
    }

    getCircleYPosition(yScale) {
        return (d) => {
            return yScale(d.yvalue);
        }
    }

    getCircleRadius() {
        return (d) => {
            return d.intensity * 5;
        }
    }

    getCircleColor(color) {
        return (d) => {
            return color(d.intensity);
        }
    }

    handleSlider(e) {
        this.setState({timelineValue: e.target.value});
        this.redrawChart(e.target.value);
    }

    handleTimelineControl() {
        this.state.animationOn ? this.stop() : this.play();
    }

    play() {
        this.setState({animationOn: true});

        let i = this.state.timelineValue;
        if(this.state.timelineValue === Object.keys(data).length-1) {
            i = 0;
            this.setState({timelineValue: 0});
            this.redrawChart(0);
        }
        
        timer = setInterval(() => { 
            i++;
            this.redrawChart(i);
            this.setState({timelineValue: i});
        }, 1000);
    }

    stop() {
        clearInterval(timer);
        this.setState({animationOn: false});
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
