console.log(d3.version)
d3v5 = d3;
window.d3 = null;

console.log(d3v5.version)
var data_dict = {"name": 'flare',
                "children":
                    [
                        {"name": 'red', "children": []},
                        {"name": 'blue', "children": []},
                        {"name": 'green', "children": []},
                        {"name": 'yellow', "children": []},
                        {"name": 'pink', "children": []},
                        {"name": 'brown', "children": []},
                        {"name": 'gray', "children": []},
                        {"name": 'purple', "children": []},
                        {"name": 'orange', "children": []},
                        {"name": 'white', "children": []},
                    ]
                }

var det_name = {};
for (let i = 0; i < data.length; i++) {
    det_name[data[i]['detailed_color_name']] = data[i]['color_name'];
}

var freq_obj = {};
// reset frequencies
for (let i = 0; i < data.length; i++) {
    freq_obj[data[i]['detailed_color_name']] = 0;
}

for (let i = 0; i < data.length; i++) {
    freq_obj[data[i]['detailed_color_name']]++;
}

var color_keys = Object.keys(freq_obj)
for (let i = 0; i < color_keys.length; i++) {
    var val = freq_obj[color_keys[i]];
    var detail = color_keys[i];
    var name = det_name[detail];
    for (let j = 0; j < data_dict['children'].length; j++) {
        if (data_dict['children'][j]['name'] == name) {
            data_dict['children'][j]['children'].push({"name": detail, "value": val});
        }
    }
}

//
// for (let i = 0; i < Object.keys(freq_obj).length; i++) {
//     for (let j = 0; j < data_dict['children'].length; j++) {
//         if (data_dict['children'][j]['name'] == data[i]['color_name']) {
//             data_dict['children'][j]['children'].push({"name": data[i]['detailed_color_name'], "value": freq_obj[data[i]['detailed_color_name']]})
//         }
//     }
// }
console.log(freq_obj)
console.log(data_dict)
var data = data_dict;
// var data = {"name": 'flare',
//             "children":
//                 [
//                     {"name": 'red', "children": [{"name": 'firebrick', "value": 10},{"name": 'lightcoral', "value": 15},{"name": 'indianred', "value": 5}]},
//                     {"name": 'blue', "children": [{"name": 'AQUAMARINE', "value": 2},{"name": 'skyblue', "value": 30},{"name": 'navy', "value": 20}]},
//                     {"name": 'green', "children": [{"name": 'Lime', "value": 2},{"name": 'SeaGreen', "value": 30},{"name": 'forestgreen', "value": 20}]},
//                     {"name": 'yellow', "children": [{"name": 'LEMONCHIFFON', "value": 10},{"name": 'KHAKI', "value": 10},{"name": 'GOLD', "value": 10}]}
//                 ]
//             }

partition = data => {
  const root = d3v5.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  return d3v5.partition()
      .size([2 * Math.PI, root.height + 1])
    (root);
}

color = d3v5.scaleOrdinal(d3v5.quantize(d3v5.interpolateRainbow, data.children.length + 1))
format = d3v5.format(",d")
width = 932
radius = width / 6

arc = d3v5.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
    // .attr("transform", "translate(500, 400)")
    // .attr("cx", "10")


const root = partition(data);

root.each(d => d.current = d);

const svg = d3v5.select(".sunburst")
    .attr("viewBox", [0, 0, width, width])
    .style("font", "10px sans-serif");

const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);


const path = g.append("g")
  .selectAll("path")
  .data(root.descendants().slice(1))
  .join("path")
    .attr("fill", d => { while (d.depth > 1) d = d.parent; return d.data.name; })
    .attr("fill", d => { while (d.depth > 2) d = d.parent; return d.data.name; })
    .attr("d", d => arc(d.current));

path.filter(d => d.children)
    .style("cursor", "pointer")
    .on("click", clicked)

path.append("title")
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

const label = g.append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
  .selectAll("text")
  .data(root.descendants().slice(1))
  .join("text")
    .attr("dy", "0.35em")
    //.attr("fill-opacity", d => +labelVisible(d.current))
    .attr("transform", d => labelTransform(d.current))
    .text(d => d.data.name);

const parent = g.append("circle")
    .style("cursor", "pointer")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

/*

    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    y0: Math.max(0, d.y0 - p.depth),
    y1: Math.max(0, d.y1 - p.depth)

*/



function clicked(p) {
  parent.datum(p.parent || root);

  console.log(p)
  root.each(d => d.target = {
    x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
    y0: Math.max(0, d.y0),
    y1: Math.max(0, d.y1)
  });

  const t = g.transition().duration(750);

  // Transition the data on all arcs, even the ones that aren’t visible,
  // so that if this transition is interrupted, entering arcs will start
  // the next transition from the desired position.
  path.transition(t)
    .tween("data", d => {
    if (d.depth == 2) { // only update outer ring
        const i = d3v5.interpolate(d.current, d.target);
        return t => d.current = i(t);
    }})

    .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
    })
        .attr("fill-opacity", d => 100)
        .attrTween("d", d => () => arc(d.current));

}

function arcVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}



function labelVisible(d) {
  return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d) {
  const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
  const y = (d.y0 + d.y1) / 2 * radius;
  return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}
//
//
