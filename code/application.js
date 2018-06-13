/**
* an application with linked graphs that visualize the environmental progress of European countries
*
* Nadja van 't Hoff (11030720)
*/

var w = 400, h = 400;

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
     color: d3.scale.category10()
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
             .style("stroke", cfg.color(series))
             .attr("points",function(d) {
               var str="";
               for(var pti=0;pti<d.length;pti++){
                 str=str+d[pti][0]+","+d[pti][1]+" ";
               }
               return str;
              })
             .style("fill", function(j, i){return cfg.color(series)})
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
      .style("fill", cfg.color(series)).style("fill-opacity", .9)
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
    .await(make_figures);



  function make_figures(error, data2015, data_radar, data_map) {

		// return error if problem arrises
		if (error) {
			return alert(error);
		}

    // // make list of country codes
    var data_keys = Object.keys(data2015)
    countries = data_keys.slice(1, data_keys.length)

    // store maximum values from data
    var max_recycled = data2015["max"][0],
      max_renewable = data2015["max"][1],
      max_co2 = data2015["max"][2];


    // determine min and max of performance values
    var onlyValues = data_map.map(function(obj){ return obj[1]; });
    var minValue = Math.min.apply(null, onlyValues)
        maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    var paletteScale = d3.scale.linear()
          .domain([minValue, maxValue])
          .range(["#fff7fb", "#034e7b"]);

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

      fills: { defaultFill: "#ece7f2" },

      data: dataset,

      // set hover specifications
      geographyConfig: {
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'] || '#F5F5F5';
        },
        highlightBorderColor: "#000000"
      },

    });

    // draw first circle
    var config1 = liquidFillGaugeDefaultSettings();
    var gauge1 = loadLiquidFillGauge("fillgauge1", 0, max_recycled);

    // draw second circle
    var config2 = liquidFillGaugeDefaultSettings();
    config2.circleColor = "#fdbf6f";
    config2.waveColor = "#fdbf6f";
    config2.waveTextColor = "#ff7f00";
    var gauge2 = loadLiquidFillGauge("fillgauge2", 0, max_renewable, config2);

    // draw third circle
    var config3 = liquidFillGaugeDefaultSettings();
    config3.circleColor = "#cab2d6";
    config3.waveColor = "#cab2d6";
    config3.waveTextColor = "#6a3d9a";
    var gauge3 = loadLiquidFillGauge("fillgauge3", 0, max_co2, config3);

    var colorscale = d3.scale.category10();

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
      update_radar(selected_countries, selected_countries_old, data_radar)

    });

    var selected_country = 0, selected_country_old = 0;
    // update circle menu and radar chart when country is clicked
    map.svg.selectAll('.datamaps-subunit').on('click', function() {
      selected_country_old = selected_country;
      selected_country = d3.select(this)[0][0].classList[1];
      change_border_color(selected_country, selected_country_old);
      gauge1.update(data2015[selected_country][0]);
      gauge2.update(data2015[selected_country][1]);
      gauge3.update(data2015[selected_country][2]);
      start_radar(selected_country, data_radar, countries);
    });

    function change_border_color(selected_country, selected_country_old) {
      if (selected_country_old != 0) {
        var country_old = document.getElementsByClassName("datamaps-subunit " + selected_country_old)[0];
        country_old.style.stroke = "#000000";
      }
      var country = document.getElementsByClassName("datamaps-subunit " + selected_country)[0];
      country.style.stroke = "#000000";
    }

    // function change_border_color(selected_country, selected_country_old) {
    //   if (selected_country_old != 0) {
    //     var country_old = document.getElementsByClassName("datamaps-subunit " + selected_country_old)[0];
    //     country_old.style.stroke = "#ffffff";
    //   }
    //   var country = document.getElementsByClassName("datamaps-subunit " + selected_country)[0];
    //   console.log(country.style.stroke);
    //   country.style.stroke = "#000000";
    //   console.log(country.style.stroke);
    // }

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
    };

    /**
    * updates the radar chart based on selected countries
    */
    function update_radar(countries, countries_old, data) {

      // prepare needed data for radar chart
      var data_countries = [];
      for (i = 0, n = countries.length; i < n; i++) {
        data_countries.push(data[countries[i]]);
      };

      // draw chart if at least one country is selected
      if (data_countries.length > 0) {
        RadarChart.draw("#radar_chart", data_countries, mycfg);
      }

      // return error message when no country is selected
      else {
        alert("At least one country has to be selected for the radar chart!");
        document.getElementById("checkbox" + countries_old[0]).checked = true;
      }
    };

  };
};
