// set up bubble-chart dimensions
var width = 700;
var height = 700;

var colorMap = {
  "Great Plains": "brown",
  "Far West": "gray",
  "New England": "hotPink",
  "Great Lakes": "crimson",
  "Southeast": "mediumPurple",
  "Southwest": "steelBlue",
  "Rocky Mountains": "orange",
  "Mid-Atlantic": "limeGreen",
  "Outlying Areas": "olive"
}

// Create an SVG element
var svg = d3.select("#bubble-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// define tool tip (activity 3)
var tooltip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html((event, d) => {
        const regionName = d[0].Region;
        const numSchools = d.length;
        //return name and schools
        return `<h4>${regionName}: ${numSchools} Schools</h4>`
    })
svg.call(tooltip);

var data;
var dataArray;

// load data and make bubbles
d3.csv('colleges.csv').then(function(dataset) {
  data = d3.group(dataset, d => d.Region);
  dataArray = [...data.values()];

  var node = svg.append("g")
      .selectAll("circle")
      .data(dataArray)
      .enter()
      .append("circle")
      .attr("r", d => Math.sqrt(d.length) * 8)
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => colorMap[d[0].Region])
      .style("fill-opacity", 0.8)
      .on('mouseover', tooltip.show)
      .on('mouseout', tooltip.hide)
      // click for scatter plot
      .on('click', event => {
          const circle = d3.select(event.target);
          const datacCircle = circle.datum();
          const region = datacCircle[0].Region;
          // update to new url, then load
          const newUrl = updateURLParameter(window.location.href, 'region', encodeURIComponent(region));
          window.history.pushState({}, '', newUrl);
          window.location.reload();
      })
  
  var label = svg.append("g")
      .selectAll("text")
      .data(dataArray)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .style("fill", "#fff")
      .text(d => d[0].Region);

  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2))
      .force("charge", d3.forceManyBody().strength(0.5))
      .force("collide", d3.forceCollide(d => Math.sqrt(d.length) * 8.5).strength(0.05).iterations(1));

  simulation
      .nodes(dataArray)
      .on("tick", function (d) {
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
          label
              .attr("x", function(d){ return d.x; })
              .attr("y", function(d){ return d.y; })
      });

});

// update url
function updateURLParameter(url, param, paramVal) {
  var newAdditionalURL = "";
  var tempArray = url.split("?");
  var baseURL = tempArray[0];
  var additionalURL = tempArray[1];
  var temp = "";
  if (additionalURL) {
      tempArray = additionalURL.split("&");
      for (var i=0; i<tempArray.length; i++){
          if(tempArray[i].split('=')[0] != param){
              newAdditionalURL += temp + tempArray[i];
              temp = "&";
          }
      }
  }

  var rows_txt = temp + "" + param + "=" + paramVal;
  return baseURL + "scatterplot.html?" + newAdditionalURL + rows_txt;
}