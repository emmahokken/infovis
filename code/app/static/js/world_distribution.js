// set the dimensions and margins of the graph

var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 530 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

    height = 240;
// append the svg object to the body of the page
var svg = d3.select("#world_dist")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

plot_lines = function(data) {

    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ])



    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
                // .ticks(10)
                .tickFormat(d3.format('d'))) //EMMA, dit is het aantal ticks op de x-as. Voor het geval je hem langer of korter maakt.

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)
            .ticks(4)
        )

    svg.append("path")
      .attr("class", "test")
      .datum(data)
      .attr("fill", "white") // EMMA, dit is de kleur van de area. Die moet dan dus zelfde zijn als de selected kleur in de sunburst
      .attr("stroke", "white")
      .attr("stroke-width", 1)

      .attr("d", d3.area()
        .x(function(d) { return x(d.date) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
        )

      var tick = d3.selectAll('.tick').attr("fill", "white")
      console.log('tick', tick)

// title onder the x axis
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 250)
    .attr("y", 270)
    .style("font-size", "11px")
    .style("fill", "white")
    .text("Year");

// title left of the y axis
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -105)
    .attr("y", -36)
    .attr("transform", "rotate(-90)")
    .style("font-size", "11px")
    .style("fill", "white")
    .text("Amount");

// main title for the graph
     svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", 350)
    .attr("y", 0)
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("fill", "white")
    .text("Distribution of all paitings over the world");

}

var timespan = '1400 - 2020';
timespan = timespan.split(' - ');
timespan[0] = Number(timespan[0]);
timespan[1] = Number(timespan[1]);

var timescale = d3v3.scale.linear()
    .domain([timespan[0], timespan[1]])
    .range([timespan[0], timespan[1]]);

var obj_of_times = {}
for (var i = timespan[0]; i < timespan[1]; i++) {
    obj_of_times[i] = 0
}

// loop over whole colections
for (var i = 0; i < data.length; i++) {
    if (data[i]['creation_year'] > timespan[0] && data[i]['creation_year'] < timespan[1]) {
        year = data[i]['creation_year'] // prints: a year...
        obj_of_times[year]++; // so basically increment the value for key 'year' for either ITA or FR
    }
}

var da = [];

var years = Object.keys(obj_of_times);
for (var i = 0; i < years.length; i++) {
    da.push({date: years[i], value: obj_of_times[years[i]]})
}

plot_lines(da)
