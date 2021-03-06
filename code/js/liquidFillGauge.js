/*!
* @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
* Copyright (c) 2015, Curtis Bratton
* All rights reserved.
*
* Liquid Fill Gauge v1.1
*
* Some changes to the original file are made by Nadja van 't Hoff (11030720)
*/

/**
* specifies default style of the circles in the circle menu
*/
function liquidFillGaugeDefaultSettings() {
  return {
    minValue: 0,
    maxValue: 100,
    circleThickness: 0.15,
    circleFillGap: 0.05,
    circleColor: "#b2df8a",
    waveHeight: 0.1,
    waveCount: 1,
    waveRiseTime: 1000,
    waveAnimateTime: 2000,
    waveRise: true,
    waveHeightScaling: true,
    waveAnimate: true,
    waveColor: "#b2df8a",
    waveOffset: 0,
    textVertPosition: .5,
    textSize: 1,
    valueCountUp: true,
    displayPercent: false,
    textColor: "#000000",
    waveTextColor: "#33a02c"
  };
};

/**
* creates a circle element with waves and specified value
*/
function loadLiquidFillGauge(elementId, value, maximum, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    // initiate variables
    var gauge = d3.select("#" + elementId)
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
    var locationX = parseInt(gauge.style("width")) / 2 - radius;
    var locationY = parseInt(gauge.style("height")) / 2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

    // set height of the waves in circle
    var waveHeightScale;
    if(config.waveHeightScaling){
      waveHeightScale = d3.scale.linear()
        .range([0, config.waveHeight, 0])
        .domain([0, 50, 100]);
    }
    else {
      waveHeightScale = d3.scale.linear()
        .range([config.waveHeight,config.waveHeight])
        .domain([0, 100]);
    };

    // specify options of the circles
    var textPixels = (config.textSize * radius / 2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
    var waveLength = fillCircleRadius * 2 / config.waveCount;
    var waveClipCount = 1 + config.waveCount;
    var waveClipWidth = waveLength * waveClipCount;

    // round functions so that correct number of decimal places is displayed
    var textRounder = function(value) { return Math.round(value); };
    if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
        textRounder = function(value) { return parseFloat(value).toFixed(1); };
    }
    if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
        textRounder = function(value) { return parseFloat(value).toFixed(2); };
    }

    // set data for building the clip wave area
    var data = [];
    for (var i = 0; i <= 40 * waveClipCount; i++) {
        data.push({x: i / (40 * waveClipCount), y: (i / (40))});
    };

    // set scales for drawing the outer circle
    var gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
    var gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

    // set scales for controlling the size of the clipping path
    var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
    var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

    // set scales for controlling the position of the clipping path
    var waveRiseScale = d3.scale.linear()
      .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin-waveHeight)])
      .domain([0, 1]);
    var waveAnimateScale = d3.scale.linear()
      .range([0, waveClipWidth - fillCircleRadius * 2])
      .domain([0, 1]);

    // set scale for controlling the position of the text within the gauge
    var textRiseScaleY = d3.scale.linear()
      .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
      .domain([0, 1]);

    // center the gauge within the parent SVG
    var gaugeGroup = gauge.append("g")
      .attr("transform","translate(" + locationX + "," + locationY + ")");

    // draw the outer circle
    var gaugeCircleArc = d3.svg.arc()
      .startAngle(gaugeCircleX(0))
      .endAngle(gaugeCircleX(1))
      .outerRadius(gaugeCircleY(radius))
      .innerRadius(gaugeCircleY(radius - circleThickness));
    gaugeGroup.append("path")
      .attr("d", gaugeCircleArc)
      .style("fill", config.circleColor)
      .attr("transform","translate(" + radius + "," + radius + ")");

    // define text where the wave does not overlap
    var text1 = gaugeGroup.append("text")
      .text(textRounder(textStartValue) + percentText)
      .attr("class", "liquidFillGaugeText")
      .attr("text-anchor", "middle")
      .attr("font-size", textPixels + "px")
      .style("fill", config.textColor)
      .attr("transform","translate(" + radius + "," + textRiseScaleY(config.textVertPosition) + ")");

    // define the clipping wave area
    var clipArea = d3.svg.area()
      .x(function(d) { return waveScaleX(d.x); } )
      .y0(function(d) { return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1
        + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
      .y1(function(d) { return (fillCircleRadius * 2 + waveHeight); });
    var waveGroup = gaugeGroup.append("defs")
      .append("clipPath")
      .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
      .datum(data)
      .attr("d", clipArea)
      .attr("T", 0);

    // create the inner circle with the clipping wave attached
    var fillCircleGroup = gaugeGroup.append("g")
      .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
      .attr("cx", radius)
      .attr("cy", radius)
      .attr("r", fillCircleRadius)
      .style("fill", config.waveColor);

    // set text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
      .text(textRounder(textStartValue) + percentText)
      .attr("class", "liquidFillGaugeText")
      .attr("text-anchor", "middle")
      .attr("font-size", textPixels + "px")
      .style("fill", config.waveTextColor)
      .attr("transform","translate(" + radius + "," + textRiseScaleY(config.textVertPosition) + ")");

    // make the value count up.
    if (config.valueCountUp) {
      var textTween = function() {
        var i = d3.interpolate(this.textContent, textFinalValue);
        return function(t) { this.textContent = textRounder(i(t)) + percentText; }
      };
      text1.transition()
        .duration(config.waveRiseTime)
        .tween("text", textTween);
      text2.transition()
        .duration(config.waveRiseTime)
        .tween("text", textTween);
    };

    // make the wave rise
    var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
    if (config.waveRise) {
      waveGroup.attr("transform","translate(" + waveGroupXPosition + ","
        + waveRiseScale(0) + ")")
        .transition()
        .duration(config.waveRiseTime)
        .attr("transform", "translate(" + waveGroupXPosition + ","
          + waveRiseScale(fillPercent) + ")")
        .each("start", function(){ wave.attr("transform","translate(1,0)"); });
    }
    else {
      waveGroup.attr("transform","translate(" + waveGroupXPosition + ","
        + waveRiseScale(fillPercent) + ")");
    };
    if(config.waveAnimate) { animateWave(); };

    /**
    * adds the animation to the wave
    */
    function animateWave() {
        wave.attr("transform","translate(" + waveAnimateScale(wave.attr("T")) + ",0)");
        wave.transition()
          .duration(config.waveAnimateTime * (1 - wave.attr("T")))
          .ease("linear")
          .attr("transform","translate(" + waveAnimateScale(1) + ",0)")
          .attr("T", 1)
          .each("end", function() {
              wave.attr("T", 0);
              animateWave(config.waveAnimateTime);
          });
    };

    /**
    * updates the values and wave height of the circles
    */
    function GaugeUpdater() {

      // set the new value of the circle to correct format
      this.update = function(value) {
        var newFinalValue = parseFloat(value).toFixed(2);
        var textRounderUpdater = function(value){ return Math.round(value); };
        if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
          textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
        };
        if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
          textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
        };
        var textTween = function() {
          var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
          return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
        };

        // update text in circle
        text1.transition()
          .duration(config.waveRiseTime)
          .tween("text", textTween);
        text2.transition()
          .duration(config.waveRiseTime)
          .tween("text", textTween);

        // update the values of the wave for transition
        var fillPercent = Math.max(config.minValue, Math.min(config.maxValue,
          value / maximum * 100)) / config.maxValue;
        var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
        var waveRiseScale = d3.scale.linear()
          .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight),
            (fillCircleMargin - waveHeight)])
          .domain([0, 1]);
        var newHeight = waveRiseScale(fillPercent);
        var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
        var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);
        var newClipArea;
        if(config.waveHeightScaling){
          newClipArea = d3.svg.area()
            .x(function(d){ return waveScaleX(d.x); })
            .y0(function(d){ return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1
              + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI)); })
            .y1(function(d) { return (fillCircleRadius * 2 + waveHeight); });
        }
        else {
            newClipArea = clipArea;
        };

        // update the waves
        var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
        wave.transition()
          .duration(0)
          .transition()
          .duration(config.waveAnimate?(config.waveAnimateTime * (1
            - wave.attr("T"))):(config.waveRiseTime))
          .ease("linear")
          .attr("d", newClipArea)
          .attr("transform","translate(" + newWavePosition + ",0)")
          .attr("T","1")
          .each("end", function(){
            if (config.waveAnimate) {
                wave.attr("transform","translate(" + waveAnimateScale(0) + ",0)");
                animateWave(config.waveAnimateTime);
            };
          });
        waveGroup.transition()
          .duration(config.waveRiseTime)
          .attr("transform","translate(" + waveGroupXPosition + "," + newHeight + ")")
        };
    };

    return new GaugeUpdater();
};
