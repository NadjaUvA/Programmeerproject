/**
* an application with linked graphs that visualize the environmental progress of European countries
*
* Nadja van 't Hoff (11030720)
*/

var w = 400, h = 400;

var selected_country = 0;
var selected_country_old = 0;
var selected_variable = 0;
var graph_started = false;

var RadarChart = {
  draw: function(id, data_radar, options){
  var cfg = {
     radius: 5,
     w: w + 100,
     h: h + 100,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 100,
     color: ["#1f78b4", "#6a3d9a", "#33a02c", "#fb9a99"]
    };

    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    cfg.maxValue = Math.max(cfg.maxValue, d3.max(data_radar, function(i){return d3.max(i.map(function(o){return o.value;}))}));
    var allAxis = (data_radar[0].map(function(i, j){return i.axis}));
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
        ;

    var tooltip;

    //Circular segments
    for(var j=0; j<cfg.levels-1; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text(Format((j+1)*cfg.maxValue/cfg.levels));
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


    data_radar.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("polygon")
             .attr("class", "radar-chart-serie"+series)
             .style("stroke-width", "2px")
             .style("stroke", cfg.color[series])
             .attr("points",function(d) {
               var str="";
               for(var pti=0;pti<d.length;pti++){
                 str=str+d[pti][0]+","+d[pti][1]+" ";
               }
               return str;
              })
             .style("fill", function(j, i){return cfg.color[series]})
             .style("fill-opacity", cfg.opacityArea)
             .on('mouseover', function (d){
                      z = "polygon."+d3.select(this).attr("class");
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", 0.1);
                      g.selectAll(z)
                       .transition(200)
                       .style("fill-opacity", .7);
                      })
             .on('mouseout', function(){
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", cfg.opacityArea);
             });
      series++;
    });
    series=0;


    data_radar.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0)})
      .attr("cx", function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
      return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
      .attr("cy", function(j, i){
        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
      })
      .attr("data-id", function(j){return j.axis})
      .style("fill", cfg.color[series]).style("fill-opacity", .9)
      .on('mouseover', function (d){
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 5;

            tooltip
              .attr('x', newX)
              .attr('y', newY)
              .text(Format(d.value))
              .transition(200)
              .style('opacity', 1);

            z = "polygon."+d3.select(this).attr("class");
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", 0.1);
            g.selectAll(z)
              .transition(200)
              .style("fill-opacity", .7);
            })
      .on('mouseout', function(){
            tooltip
              .transition(200)
              .style('opacity', 0);
            g.selectAll("polygon")
              .transition(200)
              .style("fill-opacity", cfg.opacityArea);
            })
      .append("svg:title")
      .text(function(j){return Math.max(j.value, 0)});

      series++;
    });
    //Tooltip
    tooltip = g.append('text')
           .style('opacity', 0)
           .style('font-family', 'sans-serif')
           .style('font-size', '13px');
    }
};

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


    // set width, height and margins
    var width = 650, height_graph = 350;
    var margin = {top: 50, right: 150, bottom: 70, left: 60},
    			inner_width = width - margin.left - margin.right,
    			inner_height_graph = height_graph - margin.top - margin.bottom;

    // define functions to scale width and height for the linegraph
    var y = d3.scale.linear()
    	.range([inner_height_graph, 0]);
    var x = d3.time.scale()
    	.range([0, inner_width]);

    var color = d3.scale.ordinal()
      .range(["#a6cee3", "#b2df8a"])

    // create axes of the linegraph
    var x_axis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");
    var	y_axis = d3.svg.axis()
    	.scale(y)
    	.orient("left");

    // set attributes of the linegraph
    var stacked_graph = d3.select("#stacked_graph").append("svg")
      .attr("width", width)
      .attr("height", height_graph)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // adjust data for every country
    for (k = 0, o = countries.length; k < o; k++) {
      data = data_energy[countries[k]];
      // convert years to Javascript years and determine maximum value for y domain
      var parseDate = d3.time.format("%Y").parse;
      var years = [];
      for (var j = 0, m = data.length; j < m; j++) {
        for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
          data[j]["values"][i]["year"] = parseDate(data[j]["values"][i]["year"])
          years.push(data[j]["values"][i]["year"]);
          data[j]["values"][i]["y"] = +data[j]["values"][i]["y"];
          data[j]["values"][i]["y0"] = +data[j]["values"][i]["y0"];
        };
      };
    };

    function start_graph(data, variable) {

      // determine maximum value for y domain
      var total_max = 0
      for (var j = 0, m = data.length; j < m; j++) {
        for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
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
        .attr("class", "text")
        .attr("transform", "rotate(-90)")
        .attr("y", - 40)
        .attr( "dy", ".71em")
        .style("text-anchor", "end")
        .text(variable);

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
    };


    function update_graph(country, variable) {

      // select needed data based on variable
      if (variable == "waste") {
        var data_variable = data_waste;
      }
      else if (variable == "energy") {
        var data_variable = data_energy;
      }
      else {
        var data_variable = data_emission;
      }

      data = data_variable[country]

      // start graph if first time
      if (graph_started == false) {
        start_graph(data, variable)
      }

      // if graph already exists, update
      else {

        // determine maximum value for y domain
        var total_max = 0
        for (var j = 0, m = data.length; j < m; j++) {
          for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
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
      };
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
          .scale(550)
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
      w: w,
      h: h,
      maxValue: 0.6,
      levels: 6,
      ExtraWidthX: 300
    }

    var selected_countries = [];
    // update the chart when input field is changed
		$("input").change(function(){
      var selected_countries_old = selected_countries;
      selected_countries = [];
			for (var i = 0, n = countries.length; i < n; i++) {
				var country_checked = document.getElementById("checkbox" + countries[i]).checked;
				if (country_checked) {
					selected_countries.push(countries[i]);
				};
			};

      // execute update
      update_radar(selected_countries, selected_countries_old, data_radar);

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
      start_radar(selected_country, data_radar, countries);
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
    function start_radar(country, data, countries) {
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
      RadarChart.draw("#radar_chart", [data[country]], mycfg);

      update_legend_radar([country]);

      ;
    };

    /**
    * updates the radar chart based on selected countries
    */
    function update_radar(countries, countries_old, data) {

      // set maximum number of countries
      max_number = 4;
      if (countries.length > max_number) {
        countries = alert_function(countries, max_number);
      };

      // prepare needed data for radar chart
      var data_countries = [];
      var displayed_countries = [];
      for (i = 0, n = countries.length; i < n; i++) {
        displayed_countries.push(countries[i]);
        data_countries.push(data[countries[i]]);
      };

      // draw chart if at least one country is selected
      if (data_countries.length > 0) {
        RadarChart.draw("#radar_chart", data_countries, mycfg);
      }

      // return error message when no country is selected
      else {
        alert("Oops! At least one country has to be selected for the radar chart!");
        document.getElementById("checkbox" + countries_old[0]).checked = true;
        displayed_countries = str(countries_old[0]);
      }

      update_legend_radar(displayed_countries);
    };

    function alert_function(countries, max_number) {
      var txt;
      var country = prompt("Oops! At most 4 countries can be selected at the same"
                            + "time. Type the country code of the country that you"
                            + "want to remove. You can choose between " + countries[0]
                            + ", " + countries[1] + ", " + countries[2] + ", "
                            + countries[3] + " or " + countries[4], countries[0]);
      if (countries.indexOf(country) < 0) {
          alert_function(countries, max_number);
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

    function update_legend_radar(displayed_countries) {

      d3.selectAll("svg.legend-chart").remove();

      var colorscale = ["#1f78b4", "#6a3d9a", "#33a02c", "#fb9a99"];

      //Legend titles
      var LegendOptions = displayed_countries;

      var svg = d3.select('#radar_legend')
      	.append('svg')
        .attr('class', 'legend-chart')
      	.attr("width", w+300)
      	.attr("height", h-300)

      //Create the title for the legend
      var text = svg.append("text")
      	.attr("class", "title")
      	.attr('transform', 'translate(90,0)')
      	.attr("x", w - 70)
      	.attr("y", 10)
      	.attr("font-size", "12px")
      	.attr("fill", "#404040")
      	.text("Countries");

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
      	  .attr("x", w - 65)
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
      	  .attr("x", w - 52)
      	  .attr("y", function(d, i){ return i * 20 + 9;})
      	  .attr("font-size", "11px")
      	  .attr("fill", "#737373")
      	  .text(function(d) { return d; })
    }

  };
};
