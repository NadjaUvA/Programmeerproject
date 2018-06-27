/**
* This script contains the functions for the stacked graph. One function to start
* the graph, one to update it, one for the interactive values one for the legend.
*
* Nadja van 't Hoff (11030720)
*/

/**
* draws the stacked graph for the first time
*/
function startStackedGraph(country, data, variable, years, maxTotal, varNames,
  axisText, legendText, legendColor) {

  // define the domains of the data values
  x.domain([years[0], years[(years.length - 1)]]);
  y.domain([0, maxTotal * 1.1]);
  color.domain(varNames);

  // set attributes of the stacked graph
  var stackedGraph = d3.select("#stackedGraph").append("svg")
    .attr("id", "stacked-graph")
    .attr("width", widthStackedGraph)
    .attr("height", heightStackedGraph)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the x axis
  stackedGraph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + innerHeightStackedGraph + ")")
    .call(xAxisStackedGraph);

  // add the y axis
  stackedGraph.append("g")
    .attr("class", "y axis")
    .call(yAxisStackedGraph)
    .append("text")
    .attr("class", "y axis text")
    .attr("transform", "rotate(-90)")
    .attr("y", - 40)
    .attr( "dy", ".71em")
    .style("text-anchor", "end")
    .text(axisText);

  // append the data to the graph element
  var graph = stackedGraph.selectAll(".series")
    .data(data)
    .enter().append("g")
      .attr("class", "series");

  // define the function of the layers of the graph
  var stack = d3.layout.stack()
    .offset("wiggle")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.year; })
    .y(function(d) { return d.y; });

  // define the function of the areas of the graph
  var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.year); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y); });

  // add the layers to the graph
  graph.append("path")
    .attr("class", "streamPath")
    .attr("d", function(d) { return area(d.values); })
    .style("fill", function(d) { return color(d.name); })
    .style("stroke", "grey");

  // add a group for the interactive effects
  var mouseG = stackedGraph.append("g")
    .attr("class", "mouse-over-effects");

  // add interactive effects
  stackedGraphValues(data, country, years);

  // add the legend
  updateLegendGraph(legendText, legendColor)
};

/**
* update the stacked graph
*/
function updateStackedGraph(country, variable, dataWaste, dataEnergy, dataEmission) {

  // select needed data based on variable
  if (variable == "waste") {
    var data = dataWaste[country];
    color.range(["#b2df8a", "#C0C0C0"]);
    var legendText = ["Total waste " + country, "Recycled waste " + country];
    var legendColor = ["#C0C0C0", "#b2df8a"];
    var axisText = "Waste in thousand tonnes";
  }
  else if (variable == "energy") {
    var data = dataEnergy[country];
    color.range(["#b2df8a", "#C0C0C0"]);
    var legendText = ["Total energy production " + country,
      "Renewable energy production " + country];
    var legendColor = ["#C0C0C0", "#b2df8a"];
    var axisText = "Energy production in million TOE";
  }
  else {
    var data = dataEmission[country];
    color.range(["#fdbf6f", "#C0C0C0"]);
    var legendText = ["Total gas emission " + country, "CO2 emission " + country]
    var legendColor = ["#C0C0C0", "#fdbf6f"];
    var axisText = "Gas emission in million tonnes";
  };

  if (typeof(data) != "undefined") {

    // determine maximum value for y domain and x domain
    var maxTotal = 0;
    var years = [], first_year = 0, last_year = 0;
    for (var j = 0, m = data.length; j < m; j++) {
      for (var i = 0, n = (data[0]["values"]).length; i < n; i++) {
        years.push(data[j]["values"][i]["year"]);
        if (data[j]["values"][i]["y"] > maxTotal) {
          maxTotal = data[j]["values"][i]["y"];
        };
      };
    };

    // get variable names
    var varNames = [];
    for (var i = 0, n = data.length; i < n; i++) {
      varNames.push(data[i]["name"]);
    };

    // start graph if first time
    if (stackedGraphStarted == false) {
      startStackedGraph(country, data, variable, years, maxTotal, varNames,
        axisText, legendText, legendColor)
    }

    // update if graph already exists
    else {

      // define the domains of the data values
      x.domain([years[0], years[(years.length - 1)]]);
      y.domain([0, maxTotal * 1.1]);
      color.domain(varNames);

      // change the y axis
      var stackedGraph = d3.select("#stackedGraph");
      stackedGraph.selectAll(".y.axis")
        .transition()
        .call(yAxisStackedGraph);

      // change the x axis
      stackedGraph.selectAll(".x.axis")
        .transition()
        .call(xAxisStackedGraph);

      // change text on axis
      stackedGraph.selectAll(".y.axis.text")
        .text(axisText);

      // define the function of the layers of the graph
      var stack = d3.layout.stack()
        .offset("wiggle")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.year; })
        .y(function(d) { return d.y; });

      // define the function of areas of the graph
      var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y); });

      // add the layers to the graph
      stackedGraph.selectAll(".series")
        .data(data)
        .select("path")
        .attr("class", "streamPath")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); })
        .style("stroke", "grey");

      // add interactive effects
      stackedGraphValues(data, country, years);

      // add the legend
      updateLegendGraph(legendText, legendColor);
    };
  }

  // give alertr if no data is available on user's selection
  else {
    alert("Sorry, we don't have data available for " + country + " on " + variable);
  };

  return true;
};

/**
* add interactive values to the stacked graph
*/
function stackedGraphValues(data, country, years) {

  // stackedGraph.selectAll(".mouse-per-line").remove();
  var mouseG = d3.select(".mouse-over-effects");

  // add data for the graph
  var mousePerLine = mouseG.selectAll(".mouse-per-line")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  // initiate the circles on the graphs at data values
  mousePerLine.append("circle")
    .attr("class", "circles")
    .attr("r", 5)
    .style("stroke", "grey")
    .style("fill", "none")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  // initiate the text elements of the values
  mousePerLine.append("text")
    .attr("class", "texts")
    .attr("transform", "translate(10,3)");

  // append a rect to catch mouse movements on canvas
  mouseG.append("svg:rect")
    .attr("width", innerWidthStackedGraph)
    .attr("height", innerHeightStackedGraph)
    .attr("fill", "none")
    .attr("pointer-events", "all")

    // on mouse out hide line, circles and text
    .on("mouseout", function() {
      d3.selectAll(".circles").style("opacity", "0");
      d3.selectAll(".texts").style("opacity", "0");
    })

    // show line, circles and text
    .on("mouseover", function() {
      d3.selectAll(".circles").style("opacity", "1");
      d3.selectAll(".texts").style("opacity", "1");
    })

    // define properties for mouse moving over canvas
    .on("mousemove", function() {
      var mouse = d3.mouse(this);

      // find position for circles and text
      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
          var xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function(d) { return d.year; }).right;
              idx = bisect(d.values, xDate);

          // save data of where the mouse is
          var yValues = [data[0]["values"][idx]["y"].toFixed(2),
            data[1]["values"][idx]["y"].toFixed(2)];
          var xValue = years[idx];

          // set position of the circles
          d3.selectAll(".circles")
            .data(yValues)
            .attr("cx", x(xValue))
            .attr("cy", function(d, i) { return y(d); });

          // set position of text and add data value as text
          d3.selectAll(".texts")
            .data(yValues)
            .attr("x", function(d, i) { return x(xValue); })
            .attr("y", function(d, i) { return y(d); })
            .text(function(d) { return d; });
        });
    });
};

/**
* update the legend of the stacked graph
*/
function updateLegendGraph(legendText, legendColor) {

  d3.selectAll(".legend-graph").remove();

  var stackedGraph = d3.select("#stacked-graph");

  // add data to the legend element
  var legend = stackedGraph.selectAll(".legend-graph")
    .data(legendText)
    .enter().append("g")
      .attr("class", "legend-graph")
      .attr("transform", function(d, i) {
        return "translate(100," + (100 + i * 20) + ")";
      });

  // add boxes for the legend colors
  legend.append("rect")
      .attr("x", innerWidthStackedGraph - margin.right * 1.5 - 15)
      .attr("y", - 100)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i) { return legendColor[i]; })
      .style("stroke", "grey");

  // add text for the legend content
  legend.append("text")
      .attr("x", innerWidthStackedGraph - margin.right * 1.5)
      .attr("y", - 94)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
};
