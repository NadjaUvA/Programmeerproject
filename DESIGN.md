# Design Document

Nadja van 't Hoff (11030720)

## Data sources

The following data sources are used:
* [OECD](https://data.oecd.org/)
* [Eurostat](http://ec.europa.eu/eurostat/tgm/table.do;jsessionid=PbTQQGJAzezccxsmIuO9cUmiejxpzxCSTmmU_4YBiZirDebj2HrY!1989877910?tab=table&plugin=1&language=en&pcode=t2020_rt120)

For the stacked graph, the data on gas emission, waste and energy from 1990 to 2015 is saved in three separate CSV files. For the radar chart the data on recycled waste, CO2 emission and renewable energy per country for 2015 is saved in one CSV file. The files are read into Python and converted into two JSON files. These then are loaded into Javascript where the strings containing numbers need to be converted into the number type. For the map of Europe and the circles that function as a menu, the values can be obtained through the data for the stacked graph.

The data structure is as follows:
* Radar chart: [{country:"NLD", axes: [{axis:"waste", value:1}, {axis:"energy", value:2}, {axis:"emission", value:3}]}, {country: "FRA", axes: [{axis:"waste", value:1}, {axis:"energy", value:2}, {axis:"emission", value:3}}], ...]
* Stacked graph: [{country:"NLD", years:[1990, ..., 2015], waste: [{variable:"recycled", values:[1, ..., 100]}, {variable:"total", values:[1, ..., 100]}, energy: [{variable:"renewable", values:[1, ..., 100]}, {variable:"total", values:[1, ..., 100]}, ...} ...]

## Diagram

![Oopsie, something went wrong with the image](/doc/diagram.PNG "Overview of components of the visualization")

## Components

The **European map** contains the countries of the European Union. On hover, the country lights up and the country code is shown. On click, the radar chart updates to the values of the chosen country and the values in the circle menu are updated to that country. When clicked, the country stays in a different color from the rest, so the user can see which country he has clicked on. The following components are necessary to implement this map:
* D3
* jQuery
* topoJSON

The **circle menu** is a menu that contains the most up-to-date values on total energy production, green house gas emission per capita and recycled waste per capita of the country that is clicked on. When the user opens the webpage for the first time, the menu is empty. When a circle is clicked on, the stacked graph updates its values to give insight into that variable. The following components are necessary to implement this menu:
* D3
* tooltip
* liquidFillGauge

The **radar chart** shows the most up-to-date values on CO2 recycled waste, CO2 emission and renewable energy for the country that was clicked on in the map. It contains a dropdown menu which contains the country codes of all countries and when the checkbox is checked, the radar chart updates and shows the values of that country also in the radar chart, allowing for comparison. When a checked box is clicked on again, the chart updates and the values of the unchecked country disappear. The axes contain the maximum values of Europe. The following components are needed to implement this chart:
* D3
* Angular
* Dropdown menu

The **stacked graph** depicts the progress that the selected country has made during the last year concerning one of the variables. When the user opens the application for the first time, this graph isn't shown. When the user clicks on the map and as a second step on a circle with a variable, the graph appears with this variable for the chosen country. When the user clicks on the map *or* on another circle, the graps update. A slider allows the user to see the exact values for each year.  legend shows the user which part of the variable is represented by which color. The following components are needed to implement this chart:
* D3
* Colorbrewer
* Legend
* Slider

## APIs and D3 plugins

The following plugins will be used:

* jQuery plugin for European map
* D3 legends plugin for stacked graph

Other:
* Bootstrap

## Examples

The following pages are used as an example for the visualization:
* [European map](http://code.minnpost.com/simple-map-d3/)
* [Circle menu](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6)
* [Radar chart](https://gist.github.com/chrisrzhou/2421ac6541b68c1680f8)
* [Stacked graph](http://www.delimited.io/blog/2014/3/3/creating-multi-series-charts-in-d3-lines-bars-area-and-streamgraphs)
