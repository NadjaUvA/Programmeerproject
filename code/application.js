/**
* an application with linked graphs that visualize the environmental progress of European countries
*
* Nadja van 't Hoff (11030720)
*/

var widthRadar = 250, heightRadar = 250;

var selected_country = 0;
var selected_country_old = 0;
var selected_variable = 0;
var legendText = 0;
var legendColor = 0;
var axisText = 0;
var graph_started = false;
var startDropdown = false;

// set width, height and margins
var width = 525, height_graph = 275;
var margin = {top: 50, right: 125, bottom: 50, left: 40},
      inner_width = width - margin.left - margin.right,
      inner_height_graph = height_graph - margin.top - margin.bottom;

// define functions to scale width and height for the linegraph
var y = d3.scale.linear()
  .range([inner_height_graph, 0]);
var x = d3.time.scale()
  .range([0, inner_width]);

var color = d3.scale.ordinal();

// create axes of the linegraph
var x_axis = d3.svg.axis()
  .scale(x)
  .orient("bottom");
var	y_axis = d3.svg.axis()
  .scale(y)
  .orient("left");

// add map
window.onload = function() {

  // wait loading the figures until the data is loaded
  queue()
    .defer(d3.json, "../data/data2015.json")
    .defer(d3.json, "../data/data_radar.json")
    .defer(d3.json, "../data/data_map.json")
    .defer(d3.json, "../data/data_waste.json")
    .defer(d3.json, "../data/data_energy.json")
    .defer(d3.json, "../data/data_emission.json")
    .await(make_figures);


  function make_figures(error, data2015, data_radar, data_map, data_waste, data_energy, data_emission) {

		// return error if problem arrises
		if (error) {
			return alert(error);
		}

    // // make list of country codes
    var data_keys = Object.keys(data2015);
    countries = data_keys.slice(1, data_keys.length);

    // store maximum values from data
    var max_recycled = data2015["max"][0],
      max_renewable = data2015["max"][1],
      max_co2 = data2015["max"][2];

    // set attributes of the linegraph
    var stacked_graph = d3.select("#stacked_graph").append("svg")
      .attr("width", width)
      .attr("height", height_graph)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data_variables = [data_waste, data_energy, data_emission];
    // adjust data for every country (convert to numbers and javascript dates)
    var parseDate = d3.time.format("%Y").parse;
    for (var l = 0, p = data_variables.length; l < p; l++) {
      data_variable = data_variables[l];
      for (var k = 0, o = countries.length; k < o; k++) {
        data = data_variable[countries[k]];
        if (typeof(data) != 'undefined') {
          for (var j = 0, m = data.length; j < m; j++) {
            for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
              data[j]["values"][i]["year"] = parseDate(data[j]["values"][i]["year"])
              data[j]["values"][i]["y"] = +data[j]["values"][i]["y"];
              data[j]["values"][i]["y0"] = +data[j]["values"][i]["y0"];
            };
          };
        };
      };
    };


    function start_graph(country, data, variable, years, total_max, varNames, axisText, legendText, legendColor) {

      // define the domains of the data values
  		x.domain([years[0], years[(years.length - 1)]]);
  		y.domain([0, total_max * 1.1]);

      color.domain(varNames);

      // add the x axis of the line graph
      stacked_graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + inner_height_graph + ")")
        .call(x_axis);

      // add the y axis of the line graph
      stacked_graph.append("g")
        .attr("class", "y axis")
        .call(y_axis)
        .append("text")
        .attr("class", "y axis text")
        .attr("transform", "rotate(-90)")
        .attr("y", - 40)
        .attr( "dy", ".71em")
        .style("text-anchor", "end")
        .text(axisText);

      var stack = d3.layout.stack()
        .offset("wiggle")
        .values(function (d) { return d.values; })
        .x(function (d) { return d.year; })
        .y(function (d) { return d.y; });

      var graph = stacked_graph.selectAll(".series")
        .data(data)
        .enter().append("g")
          .attr("class", "series");

      var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function (d) { return x(d.year); })
        .y0(function (d) { return y(d.y0); })
        .y1(function (d) { return y(d.y); });

      graph.append("path")
        .attr("class", "streamPath")
        .attr("d", function (d) { return area(d.values); })
        .style("fill", function (d) { return color(d.name); })
        .style("stroke", "grey");

      // add a group for the interactive effects
      var mouseG = stacked_graph.append("g")
        .attr("class", "mouse-over-effects");

      // add interactive effects
      stackedGraphValues(data, country, years);

      updateLegendGraph(legendText, legendColor)
    };


    function stackedGraphValues(data, country, years) {

      // stacked_graph.selectAll(".mouse-per-line").remove();
      var mouseG = d3.select(".mouse-over-effects");

      // add data for the graph
      var mousePerLine = mouseG.selectAll('.mouse-per-line')
        .data(data)
        .enter()
        .append("g")
        .attr("class", "mouse-per-line");

      // initiate the circles on the graphs at data values
      mousePerLine.append("circle")
        .attr("class", "circles_")
        .attr("r", 5)
        .style("stroke", "grey")
        .style("fill", "none")
        .style("stroke-width", "1px")
        .style("opacity", "0");

      mousePerLine.append("text")
        .attr("class", "texts_")
        .attr("transform", "translate(10,3)");

      // append a rect to catch mouse movements on canvas
      mouseG.append('svg:rect')
        .attr('width', inner_width)
        .attr('height', inner_height_graph)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')

        // on mouse out hide line, circles and text
        .on('mouseout', function() {
          d3.selectAll(".circles_").style("opacity", "0");
          d3.selectAll(".texts_").style("opacity", "0");
        })

        // show line, circles and text
        .on('mouseover', function() {
          d3.selectAll(".circles_").style("opacity", "1");
          d3.selectAll(".texts_").style("opacity", "1");
        })

        // define properties for mouse moving over canvas
        .on('mousemove', function() {
          var mouse = d3.mouse(this);

          // find position for circles and text
          d3.selectAll(".mouse-per-line")
            .attr("transform", function(d, i) {
              var xDate = x.invert(mouse[0]),
                  bisect = d3.bisector(function(d) { return d.year; }).right;
                  idx = bisect(d.values, xDate);

              // save data of where the mouse is
              var y_values = [data[0]['values'][idx]['y'].toFixed(2), data[1]['values'][idx]['y'].toFixed(2)];
              var x_value = years[idx];

              // set position of the circles
              d3.selectAll(".circles_")
                .data(y_values)
                .attr("cx", x(x_value))
                .attr("cy", function(d, i) { return y(d); });

              // set position of text and add data value as text
              d3.selectAll(".texts_")
                .data(y_values)
                .attr("x", function(d, i) { return x(x_value); })
                .attr("y", function(d, i) { return y(d); })
                .text(function(d) { return d; });

            });
        });
    };

    function updateLegendGraph(legendText, legendColor) {

      d3.selectAll('.legend-graph').remove();


      var legend = stacked_graph.selectAll(".legendGraph")
        .data(legendText)
        .enter().append("g")
          .attr("class", "legend-graph")
          .attr("transform", function (d, i) {
            return "translate(55," + i * 20 + ")";
          });

      legend.append("rect")
          .attr("x", inner_width - margin.right * 1.5 - 15)
          .attr("y", - 50)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function(d, i){ return legendColor[i]; })
          .style("stroke", "grey");

      legend.append("text")
          .attr("x", inner_width - margin.right * 1.5)
          .attr("y", - 44)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function (d) { return d; });
    };




    function update_graph(country, variable) {

      // select needed data based on variable
      if (variable == "waste") {
        var data = data_waste[country];
        color.range(["#b2df8a", "#C0C0C0"]);
        legendText = ["Total waste " + country, "Recycled waste " + country];
        legendColor = ["#C0C0C0", "#b2df8a"];
        axisText = "Waste in thousand tonnes";
      }
      else if (variable == "energy") {
        var data = data_energy[country];
        color.range(["#b2df8a", "#C0C0C0"]);
        legendText = ["Total energy production " + country, "Renewable energy production " + country];
        legendColor = ["#C0C0C0", "#b2df8a"];
        axisText = "Energy production in million TOE";
      }
      else {
        var data = data_emission[country];
        color.range(["#fdbf6f", "#C0C0C0"]);
        legendText = ["Total gas emission " + country, "CO2 emission " + country]
        legendColor = ["#C0C0C0", "#fdbf6f"];
        axisText = "Gas emission in million tonnes";
      }

      if (typeof(data) != "undefined") {

        // determine maximum value for y domain and x domain
        var total_max = 0;
        var years = [], first_year = 0, last_year = 0;
        for (var j = 0, m = data.length; j < m; j++) {
          for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
            years.push(data[j]["values"][i]["year"]);
            if (data[j]["values"][i]["y"] > total_max) {
              total_max = data[j]["values"][i]["y"];
            };
          };
        };

        // get variable names
        var varNames = []
        for (var i = 0, n = data.length; i < n; i++) {
          varNames.push(data[i]["name"]);
        };

        // start graph if first time
        if (graph_started == false) {
          start_graph(country, data, variable, years, total_max, varNames, axisText, legendText, legendColor)
        }

        // if graph already exists, update
        else {

          // define the domains of the data values
      		x.domain([years[0], years[(years.length - 1)]]);
      		y.domain([0, total_max * 1.1]);

          color.domain(varNames);

          // change the y axis
          stacked_graph.selectAll(".y.axis")
            .transition()
            .call(y_axis);

          // change the x axis
          stacked_graph.selectAll(".x.axis")
            .transition()
            .call(x_axis);

          // change text on axis
          stacked_graph.selectAll(".y.axis.text")
            .text(axisText);

          var stack = d3.layout.stack()
            .offset("wiggle")
            .values(function (d) { return d.values; })
            .x(function (d) { return d.year; })
            .y(function (d) { return d.y; });

          var area = d3.svg.area()
            .interpolate("cardinal")
            .x(function (d) { return x(d.year); })
            .y0(function (d) { return y(d.y0); })
            .y1(function (d) { return y(d.y); });

          stacked_graph.selectAll(".series")
            .data(data)
            .select("path")
            .attr("class", "streamPath")
            .attr("d", function (d) { return area(d.values); })
            .style("fill", function (d) { return color(d.name); })
            .style("stroke", "grey");

          stackedGraphValues(data, country, years);

          updateLegendGraph(legendText, legendColor)

        };
      }
      else {
        alert("Sorry, we don't have data available for " + country + " on " + variable);
      }
      return true;
    };




    // determine min and max of performance values
    var onlyValues = data_map.map(function(obj){ return obj[1]; });
    var minValue = Math.min.apply(null, onlyValues)
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    var paletteScale = d3.scale.linear()
          .domain([minValue, maxValue])
          .range(["#d0d1e6", "#034e7b"]);

    // fill dataset in appropriate format
    var dataset = {}
    data_map.forEach(function(item){
        var iso = item[0],
                value = item[1];
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

    // create European map
    var map = new Datamap({element: document.getElementById("map"),

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

        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        highlightOnHover: false,
        popupOnHover: true
      },
    });

    // set color scale for legend of map
    var colors = d3.scale.quantize()
    .range(['#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d']);

    // add legend of map
    var legend = d3.select('#legend')
      .append('ul')
      .attr('class', 'list-inline');

    // add data for legend of map
    var keys = legend.selectAll('li.key')
        .data(colors.range());

    // add colors and text to legend of map
    var legendText = ["Environment unfriendly", "", "", "", "", "Environment friendly"]
    keys.enter().append('li')
        .attr('class', 'key')
        .style('border-top-color', String)
        .text(function(d, i) {
            return legendText[i];
        });

    // draw first circle
    var config1 = liquidFillGaugeDefaultSettings();
    var gauge1 = loadLiquidFillGauge("fillgauge1", 0, max_recycled);

    // draw second circle
    var config2 = liquidFillGaugeDefaultSettings();
    var gauge2 = loadLiquidFillGauge("fillgauge2", 0, max_renewable);

    // draw third circle
    var config3 = liquidFillGaugeDefaultSettings();
    config3.circleColor = "#fdbf6f";
    config3.waveColor = "#fdbf6f";
    config3.waveTextColor = "#ff7f00";
    var gauge3 = loadLiquidFillGauge("fillgauge3", 0, max_co2, config3);

    d3.selectAll("#fillgauge1").on("click", function(d, i) {
      selected_variable = "waste";
      if (selected_country != 0) {
        graph_started = update_graph(selected_country, selected_variable);
      }
    });

    d3.selectAll("#fillgauge2").on("click", function(d, i) {
      selected_variable = "energy";
      if (selected_country != 0) {
        graph_started = update_graph(selected_country, selected_variable);
      }
    });

    d3.selectAll("#fillgauge3").on("click", function(d, i) {
      selected_variable = "emission";
      if (selected_country != 0) {
        graph_started = update_graph(selected_country, selected_variable);
      }
    });

    //Options for the Radar chart, other than default
    var mycfg = {
      w: widthRadar,
      h: heightRadar,
      maxValue: 0.6,
      levels: 6,
      ExtraWidthX: 300
    }

    var selected_countries = [];
    // update the chart when input field is changed
		$("input").change(function(){
      var selected_countriesOld = selected_countries;
      selected_countries = [];
			for (var i = 0, n = countries.length; i < n; i++) {
				var country_checked = document.getElementById("checkbox" + countries[i]).checked;
				if (country_checked) {
					selected_countries.push(countries[i]);
				};
			};

      // execute update
      updateRadar(selected_countries, selected_countriesOld, data_radar);

      // update country border if page is opened for the first time
      if (selected_country_old == 0 && selected_countries.length == 1)  {
        update_border_color(selected_countries[0], selected_country_old, countries);
      };

    });

    // update circle menu and radar chart when country is clicked
    map.svg.selectAll('.datamaps-subunit').on('click', function() {
      selected_country_old = selected_country;
      selected_country = d3.select(this)[0][0].classList[1];
      selected_country = update_border_color(selected_country, selected_country_old, countries);
      gauge1.update(data2015[selected_country][0]);
      gauge2.update(data2015[selected_country][1]);
      gauge3.update(data2015[selected_country][2]);
      startRadar(selected_country, data_radar, countries);
      if (selected_variable != 0) {
        graph_started = update_graph(selected_country, selected_variable);
      }
    });

    function update_border_color(selected_country, selected_country_old, countries) {
      if ($.inArray(selected_country, countries) != -1) {
        if (selected_country_old != 0) {
          var country_old = document.getElementsByClassName("datamaps-subunit " + selected_country_old)[0];
          country_old.style.stroke = "#ffffff";
        }
        var country = document.getElementsByClassName("datamaps-subunit " + selected_country)[0];
        country.style.stroke = "#000000";
      }
      else {
        selected_country = selected_country_old;
      }
      return selected_country;
    };

    /**
    * resets the radar chart with country selected from map
    */
    function startRadar(country, data, countries) {
      for (var i = 0, n = countries.length; i < n; i++) {

        // uncheck all boxes of countries that are not clicked on
        if (countries[i] != country) {
          document.getElementById("checkbox" + countries[i]).checked = false;
        }

        // check box of selected country
        else {
          document.getElementById("checkbox" + country).checked = true;
        }
      };

      // draw radar chart of selected country
      radarChart.draw("#radarchart", [data[country]], mycfg);

      updateLegendRadar([country]);

    };

    /**
    * updates the radar chart based on selected countries
    */
    function updateRadar(countries, countriesOld, data) {

      // set maximum number of countries
      max_number = 4;
      if (countries.length > max_number) {
        countries = alertFunction(countries, max_number);
      };

      // prepare needed data for radar chart
      var dataCountries = [];
      var displayed_countries = [];
      for (i = 0, n = countries.length; i < n; i++) {
        displayed_countries.push(countries[i]);
        dataCountries.push(data[countries[i]]);
      };

      // draw chart if at least one country is selected
      if (dataCountries.length > 0) {
        radarChart.draw("#radarchart", dataCountries, mycfg);
      }

      // return error message when no country is selected
      else {
        if (startDropdown) {
          alert("Oops! At least one country has to be selected for the radar chart!");
          document.getElementById("checkbox" + countriesOld[0]).checked = true;
          if (typeof(countriesOld[0]) != undefined) {
            displayed_countries = str(countriesOld[0]);
          }
        }

        // return no error message if country is selected for first time
        else {
          startDropdown = true;
        }
      }

      updateLegendRadar(displayed_countries);
    };

    function alertFunction(countries, max_number) {
      var txt;
      var country = prompt("Oops! At most 4 countries can be selected at the same"
                            + "time. Type the country code of the country that you"
                            + "want to remove. You can choose between " + countries[0]
                            + ", " + countries[1] + ", " + countries[2] + ", "
                            + countries[3] + " or " + countries[4], countries[0]);
      if (countries.indexOf(country) < 0) {
          alertFunction(countries, max_number);
      }
      else if (country == null) {
        alert('hoi');
      }
      else {
          // remove country from countries
          var index = countries.indexOf(country);
          if (index > -1) {
            countries.splice(index, 1);
          };
          document.getElementById("checkbox" + country).checked = false;
          return countries;
      }
    };

    function updateLegendRadar(displayed_countries) {

      d3.selectAll("svg.legend-chart").remove();

      var colorscale = ["#1f78b4", "#6a3d9a", "#33a02c", "#fb9a99"];

      //Legend titles
      var LegendOptions = displayed_countries;

      var svg = d3.select('#radar_legend')
      	.append('svg')
        .attr('class', 'legend-chart')
      	.attr("width", widthRadar + 200)
      	.attr("height", heightRadar - 50)

      //Create the title for the legend
      var text = svg.append("text")
      	.attr("class", "title")
      	.attr('transform', 'translate(90,0)')
      	.attr("x", widthRadar - 70)
      	.attr("y", 10)
      	.attr("font-size", "12px")
      	.attr("fill", "#404040")
      	.text("Selected countries");

      //Initiate Legend
      var legend = svg.append("g")
      	.attr("class", "legend")
      	.attr("height", 100)
      	.attr("width", 200)
      	.attr('transform', 'translate(90,20)')
      	;
      	//Create colour squares
      	legend.selectAll('rect')
      	  .data(LegendOptions)
      	  .enter()
      	  .append("rect")
          .attr("class", "radar_legend")
      	  .attr("x", widthRadar - 65)
      	  .attr("y", function(d, i){ return i * 20;})
      	  .attr("width", 10)
      	  .attr("height", 10)
      	  .style("fill", function(d, i){ return colorscale[i];})
      	  ;
      	//Create text next to squares
      	legend.selectAll('text')
      	  .data(LegendOptions)
      	  .enter()
      	  .append("text")
          .attr("class", "radar_legend")
      	  .attr("x", widthRadar - 52)
      	  .attr("y", function(d, i){ return i * 20 + 9;})
      	  .attr("font-size", "11px")
      	  .attr("fill", "#737373")
      	  .text(function(d) { return d; })
    }

  };
};
