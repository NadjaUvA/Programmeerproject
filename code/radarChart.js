/**
* This file contains the variable, the start function and the update function of the
* radar chart as well as the alert function for the dropdown menu
*
* Nadja van 't Hoff (11030720)
*/

// define radarChart variable
var radarChart = {
  draw: function(id, dataRadar){

  // specify options of the radar chart
  var cfg = {
     radius: 5,
     w: widthRadar + 100,
     h: heightRadar + 100,
     factor: 1,
     factorLegend: .85,
     levels: 6,
     maxValue: 0.6,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 80,
     TranslateY: 30,
     ExtraWidthX: 300,
     ExtraWidthY: 100,
     color: ["#1f78b4", "#6a3d9a", "#33a02c", "#fb9a99"]
  };

  // determine maximum values and set variables
  cfg.maxValue = Math.max(cfg.maxValue, d3.max(dataRadar, function(i){
    return d3.max(i.map(function(o){ return o.value; })
  )}));
  var allAxis = (dataRadar[0].map(function(i, j) {return i.axis} ));
  var total = allAxis.length;
  var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
  var Format = d3.format("%");
  d3.select(id).select("svg").remove();

  // add the svg for the radar chart
  var g = d3.select(id)
    .append("svg")
    .attr("width", cfg.w + cfg.ExtraWidthX)
    .attr("height", cfg.h + cfg.ExtraWidthY)
    .append("g")
    .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

  // add the circular segments
  for (var j = 0; j < cfg.levels - 1; j++) {
    var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    g.selectAll(".levels")
      .data(allAxis)
      .enter()
      .append("svg:line")
      .attr("x1", function(d, i){
       return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
      })
      .attr("y1", function(d, i){
       return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
      })
      .attr("x2", function(d, i){
       return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
      })
      .attr("y2", function(d, i){
       return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-opacity", "0.75")
      .style("stroke-width", "0.3px")
      .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", "
            + (cfg.h / 2 - levelFactor) + ")");
  };

  // add text indicating at what % each level is
  for (var j = 0; j < cfg.levels; j++) {
    var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
    g.selectAll(".levels")

      // use dummy data
      .data([1])
      .enter()
      .append("svg:text")
      .attr("x", function(d){ return levelFactor * (1 - cfg.factor * Math.sin(0)); })
      .attr("y", function(d){ return levelFactor * (1 - cfg.factor * Math.cos(0)); })
      .attr("class", "legend")
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", "
            + (cfg.h / 2 - levelFactor) + ")")
      .attr("fill", "#737373")
      .text(Format((j + 1) * cfg.maxValue / cfg.levels));
  };

  // add axis element of the chart
  var axis = g.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  // add the lines of the axis
  axis.append("line")
    .attr("x1", cfg.w / 2)
    .attr("y1", cfg.h / 2)
    .attr("x2", function(d, i) {
      return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
    })
    .attr("y2", function(d, i) {
      return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
    })
    .attr("class", "line")
    .style("stroke", "grey")
    .style("stroke-width", "1px");

  // add the correct percentages of the axis
  axis.append("text")
    .attr("class", "legend")
    .text(function(d) {return d})
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("dy", "1.5em")
    .attr("transform", function(d, i) {return "translate(0, -10)"})
    .attr("x", function(d, i) {
      return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total))
        - 60 * Math.sin(i * cfg.radians / total);
    })
    .attr("y", function(d, i) {
      return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total))
        - 20 * Math.cos(i * cfg.radians / total);
    });

  // add data values to the areas of the chart
  series = 0;
  dataRadar.forEach(function(y, x){
    dataValues = [];
    g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue)
          * cfg.factor * Math.sin(i * cfg.radians / total)),
        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue)
          * cfg.factor * Math.cos(i * cfg.radians / total))
        ]);
      });
    dataValues.push(dataValues[0]);
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie" + series)
      .style("stroke-width", "2px")
      .style("stroke", cfg.color[series])

      // add the points at the corners of the chart
      .attr("points", function(d) {
       var str="";
       for (var pti = 0; pti < d.length; pti++) {
           str = str + d[pti][0] + "," + d[pti][1] + " ";
         }
         return str;
        })
      .style("fill", function(j, i) {return cfg.color[series]})
      .style("fill-opacity", cfg.opacityArea)

      // add interactivity to the areas of the chart
      .on("mouseover", function (d) {
        z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
         .transition(200)
         .style("fill-opacity", 0.1);
        g.selectAll(z)
         .transition(200)
         .style("fill-opacity", .7);
      })
      .on("mouseout", function(){
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      });
    series++;
  });

  // add the circles at the edges of each area
  series=0;
  dataRadar.forEach(function(y, x){
    g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie" + series)
      .attr("r", cfg.radius)
      .attr("alt", function(j) { return Math.max(j.value, 0) })
      .attr("cx", function(j, i) {
        dataValues.push([
        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue)
          * cfg.factor * Math.sin(i * cfg.radians / total)),
        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value,
          0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
      ]);
      return cfg.w / 2 * (1 - (Math.max(j.value,
        0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
      })
      .attr("cy", function(j, i){
        return cfg.h / 2 * (1 - (Math.max(j.value,
          0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
      })
      .attr("data-id", function(j){ return j.axis; })
      .style("fill", cfg.color[series]).style("fill-opacity", .9)

      // add calue display and color update of area to the circles
      .on("mouseover", function (d){
        newX =  parseFloat(d3.select(this).attr("cx")) - 10;
        newY =  parseFloat(d3.select(this).attr("cy")) - 5;
        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(Format(d.value))
          .transition(200)
          .style("opacity", 1);
        z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", 0.1);
        g.selectAll(z)
          .transition(200)
          .style("fill-opacity", .7);
      })
      .on("mouseout", function(){
        tooltip
          .transition(200)
          .style("opacity", 0);
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
        })
      .append("svg:title")
      .text(function(j){ return Math.max(j.value, 0); });
      series++;
  });

  // create tooltip
  tooltip = g.append("text")
    .style("opacity", 0)
    .style("font-family", "sans-serif")
    .style("font-size", "13px");
  };
};

/*
* resets the radar chart with country selected from map
*/
function startRadar(country, data, countries) {
  for (var i = 0, n = countries.length; i < n; i++) {

    // uncheck all boxes of countries that are not clicked on
    if (countries[i] != country & countries[i] != "EU") {
      document.getElementById("checkbox" + countries[i]).checked = false;
    }

    // check box of selected country
    else {
      document.getElementById("checkbox" + country).checked = true;
    }
  };

  // draw radar chart of selected country
  radarChart.draw("#radarChart", [data[country]]);

  // add legend to the chart
  updateLegendRadar([country]);
};

/*
* updates the radar chart based on selected countries
*/
function updateRadar(countries, countriesOld, data) {

  // set maximum number of countries
  maxNumber = 4;
  if (countries.length > maxNumber) {
    countries = alertFunction(countries, maxNumber);
  };

  // prepare needed data for radar chart
  var dataCountries = [];
  var displayedCountries = [];
  for (i = 0, n = countries.length; i < n; i++) {
    displayedCountries.push(countries[i]);
    dataCountries.push(data[countries[i]]);
  };

  // draw chart if at least one country is selected
  if (dataCountries.length > 0) {
    radarChart.draw("#radarChart", dataCountries);
  }

  // return error message when no country is selected
  else {
    if (startDropdown) {
      alert("Oops! At least one country has to be selected for the radar chart!");
      document.getElementById("checkbox" + countriesOld[0]).checked = true;
      if (typeof(countriesOld[0]) != undefined) {
        displayedCountries = str(countriesOld[0]);
      }
    }

    // return no error message if country is selected for first time
    else {
      startDropdown = true;
    };
  };

  // add legend to the chart
  updateLegendRadar(displayedCountries);
};

/*
* returns an alert when more than specified number of boxes is checked
*/
function alertFunction(countries, maxNumber) {

  // define alert text
  var country = prompt("Oops! At most 4 countries can be selected at the same"
    + "time. Type the country code of the country that you want to remove. "
    + "You can choose between " + countries[0] + ", " + countries[1] + ", "
    + countries[2] + ", " + countries[3] + " or " + countries[4], countries[0]);

  // return error message
  if (countries.indexOf(country) < 0) {
      alertFunction(countries, maxNumber);
  }
  else {
      // remove country from countries
      var index = countries.indexOf(country);
      if (index > -1) {
        countries.splice(index, 1);
      };

      // uncheck checkbox of chosen country
      document.getElementById("checkbox" + country).checked = false;
      return countries;
  };
};

/*
* updates the legend of the radar chart
*/
function updateLegendRadar(displayedCountries) {

  d3.selectAll("svg.legend-chart").remove();

  var colorscale = ["#1f78b4", "#6a3d9a", "#33a02c", "#fb9a99"];

  // define legend
  var svg = d3.select("#radarLegend")
  	.append("svg")
    .attr("class", "legend-chart")
  	.attr("width", widthRadar + 200)
  	.attr("height", heightRadar - 50)

  // create the title for the legend
  var text = svg.append("text")
  	.attr("class", "title")
  	.attr("transform", "translate(170,0)")
  	.attr("x", widthRadar - 70)
  	.attr("y", 10)
  	.attr("font-size", "12px")
  	.attr("fill", "#404040")
  	.text("Selected countries");

  // initiate legend
  var legend = svg.append("g")
  	.attr("class", "legend")
  	.attr("height", 100)
  	.attr("width", 200)
  	.attr("transform", "translate(170,20)");

	// create color squares
	legend.selectAll("rect")
	  .data(displayedCountries)
	  .enter()
	  .append("rect")
    .attr("class", "radarLegend")
	  .attr("x", widthRadar - 65)
	  .attr("y", function(d, i){ return i * 20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(d, i){ return colorscale[i];});

  	// create text next to squares
  	legend.selectAll("text")
  	  .data(displayedCountries)
  	  .enter()
  	  .append("text")
      .attr("class", "radarLegend")
  	  .attr("x", widthRadar - 52)
  	  .attr("y", function(d, i){ return i * 20 + 9;})
  	  .attr("font-size", "11px")
  	  .attr("fill", "#737373")
  	  .text(function(d) { return d; })
}
