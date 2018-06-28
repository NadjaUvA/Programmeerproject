/**
* This script creates an application with linked graphs that visualize the
* environmental progress of European countries.
*
* Nadja van 't Hoff (11030720)
*/

// initiate global variables
var widthRadar = 180, heightRadar = 180;
var selectedCountry = 0, selectedCountryOld = 0, selectedVariable = 0;
var stackedGraphStarted = false; startDropdown = false;
var map;

// set global width, height and margins of stacked graph
var widthStackedGraph = 525, heightStackedGraph = 275;
var margin = {top: 70, right: 125, bottom: 50, left: 40},
      innerWidthStackedGraph = widthStackedGraph - margin.left - margin.right,
      innerHeightStackedGraph = heightStackedGraph - margin.top - margin.bottom;

// define global functions to scale width and height for the stacked graph
var y = d3.scale.linear()
  .range([innerHeightStackedGraph, 0]);
var x = d3.time.scale()
  .range([0, innerWidthStackedGraph]);
var color = d3.scale.ordinal();

// create axes of the stacked graph
var xAxisStackedGraph = d3.svg.axis()
  .scale(x)
  .orient("bottom");
var	yAxisStackedGraph = d3.svg.axis()
  .scale(y)
  .orient("left");

window.onload = function() {

  // wait loading the figures until the data is loaded
  queue()
    .defer(d3.json, "../data/dataCircles.json")
    .defer(d3.json, "../data/dataRadar.json")
    .defer(d3.json, "../data/dataMap.json")
    .defer(d3.json, "../data/dataWaste.json")
    .defer(d3.json, "../data/dataEnergy.json")
    .defer(d3.json, "../data/dataEmission.json")
    .await(make_figures);

  function make_figures(error, dataCircles, dataRadar, dataMap, dataWaste, dataEnergy, dataEmission) {

		// return error if problem arrises
		if (error) {
			return alert(error);
		}

    // make list of country codes
    var dataKeys = Object.keys(dataCircles);
    var countries = dataKeys.slice(1, dataKeys.length);

    // store maximum values from data
    var maxRecycled = dataCircles["max"][0],
      maxRenewable = dataCircles["max"][1],
      maxCO2 = dataCircles["max"][2];

    // adjust data of every environmental variable variable
    dataVariables = [dataWaste, dataEnergy, dataEmission];
    var parseDate = d3.time.format("%Y").parse;
    for (var l = 0, p = dataVariables.length; l < p; l++) {
      dataVariable = dataVariables[l];

      // adjust data for every country
      for (var k = 0, o = countries.length; k < o; k++) {
        data = dataVariable[countries[k]];
        if (typeof(data) != "undefined") {
          for (var j = 0, m = data.length; j < m; j++) {
            for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {

              // convert strings to numbers and to javascript dates
              data[j]["values"][i]["year"] = parseDate(data[j]["values"][i]["year"])
              data[j]["values"][i]["y"] = +data[j]["values"][i]["y"];
              data[j]["values"][i]["y0"] = +data[j]["values"][i]["y0"];
            };
          };
        };
      };
    };

    // draw map and legend of map
    drawMap(dataMap);

    // draw circle menu
    drawCircles(maxRecycled, maxRenewable, maxCO2);

    // fill circles and radar chart with average of europe
    gauge1.update(dataCircles["EU"][0]);
    gauge2.update(dataCircles["EU"][1]);
    gauge3.update(dataCircles["EU"][2]);

    // add interactivity to first circle
    d3.selectAll("#fillgauge1").on("click", function(d, i) {
      selectedVariable = "waste";
      if (selectedCountry != 0) {
        stackedGraphStarted = updateStackedGraph(selectedCountry, selectedVariable,
          dataWaste, dataEnergy, dataEmission);
      };
    });

    // add interactivity to second circle
    d3.selectAll("#fillgauge2").on("click", function(d, i) {
      selectedVariable = "energy";
      if (selectedCountry != 0) {
        stackedGraphStarted = updateStackedGraph(selectedCountry, selectedVariable,
          dataWaste, dataEnergy, dataEmission);
      };
    });

    // add interactivity to third circle
    d3.selectAll("#fillgauge3").on("click", function(d, i) {
      selectedVariable = "emission";
      if (selectedCountry != 0) {
        stackedGraphStarted = updateStackedGraph(selectedCountry, selectedVariable,
          dataWaste, dataEnergy, dataEmission);
      };
    });

    // reset to average european values when button is clicked
    $(".resetBtn").click(function(){

      // update circles and radar chart with average of europe
      gauge1.update(dataCircles["EU"][0]);
      gauge2.update(dataCircles["EU"][1]);
      gauge3.update(dataCircles["EU"][2]);

      // update radar chart and map
      startRadar("EU", dataRadar, countries);
      updateBorderColor("EU", selectedCountry, countries);

      // reset stacked graph and global variables
      $("#stackedGraph").empty();
      stackedGraphStarted = false;
      selectedCountry = 0;

      // uncheck boxes of radarChart
      for (i = 0; i < countries.length - 1; i++) {
        document.getElementById("checkbox" + countries[i]).checked = false;
      };
    });

    // update the radar chart and map when input field is changed
		$("input").change(function() {
      selectedCountriesOld = selectedCountries;
      var selectedCountries = [];
			for (var i = 0, n = countries.length - 1; i < n; i++) {
				var countryChecked = document.getElementById("checkbox" + countries[i]).checked;
				if (countryChecked) {
					selectedCountries.push(countries[i]);
				};
			};

      // execute update of the radar chart with new countries
      updateRadar(selectedCountries, selectedCountriesOld, dataRadar);

      // update country border if page is opened for the first time
      if (selectedCountryOld == 0 && selectedCountries.length == 1)  {
        updateBorderColor(selectedCountries[0], selectedCountryOld, countries);
      };
    });

    // update circle menu and radar chart when country is clicked
    map.svg.selectAll(".datamaps-subunit").on("click", function() {

      // keep track of selected countries
      selectedCountryOld = selectedCountry;
      selectedCountry = d3.select(this)[0][0].classList[1];
      selectedCountry = updateBorderColor(selectedCountry, selectedCountryOld, countries);

      // update circle menu and start radar chart
      gauge1.update(dataCircles[selectedCountry][0]);
      gauge2.update(dataCircles[selectedCountry][1]);
      gauge3.update(dataCircles[selectedCountry][2]);
      startRadar(selectedCountry, dataRadar, countries);

      // update stacked graph if a circle has been clicked on as well
      if (selectedVariable != 0) {
        stackedGraphStarted = updateStackedGraph(selectedCountry, selectedVariable,
          dataWaste, dataEnergy, dataEmission);
      };
    });
  };
};
