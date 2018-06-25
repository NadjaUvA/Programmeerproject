function drawCircles(maxRecycled, maxRenewable, maxCO2) {

  // draw first circle
  var config1 = liquidFillGaugeDefaultSettings();
  gauge1 = loadLiquidFillGauge("fillgauge1", 0, maxRecycled);

  // draw second circle
  var config2 = liquidFillGaugeDefaultSettings();
  gauge2 = loadLiquidFillGauge("fillgauge2", 0, maxRenewable);

  // draw third circle
  var config3 = liquidFillGaugeDefaultSettings();
  config3.circleColor = "#fdbf6f";
  config3.waveColor = "#fdbf6f";
  config3.waveTextColor = "#ff7f00";
  gauge3 = loadLiquidFillGauge("fillgauge3", 0, maxCO2, config3);
};
