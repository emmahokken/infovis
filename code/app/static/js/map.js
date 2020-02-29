var iconclass = {
    0: 'Abstract, Non-representational Art',
    1: 'Religion and Magic',
    2: 'Nature',
    3: 'Human being, Man in general',
    4: 'Society, Civilization, Culture',
    5: 'Abstract Ideas and Concepts',
    6: 'History',
    7: 'Bible',
    8: 'Literature',
    9: 'Classical Mythology and Ancient History'
};

// create map
var map = new Datamap({
    element: document.getElementById('container'),
    projection: 'mercator',
    width: 750,
    height: 550,
    fills: {
        defaultFill: 'green',
        blue: '#4bcdef', // toy fill colours
        france: '#f35fd2'
    },
    geographyConfig: {
                popupOnHover: true, // so you see the country names
                highlightOnHover: false, // disable when wanting to change colour on click
                borderColor: '#000040', // same as background
                borderWidth: 0.5
    }
});

// This doesn't work. We need the country codes instead of the country names for this bitr.
// https://gist.github.com/rendon/fc9d5b02a724979e878e
for (let i = 0; i < data.length; i++) {
    var obje = {};
    obje[data[i]['country']] = '#a00400';
    map.updateChoropleth(obje);
}

// zoom functions, only australia works
function gotoAustralia(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-400,-100)");
}
function gotoAfrica(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
}
function gotoNorthAmerica(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
}
function gotoSouthAmerica(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-50,-300)");
}
function gotoAsia(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
}
function gotoEurope(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
}
function reset(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "");
}

// set onclick reaction
map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
    var obje = {};
    obje[geography.id] = '#800000';
    map.updateChoropleth(obje);
    if (geography.properties.name == "Australia") {
        gotoAustralia();
    }
})

// Slider
var dataTime = d3.range(0, 13).map(function(d) {
    return new Date(1400 + d*50, 2, 13);
});

var sliderRange = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(new Date(2020, 2, 13))
    .width(400)
    .tickFormat(d3.timeFormat('%Y'))
    .tickValues(dataTime)
    .default([new Date(1550, 2, 13), new Date(1830, 2, 13)])
    .fill('#2196f3')
    .handle(
    d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('onchange', val => {
    d3.select('p#value-range').text(val.map(d3.timeFormat('%Y')).join('-'));
});

var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
    sliderRange
        .value()
        .map(d3.timeFormat('%Y'))
        .join('-')
    );
