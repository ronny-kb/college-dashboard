const width = 1000;
const height = 500;

const plotWidth = 400;
const plotHeight = 400;

const dataAttributes = [
    'Admission Rate',
    'ACT Median',
    'SAT Average',
    'Undergrad Population',
    '% White',
    '% Black',
    '% Hispanic',
    '% Asian',
    '% American Indian',
    '% Pacific Islander',
    '% Biracial',
    'Average Cost',
    'Expenditure Per Student',
    'Completion Rate 150% time',
    'Retention Rate (First Time Students)',
    'Median Debt on Graduation',
    'Median Earnings 8 years After Entry'
];

const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// dimensions
const padding = { t: 10, r: 30, b: 20, l: 90}

const scatterplotOne = svg.append('g')
    .attr('transform', `translate(${padding.l}, ${padding.t})`)
const scatterplotTwo = svg.append('g')
    .attr('transform', `translate(${plotWidth + 120 + padding.l}, ${padding.t})`);


var xSelectionOne = d3.select("#selectX1").property("value");
var ySelectionOne = d3.select("#selectY1").property("value");
var xSelectionTwo = d3.select("#selectX2").property("value");
var ySelectionTwo = d3.select("#selectY2").property("value");

var xScaleOne = d3.scaleLinear([0, plotWidth]);
var yScaleOne = d3.scaleLinear([plotHeight, 0]);

var xScaleTwo = d3.scaleLinear([0, plotWidth]);
var yScaleTwo = d3.scaleLinear([plotHeight, 0]);

var xAxisOne = scatterplotOne.append('g')
    .attr('transform', `translate(0, ${plotHeight})`)
    .attr('class', 'x-axis')

var yAxisOne = scatterplotOne.append('g')
    .attr('class', 'y-axis');

var xAxisTwo = scatterplotTwo.append('g')
    .attr('transform', `translate(0, ${plotHeight})`)
    .attr('class', 'x-axis')

var yAxisTwo = scatterplotTwo.append('g')
    .attr('class', 'y-axis');

scatterplotOne.append("text")
    .attr("x", plotWidth / 2)
    .attr("y", plotHeight + padding.b + 20)
    .attr("class", "x-axis-label-one")
    .attr("text-anchor", "middle")
    .text(xSelectionOne);

scatterplotOne.append("text")
    .attr("x", -plotHeight / 2)
    .attr("y", -padding.l + 30)
    .attr("class", "y-axis-label-one")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(ySelectionOne);

scatterplotTwo.append("text")
    .attr("x", plotWidth / 2)
    .attr("y", plotHeight + padding.b + 20)
    .attr("class", "x-axis-label-two")
    .attr("text-anchor", "middle")
    .text(ySelectionOne);

scatterplotTwo.append("text")
    .attr("x", -plotHeight / 2)
    .attr("y", -padding.l)
    .attr("class", "y-axis-label-two")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text(ySelectionTwo);

var brush = d3.brush()
    .extent([[0, 0], [plotWidth, plotHeight]])
    .on("start", brushstart)
    .on("brush", brushmove)
    .on("end", brushend);

var brushChart;

var tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((event, data) => {
        return `<h4>${data.Name}</h4>
        <p>Control: ${data.Control}</p>
        <p>Locale: ${data.Locale}</p>`
    });

svg.call(tooltip);

var colleges;

var param = new URLSearchParams(window.location.search);
var region = param.get('region');
document.getElementById("region").innerText = `Region: ${region}`;

d3.csv("colleges.csv").then(function(dataset) {
    colleges = dataset.filter(d => d.Region === region);

    scatterplotOne.append("g")
        .attr("class", "brush")
        .call(brush);

    scatterplotTwo.append("g")
        .attr("class", "brush")
        .call(brush);

    updateScatterplotOne(colleges, xSelectionOne, ySelectionOne);
    updateScatterplotTwo(colleges, xSelectionTwo, ySelectionTwo);

    // update when user inputs selector
    d3.select("#selectX1").on("input", () => {
        xSelectionOne = d3.select("#selectX1").property("value");
        updateScatterplotOne(colleges, xSelectionOne, ySelectionOne);
    })

    d3.select("#selectY1").on("input", () => {
        ySelectionOne = d3.select("#selectY1").property("value");
        updateScatterplotOne(colleges, xSelectionOne, ySelectionOne);
    })

    d3.select("#selectX2").on("input", () => {
        xSelectionTwo = d3.select("#selectX2").property("value");
        updateScatterplotTwo(colleges, xSelectionTwo, ySelectionTwo);
    })

    d3.select("#selectY2").on("input", () => {
        ySelectionTwo = d3.select("#selectY2").property("value");
        updateScatterplotTwo(colleges, xSelectionTwo, ySelectionTwo);
    })
});

function updateScatterplotOne(colleges, xAttribute, yAttribute) {
    xScaleOne.domain([d3.min(colleges, d => +d[xAttribute]), d3.max(colleges, d => +d[xAttribute])]);
    yScaleOne.domain([d3.min(colleges, d => +d[yAttribute]), d3.max(colleges, d => +d[yAttribute])]);

    var circles = scatterplotOne.selectAll('circle')
        .data(colleges);
    
    circles.exit().remove();

    circles.attr("cx", d => xScaleOne(d[xAttribute]));
    circles.attr("cy", d => yScaleOne(d[yAttribute]));

    circles.enter()
        .append('circle')
        .attr("cx", d => xScaleOne(d[xAttribute]))
        .attr("cy", d => yScaleOne(d[yAttribute]))
        .attr("r", 5)
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
        .style("fill-opacity", 0.4)
        .style("fill", d => getColor(d));
    
    xAxisOne.call(d3.axisBottom(xScaleOne));
    yAxisOne.call(d3.axisLeft(yScaleOne));

    scatterplotOne.select(".x-axis-label-one")
        .text(xAttribute);
    scatterplotOne.select(".y-axis-label-one")
        .text(yAttribute);
}

function updateScatterplotTwo(colleges, xAttribute, yAttribute) {
    xScaleTwo.domain([d3.min(colleges, d => +d[xAttribute]), d3.max(colleges, d => +d[xAttribute])]);
    yScaleTwo.domain([d3.min(colleges, d => +d[yAttribute]), d3.max(colleges, d => +d[yAttribute])]);

    var circles = scatterplotTwo.selectAll('circle')
        .data(colleges);
    
    circles.exit().remove();

    circles.attr("cx", d => xScaleTwo(d[xAttribute]));
    circles.attr("cy", d => yScaleTwo(d[yAttribute]));

    circles.enter()
        .append('circle')
        .attr("cx", d => xScaleTwo(d[xAttribute]))
        .attr("cy", d => yScaleTwo(d[yAttribute]))
        .attr("r", 5)
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
        .style("fill-opacity", 0.4)
        .style("fill", d => getColor(d));
    
    xAxisTwo.call(d3.axisBottom(xScaleTwo));
    yAxisTwo.call(d3.axisLeft(yScaleTwo));

    scatterplotTwo.select(".x-axis-label-two")
        .text(xAttribute);
    scatterplotTwo.select(".y-axis-label-two")
        .text(yAttribute);
}

function getColor(data) {
    return data.Control === "Private" ? "crimson" : "green"
}

function brushstart() {
    if (brushChart !== this) {
        brush.move(d3.select(brushChart), null);
        brushChart = this;
    }
}

function brushmove(event) {
    var e = event.selection;
    if (e) {
        var [[x0, y0], [x1, y1]] = e;
        var scale = brushChart === scatterplotOne.select('.brush').node() ? xScaleOne : xScaleTwo;
        var yScale = brushChart === scatterplotOne.select('.brush').node() ? yScaleOne : yScaleTwo;
        var xSelection = brushChart === scatterplotOne.select('.brush').node() ? xSelectionOne : xSelectionTwo;
        var ySelection = brushChart === scatterplotOne.select('.brush').node() ? ySelectionOne : ySelectionTwo;

        svg.selectAll('circle')
            .classed('selected', d => x0 <= scale(d[xSelection]) && scale(d[xSelection]) <= x1 && y0 <= yScale(d[ySelection]) && yScale(d[ySelection]) <= y1);
    }
}

function brushend(event) {
    if (!event.selection) {
        svg.selectAll('circle').classed('selected', false);
        brushChart = undefined;
    }
}