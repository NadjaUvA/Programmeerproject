/**
* an application with linked graphs that visualize the environmental progress of European countries
*
* Nadja van 't Hoff (11030720)
*/


$.echo file_get_contents("..data/data2015.json");

// add map
window.onload = function() {

  // wait loading the figures until the data is loaded
  queue()
    .defer(d3.json, "data2015.json")
    .await(make_figures);

  // create European map
  var map = new Datamap({element: document.getElementById("container"),

    // zoom in on Europe
    setProjection: function(element) {
      var projection = d3.geo.equirectangular()
        .center([12, 52])
        .rotate([1, 0])
        .scale(490)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      var path = d3.geo.path()
        .projection(projection);

      return {path: path, projection: projection};
    },

    // color countries belonging to European Union
    fills: {
      defaultFill: "#ece7f2",
      european_union: "#a6bddb",
      update_colors: "#2b8cbe"
    },

    data: {
      "BEL": {fillKey: "european_union"},
      "BGR": {fillKey: "european_union"},
      "CYP": {fillKey: "european_union"},
      "DNK": {fillKey: "european_union"},
      "DEU": {fillKey: "european_union"},
      "EST": {fillKey: "european_union"},
      "FIN": {fillKey: "european_union"},
      "GRC": {fillKey: "european_union"},
      "HUN": {fillKey: "european_union"},
      "IRL": {fillKey: "european_union"},
      "ITA": {fillKey: "european_union"},
      "HRV": {fillKey: "european_union"},
      "LVA": {fillKey: "european_union"},
      "LTU": {fillKey: "european_union"},
      "LUX": {fillKey: "european_union"},
      "NLD": {fillKey: "european_union"},
      "AUT": {fillKey: "european_union"},
      "POL": {fillKey: "european_union"},
      "PRT": {fillKey: "european_union"},
      "SVN": {fillKey: "european_union"},
      "SVK": {fillKey: "european_union"},
      "ESP": {fillKey: "european_union"},
      "CZE": {fillKey: "european_union"},
      "GBR": {fillKey: "european_union"},
      "SWE": {fillKey: "european_union"},
      "FRA": {fillKey: "european_union"},
      "NOR": {fillKey: "european_union"}
    }
  });

  function make_figures(error, data2015) {

		// return error if problem arrises
		if (error) {
			return alert(error);
		}


  };
};
