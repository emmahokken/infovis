d3v5 = d3
window.d3 = null

// Slider
var dataTime = d3v5.range(0, 13).map(function(d) {
    return new Date(1400 + d*50, 2, 13);
});

var sliderRange = d3v5
    .sliderBottom()
    .min(d3v5.min(dataTime))
    .max(new Date(2020, 2, 13))
    .width(400)
    .tickFormat(d3v5.timeFormat('%Y'))
    .tickValues(dataTime)
    .default([d3v5.min(dataTime), new Date(2020, 2, 13)])
    .fill('#2196f3')
    .handle(
    d3v5
        .symbol()
        .type(d3v5.symbolCircle)
        .size(200)()
    )
    .on('onchange', val => {
        d3v5.select('p#value-range').text(val.map(d3v5.timeFormat('%Y')).join('-'));

        document.getElementById('none').checked = true;
        
        // update map colors
        updateColors();

        // update sunburst
        makeSunburst();
});

var gRange = d3v5
    .select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3v5.select('p#value-range').text(
    sliderRange
        .value()
        .map(d3v5.timeFormat('%Y'))
        .join('-')
    );
