var data = {
    'france': 'france has good bread',
    'ethiopia': 'ijera or enjera is great'
};

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
}

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


// map.bubbles([
//     {name: data['france'], latitude: 61.32, longitude: 17.32, radius: 45, fillKey: 'france'},
//     {name: data['ethiopia'], latitude: 12.32, longitude: 27.32, radius: 25, fillKey: 'blue'},
// ])

// zoom functions
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
    obje[geography.id] = '#800000'
    map.updateChoropleth(obje);
    if (geography.properties.name == "Australia") {
        gotoAustralia();
    }

    get_pop_up(geography)
    // alert(geography.properties.name);
});

function get_pop_up(geography) {
    console.log('hello');
}
