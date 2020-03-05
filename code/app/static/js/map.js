d3v3 = d3
window.d3 = null

function updateColors() {
    var timespan = document.querySelector('#value-range').innerHTML;
    timespan = timespan.split('-');
    timespan[0] = Number(timespan[0]);
    timespan[1] = Number(timespan[1]);

    // get colours https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
    var freq_obj = {},
        colour_obj = {},
        only_values = [];

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
        
    console.log(minValue)
    console.log(maxValue)
    // create color palette function
    var paletteScale = d3v3.scale.linear()
        .domain([minValue, maxValue])
        .range(["#ffecec", "#780000"]);

    for (let i = 0; i < Object.keys(freq_obj).length; i++) {
        colour_obj[Object.keys(freq_obj)[i]] = paletteScale(freq_obj[Object.keys(freq_obj)[i]])
    }

    map.updateChoropleth(colour_obj);

}


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
    element: document.getElementById('map-container'),
    projection: 'mercator',
    width: 750,
    height: 550,
    fills: {
        defaultFill: '#ffffff',
        blue: 'yellow', // toy fill colours
        Spain: 'green'
    },
    geographyConfig: {
                popupOnHover: true, // so you see the country names
                highlightOnHover: false, // disable when wanting to change colour on click
                borderColor: '#000040', // same as background
                borderWidth: 0.5
    }
});

// zoom functions, only australia works
function gotoAustralia(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-400,-100)");
}
// function gotoAfrica(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
// }
// function gotoNorthAmerica(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
// }
// function gotoSouthAmerica(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-50,-300)");
// }
// function gotoAsia(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
// }
// function gotoEurope(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
// }
// function gotoFrance(){
//     map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "scale(1.5)translate(-300,-100)");
// }
function reset(){
    map.svg.selectAll(".datamaps-subunits").transition().duration(750).attr("transform", "");
}


// set onclick reaction for map
map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
    var obje = {};
    obje[geography.id] = 'green';
    map.updateChoropleth(obje);

    if (geography.properties.name == "Australia") {
        gotoAustralia();
        obje[geography.id] = 'purple';
        map.updateChoropleth(obje);
    } else {
        reset();
    }
})

// update map colors once content is loaded
window.addEventListener('DOMContentLoaded', (event) => {
    updateColors();
});

var checked = []

// set onclick reaction for checkboxes
var checkboxes = d3v3.selectAll('input')
checkboxes.on('click', function() {
    checked = []
    // iterate over all checkboxes to see if it's checked
    for (let i = 0; i < checkboxes[0].length; i++) {
        // if checkbox is checked, add it to array
        if (checkboxes[0][i].checked) {
            checked.push(checkboxes[0][i].value)
        }
    }
    updateColors();
})
