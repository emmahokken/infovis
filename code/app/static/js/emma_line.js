d3v3 = d3;
window.d3 = null;

function deleteLineGraph() {
    d3v3.select(".lineline").remove();
}

var purple = ["#f2f0f7","#cbc9e2","#9e9ac8","#6a51a3"];
var blue = ["#eff3ff","#bdd7e7","#6baed6","#2171b5"];
var green = ["#edf8e9","#bae4b3","#74c476","#238b45"];
var red = ["#fee5d9","#fcae91","#fb6a4a","#cb181d"];
var gray = ["#f7f7f7","#cccccc","#969696","#525252"];
var brown = ['#892201', '#d5b07c', '#c69874', '#bc6a3c'];
var white = ['#fffff2', '#f9f9f9', '#fffff4', '#fbf7f5'];
var yellow = ['#ffdf57', '#fff48c', '#feffaa', '#ffffc5'];

function get_data(selected, checked) {
    var timespan = document.querySelector('#range-label').innerHTML;
    timespan = timespan.split(' - ');
    timespan[0] = Number(timespan[0]);
    timespan[1] = Number(timespan[1]);

    var timescale = d3v3.scale.linear()
        .domain([timespan[0], timespan[1]])
        .range([timespan[0], timespan[1]]);

    var obj_of_times = {};

    for (var i = timespan[0]; i < timespan[1]; i++) {
        obj_of_times[i] = 0;
    }

    var country_obj = {};
    for (var i = 0; i < selected.length; i++) {
        country_obj[selected[i]] = [Object.assign({}, obj_of_times)];
    }

    // loop over whole colections
    for (var i = 0; i < data.length; i++) {
        // if the year of the painting is in the domain for the slider, and if
        // the country of the painting is one of the selected countries (ITA or FRA)
        // then do +1 for that country/year in the object country_obj
        if (data[i]['creation_year'] > timespan[0] && data[i]['creation_year'] < timespan[1]
            && selected.includes(data[i]['ctry_id'])
            && data[i]['color_name'] == checked[0]) {
                console.log(country_obj[data[i]['ctry_id']]);
                country_obj[data[i]['ctry_id']][0][data[i]['creation_year']]++;
        }
    }

    var dataa = []
    var years = Object.keys(obj_of_times);
    for (var i = 0; i < selected.length; i++) {
        var values = Object.keys(country_obj[selected[i]][0]).map(function(key){
            return country_obj[selected[i]][0][key];
        });
        dataa.push({label: selected[i], x: years, y: values});
    }
    return(dataa)
}



function makeLineGraph(selected, checked) {

    deleteLineGraph();


    var dataa = get_data(selected, checked)


    var xy_chart = d3_xy_chart()
        .width(960)
        .height(400);

    var svg = d3v3.select(".line_container").append("svg")
        .datum(dataa)
        .call(xy_chart)
        .attr('class', 'lineline');

    function d3_xy_chart() {
        var width = 640,
            height = 480,
            xlabel = "Years",
            ylabel = "Amount of paintings" ;

        function chart(selection) {
            selection.each(function(datasets) {

                var margin = {top: 40, right: 80, bottom: 40, left: 40},
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
                    .orient("bottom") ;

                var y_axis = d3v3.svg.axis()
                    .scale(y_scale)
                    .orient("left") ;

                var x_grid = d3v3.svg.axis()
                    .scale(x_scale)
                    .orient("bottom")
                    .tickSize(-innerheight)
                    .tickFormat("") ;

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
                    .call(x_grid) ;

                svg.append("g")
                    .attr("class", "y grid")
                    .call(y_grid) ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x_axis)
                    .append("text")
                    .attr("y", margin.top)
                    .attr("x", innerwidth/2)
                    .style("text-anchor", "middle")
                    .text(xlabel) ;

                svg.append("g")
                    .attr("class", "y axis")
                    .call(y_axis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left)
                    .attr("x", -(height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text(ylabel) ;

                var data_lines = svg.selectAll(".d3_xy_chart_line")
                    .data(datasets.map(function(d) {return d3v3.zip(d.x, d.y);}))
                    .enter().append("g")
                    .attr("class", "d3_xy_chart_line") ;

                data_lines.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {return draw_line(d); })
                    .attr("stroke", "white")
                    .attr("stroke", function(_, i) {return color_scale(i);});

                data_lines.append("text")
                    .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                    .attr("transform", function(d) {
                        return ( "translate(" + x_scale(d.final[0]) + "," +
                                 y_scale(d.final[1]) + ")" ) ; })
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    // .attr("fill", "white" )
                    .attr("fill", function(_, i) { return color_scale(i); })
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

        chart.xlabel = function(value) {
            if(!arguments.length) return xlabel ;
            xlabel = value ;
            return chart ;
        } ;

        chart.ylabel = function(value) {
            if(!arguments.length) return ylabel ;
            ylabel = value ;
            return chart ;
        } ;

        return chart;
    }
}
