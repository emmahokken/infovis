d3v3 = d3;
window.d3 = null;

function deleteLineGraph() {
    d3v3.select(".lineline").remove();
}

function get_data(selected, checked) {

    var timespan = document.querySelector('#range-label').innerHTML;
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
            && data[i]['color_name'] == checked) {

            country = data[i]['ctry_id'] // prints: ITA or FRA
            year = data[i]['creation_year'] // prints: a year...
            country_obj[country][0][year] += 1; // so basically increment the value for key 'year' for either ITA or FR
        }
    }

    var data_processed = []


    var years = Object.keys(obj_of_times);
    for (var i = 0; i < selected.length; i++) {
        var values = Object.keys(country_obj[selected[i]][0]).map(function(key){
            return country_obj[selected[i]][0][key];
        });
        data_processed.push({label: selected[i], x: years, y: values});

    }
    return(data_processed)
}


function makeLineGraph(selected, checked) {
    deleteLineGraph();

    var data_processed = get_data(selected, checked)

    var xy_chart = d3_xy_chart()
        .width(800)
        .height(400);

    var svg = d3v3.select(".line_container").append("svg")
        .datum(data_processed)
        .call(xy_chart)
        .attr('class', 'lineline');

    function d3_xy_chart() {
        var width = 1000,
            height = 1000,
            xlabel = "Year",
            ylabel = "Number of artworks" ;

        function chart(selection) {
            selection.each(function(datasets) {

                var margin = {top: 40, right: 40, bottom: 45, left: 50},
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

                var color_scale = d3v3.scale.linear()
                        .domain([0, selected.length])
                        .range(["white", checked]);

                var x_axis = d3v3.svg.axis()
                    .scale(x_scale)
                    .orient("bottom")
                    .tickFormat(d3v3.format('d'));

                var y_axis = d3v3.svg.axis()
                    .scale(y_scale)
                    .orient("left") ;

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
                    .style("font-size", "14px")
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                svg.append("g")
                    .attr("class", "x grid")
                    .style("font-size", "14px")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x_grid) ;

                svg.append("g")
                    .attr("class", "y grid")
                    .style("font-size", "14px")
                    .call(y_grid) ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x_axis)
                    .append("text")
                    .attr("y", margin.top)
                    .attr("x", innerwidth/2)
                    .style("text-anchor", "middle")
                    .style("font-size", "14px")
                    .text(xlabel);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(y_axis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -margin.left)
                    .attr("x", -(innerheight / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("font-size", "14px")
                    .text(ylabel) ;


                svg.append("text")
                    .attr("x", innerwidth/2)
                    .attr("y", -(margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "14px")
                    .style('fill', 'white');
                    // .text(document.getElementById("line_title").innerHTML = titl);

                    // BELOW IS NOT WORKING, DON'T KNOW WHY...???
                    // .text("Paintings with the color " + checked[0] + " for ")
                    // .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                    // .attr("fill", function(_, i) { return color_scale(i); })
                    // .text(function(d) { return d.name; }) ;

                var data_lines = svg.selectAll(".d3_xy_chart_line")
                    .data(datasets.map(function(d) {return d3v3.zip(d.x, d.y);}))
                    .enter().append("g")
                    .attr("class", "d3_xy_chart_line") ;

                data_lines.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {return draw_line(d); })

                    .attr("stroke", function(_, i) {return color_scale(i);})
                    .attr("stroke-width", 0.1);  // Does not work...?

                // data_lines.append("text")
                //     .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                //     .attr("transform", function(d) {
                //         return ( "translate(" + x_scale(d.final[0]) + "," +
                //                  y_scale(d.final[1]) + ")" ) ; })
                //     .attr("x", 3)
                //     .attr("dy", ".35em")
                //     .attr("fill", function(_, i) { return color_scale(i); })
                //     .text(function(d) { return d.name; }) ;

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
