d3v3 = d3
window.d3 = null

var save_checked_col;

function getClickedColors() {
    var checked = [];

    // if (document.getElementById('none').checked == false) {
    //     var checkboxes = d3v3.selectAll('input')
    //
    //     // iterate over all checkboxes to see if it's checked
    //     for (let i = 0; i < checkboxes[0].length; i++) {
    //         // if checkbox is checked, add it to array
    //         if (checkboxes[0][i].checked) {
    //             checked.push(checkboxes[0][i].value)
    //         }
    //     }
    // }
    //

    if (localStorage.getItem('color') == null) {
        localStorage.setItem('color', 'flare')
    }

    checked.push(localStorage.getItem('color'))

    //console.log(checked)
    return checked;
}

function uncheckColors() {
    // remove all checks
    var checkboxes = d3v3.selectAll('input')

    // iterate over all checkboxes to see if it's checked
    for (let i = 0; i < checkboxes[0].length; i++) {
        // if checkbox is checked, uncheck it
        if (checkboxes[0][i].checked) {
            checkboxes[0][i].checked = false;
        }
    }
}

function updateColors() {
    var timespan = document.querySelector('#range-label').innerHTML;
    timespan = timespan.split(' - ');
    timespan[0] = Number(timespan[0]);
    timespan[1] = Number(timespan[1]);

    // get colours https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html
    var freq_obj = {},
        colour_obj = {},
        only_values = [],
        checked = getClickedColors();

    save_checked_col = checked[0];

    // reset frequencies
    for (let i = 0; i < data.length; i++) {
        freq_obj[data[i]['ctry_id']] = 0;
    }

    // if a color is selected, display that color
    if (checked[0] != 'flare') {
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

    // console.log(minValue)
    // console.log(maxValue)

    // create color palette function
    var paletteScale = d3v3.scale.linear()
        .domain([minValue, maxValue])
        .range(["#141414", save_checked_col]);

    if (save_checked_col == 'flare') {
        paletteScale = d3v3.scale.linear()
            .domain([minValue, maxValue])
            .range(["green", "red"]);
    }

    for (let i = 0; i < Object.keys(freq_obj).length; i++) {
        colour_obj[Object.keys(freq_obj)[i]] = paletteScale(freq_obj[Object.keys(freq_obj)[i]])
    }

    map.updateChoropleth(colour_obj);
    makeLegend();
    goLine();

    uncheckColors();
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
    width: 850,
    height: 650,
    fills: {
        defaultFill: '#000000',
        //blue: 'yellow', // toy fill colours
        //Spain: 'green'
    },

    geographyConfig: {
                highlightOnHover: false, // disable when wanting to change colour on click
                borderColor: '#595959', // same as background
                borderWidth: 0.5,
                popupOnHover: true, // so you see the country names
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

var selected = [];
// set onclick reaction for map
map.svg.selectAll('.datamaps-subunit').on('click', function(geography) {

    console.log('we have clicked:', save_checked_col);
    if (countries.includes(geography.id)) {
        if (selected.includes(geography.id)) {
            var ind = selected.indexOf(geography.id);
            selected.splice(ind, 1);
            var element = map.svg.selectAll(".datamaps-subunit."+geography.id);

            element[0][0]['style']['stroke'] = '#000040';
            element[0][0]['style']['stroke-width'] = '0.5';
        } else if (selected.length > 2) {
            alert('You can only select up to three countries, please deselect ' + selected.join(' or '))
        } else if (selected.includes(geography.id) == false) {
            selected.push(geography.id);
            var element = map.svg.selectAll(".datamaps-subunit."+geography.id);

            element[0][0]['style']['stroke'] = 'yellow';
            element[0][0]['style']['stroke-width'] = '2.5';
        }
    } else {
        alert("Sorry, no data exists for " + geography.id)
    }

    // updateColors()
    // makeSunburst()
    goLine();
    if (geography.properties.name == "Australia") {
        gotoAustralia();
        obje[geography.id] = 'purple';
        map.updateChoropleth(obje);
    } else {
        reset();
    }


})

function goLine() {
    if (save_checked_col == 'deeppink' && selected.length > 0) {
        document.getElementById("line_title").innerHTML = "You've selected " + selected.join(' and ') + ", now select a color.";

        makeLineGraph(selected, save_checked_col);
    } else if (selected.length > 0) {
        // update plot title

        var color_scale = d3v3.scale.linear()
                .domain([0, selected.length])
                .range(["white", save_checked_col]);

        var spans = [];
        var titl = "Paintings with the color " + save_checked_col + " for ";
        for (var i = 0; i < selected.length; i++) {
            var colu = color_scale(i);
            var span = "<span style='color: " + colu + ";'>" + selected[i] + "</span>";
            spans.push(span)
        }

        titl += spans.join(" and ");
        document.getElementById("line_title").innerHTML = titl;

        // document.getElementById("line_title").innerHTML = "Paintings with the color " + save_checked_col + " for " + selected.join(' and ');

        makeLineGraph(selected, save_checked_col);
    } else {
        document.getElementById("line_title").innerHTML = "Please select a color and a country!";

        deleteLineGraph();
    }

}

// update map colors once content is loaded
window.addEventListener('DOMContentLoaded', (event) => {
    localStorage.clear()
    updateColors();
});

var checked = []

// // set onclick reaction for checkboxes
// var checkboxes = d3v3.selectAll('input')
// checkboxes.on('click', function() {
//     checked = []
//     // iterate over all checkboxes to see if it's checked
//     for (let i = 0; i < checkboxes[0].length; i++) {
//         // if checkbox is checked, add it to array
//         if (checkboxes[0][i].checked) {
//             checked.push(checkboxes[0][i].value)
//         }
//     }
//     updateColors();
// })
