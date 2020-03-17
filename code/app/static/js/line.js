d3v3 = d3;
window.d3 = null;

// var dataa = [ { label: "France",
//                x: [1900, 1901, 1902, 1903, 1904],
//                y: [0, 1, 2, 3, 4] },
//              { label: "Spain",
//                x: [1900, 1901, 1902, 1903, 1904],
//                y: [0, 1, 4, 9, 16] },
//              { label: "Italy",
//                x: [1900, 1901, 1902, 1903, 1904],
//                y: [40, 30, 32, 20, 8] },
//            ];

var timespan = document.querySelector('#value-range').innerHTML;
timespan = timespan.split('-');
timespan[0] = Number(timespan[0]);
timespan[1] = Number(timespan[1]);

var timescale = d3v3.scale.linear()
    .domain([timespan[0], timespan[1]])
    .range([timespan[0], timespan[1]]);

obj_of_times = {}
for (var i = timespan[0]; i < timespan[1]; i++) {
    obj_of_times[i] = 0
}

country_obj = {}
for (var i = 0; i < countries.length; i++) {
    country_obj[countries[i]] = [obj_of_times];
}

for (var i = 0; i < data.length; i++) {
    if (data[i]['creation_year'] > timespan[0] && data[i]['creation_year'] < timespan[1]) {
        country_obj[data[i]['ctry_id']][0][data[i]['creation_year']]++;
    }
}

dataa = []
var years = Object.keys(obj_of_times);
for (var i = 0; i < countries.length; i++) {
    var values = Object.keys(country_obj[countries[i]][0]).map(function(key){
        return country_obj['ITA'][0][key];
    });
    dataa.push({label: countries[i], x: years, y: values});

}

var xy_chart = d3_xy_chart()
    .width(960)
    .height(500);

var svg = d3v3.select("body").append("svg")
    .datum(dataa)
    .call(xy_chart) ;

function d3_xy_chart() {
    var width = 740,
        height = 750;

    function chart(selection) {
        selection.each(function(datasets) {

            // Create the plot.
            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var x_scale = d3v3.scale.linear()
                .range([0, innerwidth])
                .domain([ d3v3.min(datasets, function(d) { return d3v3.min(d.x); }),
                          d3v3.max(datasets, function(d) { return d3v3.max(d.x); }) ]) ;

            var y_scale = d3v3.scale.linear()
                .range([innerheight, 0])
                .domain([ d3v3.min(datasets, function(d) { return d3v3.min(d.y); }),
                          d3v3.max(datasets, function(d) { return d3v3.max(d.y); }) ]) ;

            var color_scale = d3v3.scale.category10()
                .domain(d3v3.range(datasets.length)) ;

            var x_axis = d3v3.svg.axis()
                .scale(x_scale)
                .orient("bottom")
                .tickFormat(d3v3.format("d"));

            var y_axis = d3v3.svg.axis()
                .scale(y_scale)
                .orient("left");

            var x_grid = d3v3.svg.axis()
                .scale(x_scale)
                .orient("bottom")
                .tickSize(-innerheight)
                .tickFormat("");

            var y_grid = d3v3.svg.axis()
                .scale(y_scale)
                .orient("left")
                .tickSize(-innerwidth)
                .tickFormat("") ;

            var draw_line = d3v3.svg.line()
                .interpolate("basis")
                .x(function(d) { return x_scale(d[0]); })
                .y(function(d) { return y_scale(d[1]); }) ;

            var svg = d3v3.select(this)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

            svg.append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + innerheight + ")")
                .call(x_grid);

            svg.append("g")
                .attr("class", "y grid")
                .call(y_grid);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")")
                .call(x_axis)
                .append("text")
                .attr("dy", "-.71em")
                .attr("x", innerwidth)
                .style("text-anchor", "end")

            svg.append("g")
                .attr("class", "y axis")
                .call(y_axis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end");

            // axis label
            svg.append("text")
                .attr("class", "x label")
                .attr("text-anchor", "end")
                .attr("x", 500)
                .attr("y", 480)
                .attr("fill", "white" )
                .text("Years");

            // y axis label
            svg.append("text")
                .attr("class", "y label")
                .attr("text-anchor", "end")
                .attr("x", -150)
                .attr("y", -45)
                .attr("dy", ".75em")
                .attr("transform", "rotate(-90)")
                .attr("fill", "white" )
                .text("Amount of paintings");



            var data_lines = svg.selectAll(".d3_xy_chart_line")
                .data(datasets.map(function(d) {return d3v3.zip(d.x, d.y);}))
                .enter().append("g")
                .attr("class", "d3_xy_chart_line") ;

            // draw lines
            data_lines.append("path")
                .attr("class", "line")
                .attr("d", function(d) {return draw_line(d); })
                .attr("stroke", "white");
                // .attr("stroke", function(_, i) {return color_scale(i);});

            data_lines.append("text")
                .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                .attr("transform", function(d) {
                    return ( "translate(" + x_scale(d.final[0]) + "," +
                             y_scale(d.final[1]) + ")" ) ; })
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", "white" )
                // .attr("fill", function(_, i) { return color_scale(i); })
                .text(function(d) { return d.name; }) ;

        }) ;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

// <!--    chart.xlabel = function(value) {-->
// <!--        if(!arguments.length) return xlabel ;-->
// <!--        xlabel = value ;-->
// <!--        return chart ;-->
// <!--    } ;-->
//
// <!--    chart.ylabel = function(value) {-->
// <!--        if(!arguments.length) return ylabel ;-->
// <!--        ylabel = value ;-->
// <!--        return chart ;-->
// <!--    } ;-->

    return chart;
}
