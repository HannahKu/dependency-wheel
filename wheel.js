/*** Define parameters and tools ***/
var width = 1000,
  height = 1000,
  outerRadius = Math.min(width, height) / 2 - 250,
  innerRadius = outerRadius - 15;

//relation matrix
//EDIT
var dataset = [
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1], //1 Institut für Elektrische Energietechnik FHNW
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1], //2 Hochschule für Technik FHNW
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3 Weitere Hochschulpartner FHNW
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], //4 Pfiffner
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1], //5 Moser Glaser
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], //6 Alpha-ET
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], //7 Haefely
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0], //8 Haveco
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9 Brugg Cables
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0], //10 Gut eingespielte Zusammenarbeit
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], //11 Gewinnung von Fachkräften
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12 Innovationsförderung
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], //13 Veranstaltungen
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1], //14 Forschungsprojekte
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //15 Praxisintegriertes Studium
  [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //16 Studierendenprojekte
  [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1], //17 Elektrische Energiespeicherung
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], //18 Nachhaltige Energieversorgung
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], //19 Elektrische Netze der Zukunft
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] //20 Weiterentwicklung Expertise
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //21 Stärkung der Standote
];

//create the arc path data generator for the groups
var arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

//create the chord path data generator for the chords
var path = d3.svg.chord().radius(innerRadius - 4); // subtracted 4 to separate the ribbon

//define the default chord layout parameters
//within a function that returns a new layout object;
//that way, you can create multiple chord layouts
//that are the same except for the data.
function getDefaultLayout() {
  return d3.layout
    .chord()
    .padding(0.1) // EDIT space bewtween groups
    .sortSubgroups(d3.descending)
    .sortChords(d3.ascending);
}
var last_layout; //store layout between updates
var categories; //store neighbourhood data outside data-reading function

/*** Initialize the visualization ***/
var g = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("id", "circle")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
//the entire graphic will be drawn within this <g> element,
//so all coordinates will be relative to the center of the circle

g.append("circle").attr("r", outerRadius);
//this circle is set in CSS to be transparent but to respond to mouse events
//It will ensure that the <g> responds to all mouse events within
//the area, even after chords are faded out.

//read data
d3.csv("categories.csv", function (error, categoryData) {
  if (error) {
    alert("Error reading file: ", error.statusText);
    return;
  }
  categories = categoryData;
  updateChords();
});

/* Create OR update a chord layout from a data matrix */
function updateChords() {
  /* Compute chord layout. */
  layout = getDefaultLayout(); //create a new layout object
  layout.matrix(dataset);

  /* Create/update "group" elements */
  var groupG = g.selectAll("g.group").data(layout.groups(), function (d) {
    return d.index;
    //use a key function in case the
    //groups are sorted differently
  });

  groupG.exit().transition().duration(1500).attr("opacity", 0).remove(); //remove after transitions are complete

  var newGroups = groupG.enter().append("g").attr("class", "group");

  //create the arc paths and set the constant attributes
  //(those based on the group index, not on the value)
  newGroups
    .append("path")
    .attr("id", function (d) {
      return "group" + d.index;
      //using d.index and not i to maintain consistency
      //even if groups are sorted
    })
    .style("fill", function (d) {
      return categories[d.index].color;
    });

  //update the paths to match the layout
  groupG.select("path").transition().duration(1500).attrTween("d", arcTween(last_layout));

  //create the group labels
  newGroups
    .append("svg:text")
    .attr("xlink:href", function (d) {
      return "#group" + d.index;
    })
    .attr("dy", ".35em")
    .attr("color", "#fff")
    .text(function (d) {
      return categories[d.index].name;
    });

  //position group labels to match layout
  groupG
    .select("text")
    .transition()
    .duration(1500)
    .attr("transform", function (d) {
      d.angle = (d.startAngle + d.endAngle) / 2;
      //store the midpoint angle in the data object

      return "rotate(" + ((d.angle * 180) / Math.PI - 90) + ")" + " translate(" + (innerRadius + 26) + ")" + (d.angle > Math.PI ? " rotate(180)" : " rotate(0)");
      //include the rotate zero so that transforms can be interpolated
    })
    .attr("text-anchor", function (d) {
      return d.angle > Math.PI ? "end" : "begin";
    });

  /* Create/update the chord paths */
  var chordPaths = g.selectAll("path.chord").data(layout.chords(), chordKey);
  //specify a key function to match chords
  //between updates

  //create the new chord paths
  var newChords = chordPaths.enter().append("path").attr("class", "chord");

  //handle exiting paths:
  chordPaths.exit().transition().duration(1500).attr("opacity", 0).remove();

  //update the path shape
  chordPaths
    .transition()
    .duration(1500)
    .style("fill", function (d) {
      return categories[d.source.index].color;
    })
    .attrTween("d", chordTween(last_layout));

  //add the mouseover/fade out behaviour to the groups
  //this is reset on every update, so it will use the latest
  //chordPaths selection
  groupG.on("mouseover", function (d) {
    chordPaths.classed("fade", function (p) {
      //returns true if *neither* the source or target of the chord
      //matches the group that has been moused-over
      return p.source.index != d.index && p.target.index != d.index;
    });
  });
  last_layout = layout; //save for next update
}

function arcTween(oldLayout) {
  //this function will be called once per update cycle

  //Create a key:value version of the old layout's groups array
  //so we can easily find the matching group
  //even if the group index values don't match the array index
  //(because of sorting)
  var oldGroups = {};
  if (oldLayout) {
    oldLayout.groups().forEach(function (groupData) {
      oldGroups[groupData.index] = groupData;
    });
  }

  return function (d, i) {
    var tween;
    var old = oldGroups[d.index];
    if (old) {
      //there's a matching old group
      tween = d3.interpolate(old, d);
    } else {
      //create a zero-width arc object
      var emptyArc = { startAngle: d.startAngle, endAngle: d.startAngle };
      tween = d3.interpolate(emptyArc, d);
    }

    return function (t) {
      return arc(tween(t));
    };
  };
}

function chordKey(data) {
  return data.source.index < data.target.index ? data.source.index + "-" + data.target.index : data.target.index + "-" + data.source.index;

  //create a key that will represent the relationship
  //between these two groups *regardless*
  //of which group is called 'source' and which 'target'
}
function chordTween(oldLayout) {
  //this function will be called once per update cycle

  //Create a key:value version of the old layout's chords array
  //so we can easily find the matching chord
  //(which may not have a matching index)

  var oldChords = {};

  if (oldLayout) {
    oldLayout.chords().forEach(function (chordData) {
      oldChords[chordKey(chordData)] = chordData;
    });
  }

  return function (d, i) {
    //this function will be called for each active chord

    var tween;
    var old = oldChords[chordKey(d)];
    if (old) {
      //old is not undefined, i.e.
      //there is a matching old chord value

      //check whether source and target have been switched:
      if (d.source.index != old.source.index) {
        //swap source and target to match the new data
        old = {
          source: old.target,
          target: old.source
        };
      }

      tween = d3.interpolate(old, d);
    } else {
      //create a zero-width chord object
      ///////////////////////////////////////////////////////////in the copy ////////////////
      if (oldLayout) {
        var oldGroups = oldLayout.groups().filter(function (group) {
          return group.index == d.source.index || group.index == d.target.index;
        });
        old = { source: oldGroups[0], target: oldGroups[1] || oldGroups[0] };
        //the OR in target is in case source and target are equal
        //in the data, in which case only one group will pass the
        //filter function

        if (d.source.index != old.source.index) {
          //swap source and target to match the new data
          old = {
            source: old.target,
            target: old.source
          };
        }
      } else old = d;
      /////////////////////////////////////////////////////////////////
      var emptyChord = {
        source: { startAngle: old.source.startAngle, endAngle: old.source.startAngle },
        target: { startAngle: old.target.startAngle, endAngle: old.target.startAngle }
      };
      tween = d3.interpolate(emptyChord, d);
    }

    return function (t) {
      //this function calculates the intermediary shapes
      return path(tween(t));
    };
  };
}
