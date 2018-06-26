function drawMap(dataMap) {

  // determine min and max of performance values
  var onlyValues = dataMap.map(function(obj){ return obj[1]; });
  var minValue = Math.min.apply(null, onlyValues)
      maxValue = Math.max.apply(null, onlyValues);

  // create color palette function
  var paletteScale = d3.scale.linear()
        .domain([minValue, maxValue])
        .range(["#d0d1e6", "#034e7b"]);

  // fill dataset in appropriate format
  var dataset = {}
  dataMap.forEach(function(item){
      var iso = item[0],
              value = item[1];
      dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
  });

  // create European map
  map = new Datamap({element: document.getElementById("map"),

    // zoom in on Europe
    setProjection: function(element) {
      var projection = d3.geo.equirectangular()
        .center([11, 53])
        .rotate([1, 0])
        .scale(380)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
      var path = d3.geo.path()
        .projection(projection);

      return {path: path, projection: projection};
    },

    fills: { defaultFill: "#f0f0f0" },

    data: dataset,

    // set hover specifications
    geographyConfig: {

      // don"t change color on mouse hover
      highlightFillColor: function(geo) {
          return geo["fillColor"] || "#F5F5F5";
      },
      highlightOnHover: false,
      popupOnHover: true
    },
  });

  // set color scale for legend of map
  var colors = d3.scale.quantize()
  .range(["#d0d1e6","#a6bddb","#74a9cf","#3690c0","#0570b0","#045a8d"]);

  // add legend of map
  var legend = d3.select("#legend")
    .append("ul")
    .attr("class", "list-inline");

  // add data for legend of map
  var keys = legend.selectAll("li.key")
      .data(colors.range());

  // add colors and text to legend of map
  var legendText = ["0: Environment unfriendly", "0.5", "1", "1.5", "2", "2.5: Environment friendly"]
  keys.enter().append("li")
      .attr("class", "key")
      .style("border-top-color", String)
      .text(function(d, i) {
          return legendText[i];
      });
};

function update_border_color(selectedCountry, selectedCountryOld, countries) {
  if ($.inArray(selectedCountry, countries) != -1) {
    if (selectedCountryOld != 0) {
      var countryOld = document.getElementsByClassName("datamaps-subunit " + selectedCountryOld)[0];
      countryOld.style.stroke = "#ffffff";
    }
    var country = document.getElementsByClassName("datamaps-subunit " + selectedCountry)[0];
    country.style.stroke = "#000000";
  }
  else {
    selectedCountry = selectedCountryOld;
  }
  return selectedCountry;
};
