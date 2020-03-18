d3v5 = d3
window.d3 = null

var w = 300, h = 50;

var key = d3v5
  .select("#legend")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .attr('transform', 'rotate(-90)');

var legend = key.append("defs")
  .append("svg:linearGradient")
  .attr("id", "gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "100%")
  .attr("y2", "100%")
  .attr("spreadMethod", "pad");

function makeLegend() {


    var timespan = document.querySelector('#value-range').innerHTML;
    timespan = timespan.split('-');
    timespan[0] = Number(timespan[0]);
    timespan[1] = Number(timespan[1]);

    // get colours https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
    var freq_obj = {},
        only_values = [],
        checked = getClickedColors();

    // reset frequencies
    for (let i = 0; i < data.length; i++) {
        freq_obj[data[i]['ctry_id']] = 0;
    }

    // if a color is selected, display that color
    if (checked.length > 0) {
        // count frequency
        for (let i = 0; i < data.length; i++) {
            if (data[i]['creation_year'] > timespan[0] && data[i]['creation_year'] < timespan[1]
                    && checked.includes(data[i]['color_name'])) {
                freq_obj[data[i]['ctry_id']]++;
            }
        }
    } else {
        // count frequency
        for (let i = 0; i < data.length; i++) {
            if (data[i]['creation_year'] > timespan[0] && data[i]['creation_year'] < timespan[1]) {
                freq_obj[data[i]['ctry_id']]++;
            }
        }
    }

    for (let i = 0; i < Object.keys(freq_obj).length; i++) {
        only_values.push(freq_obj[Object.keys(freq_obj)[i]])
    }

    var minValue = Math.min.apply(null, only_values),
        maxValue = Math.max.apply(null, only_values);


    var y = d3v5.scaleLinear()
        .range([300, 0])
        .domain([maxValue, minValue]);

    var yAxis = d3v5.axisBottom()
        .scale(y)
        .ticks(5);

    var paletteScale = d3v5.scaleLinear()
        .domain([minValue, maxValue])
        .range(["black", checked[0]]);


    legend.selectAll('stop').remove()
    key.select('rect').remove()
    key.select('g').remove()

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", paletteScale(minValue))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "33%")
      .attr("stop-color", paletteScale(maxValue*0.33))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "66%")
      .attr("stop-color", paletteScale(maxValue*0.66))
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", paletteScale(maxValue))
      .attr("stop-opacity", 1);

    key.append("rect")
      .attr("width", w)
      .attr("height", h - 30)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");

    key.append("g")
      .attr("class", "y axis y_axis")
      .attr("transform", "translate(0,30)")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(180)")
      .attr("y", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
}
