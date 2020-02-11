function get_info_on_var(variable) {
    var rel_meta = meta_data.find(function(d) {
        return d.Variabele == variable;
    })

    var label = rel_meta['Label_1'];
    var definition = rel_meta['Definition'];

    return [label, definition]
}

function get_correct_data(area, data, pie, pat) {
    for (var i = 0; i < data.length; i++) {
        if (data[i]['area_name'] == area) {
            return data[i]
        }
    }
}
data = get_correct_data(document.getElementById('area_name').value, data)



document.getElementById('area_name').onchange = function () {
    data = get_correct_data(document.getElementById('area_name').value, data)

    d3.selectAll('path').transition().delay(function(d, i) {
    return i * 100; }).duration(100).style('opacity', 0)
    .transition().delay(function(d, i) {
    return i * 250; }).duration(450)
    .style('opacity', 1)
    .attrTween('d', function(d) {
        var i = d3.interpolate(d.startAngle, d.endAngle);
        return function(t) {
            d.endAngle = i(t);
            return arc(d)
            }
        })
}
console.log(data)

var width = 0;
var height = 0;
var MOUSEOVER = false;

var svgContainer = d3.select("#piechart").append("svg")
						.attr("height", height)
						.attr("width", width);

// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select("#piechart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// set the color scale
var color = d3.scale.category20();

var map = d3.map(data)

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
  .sort(null)

var data_ready = pie(map.entries())
var arc = d3.arc()
  .innerRadius(radius - 125)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
var path = svg.selectAll('path')
  .data(data_ready)
  .enter()
  .append('path')
  .on("mouseover", function(d, i) {
      var x_var = d.data.key;
      var value = d.data.value;
      var info = get_info_on_var(x_var);
      var label = info[0]
      var definition = info[1];

      displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
          value + "%<br /><b>Explanation: </b>" + definition)
  })
  .on("mousemove", function(d, i) {
      var x_var = d.key;
      var value = d.value;
      var info = get_info_on_var(x_var);
      var label = info[0]
      var definition = info[1];

      displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
          value + "%<br /><b>Explanation: </b>" + definition)
  })
  .on("mouseout", function(d) {
      hideTooltip();
  })
  // .attr('d', d => arc(d))
  .transition().delay(function(d, i) {
  return i * 250; }).duration(450)
  .attrTween('d', function(d) {
      var i = d3.interpolate(d.startAngle, d.endAngle);
      return function(t) {
          d.endAngle = i(t);
          return arc(d)
          }
      })
  .attr('fill', function(d, i){ return(color(i)); })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 1);
