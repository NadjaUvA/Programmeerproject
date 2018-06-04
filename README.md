# Programmeerproject
Nadja van 't Hoff (11030720)

## Application goals
The goal of this application is to inform the user. The user can obtain information on the environmental betterment that a country has been through since 1990 and the environmental performance of that country relatively to Europe through interactive charts.

## Problem statement
The European Union has formulated [20-20-20 targets](https://www.eea.europa.eu/themes/climate/trends-and-projections-in-europe/trends-and-projections-in-europe-2016/1-overall-progress-towards-the) to reduce greenhouse gas emission and to increase the use of renewable energy. Moreover, the European Union wants to reduce [waste](https://www.theguardian.com/environment/2018/jan/16/eu-declares-war-on-plastic-waste-2030) and recycle more. Though it is generally known that these goals need to be reached, only few people are aware of the progress each country in Europe makes. Especially to politicians and environmental activists, an overview that combines information about these goals can be extremely valuable.

## Solution
This project offers an overview of the performance of an European Country on the environmental goals relatively to the other European Countries as well as its progress since 1990, which is often used as an index year. The product will consist of one screen that will approximately as follows:

![Example sketch of the visualization](/doc/sketch.PNG)

The following **main feautures** for users willl be available and form the *Minimum Viable Product*:
* Users can click on the map and subsequently the circles on the right will contain the most up-to-date values on the three environmental variables:
  * Energy
  * Gas emissions
  * Waste
* After clicking on a country, users can click on one of the circles to obtain more information about the environmental variable in that country:
  1. A streamgraph shows the development of that variable since 1990. It shows the total of that variable (total energy production, total gas emissions, total waste) as well as the part that needs to be increased or decreased according to the targets of the European Union (increase renewable energy production and recycled waste, decrease CO2 emissions). A slider allows the user to see the values for any year since 1990.
  1. A radar chart shows the performance of that country relatively to the average of the European performance. Through a dropdown menu, the most up-to-date values of that country can be compared to those of another selected country.
  
The following features are *nice-to-have*:
* Different colors in the map that show the environmental performance for that country and a legend to explain the colors.
* Updating the radar chart to the year that is clicked on on the streamgraph.
* A possibility to compare the streamgraphs of countries through the dropdown menu used for the radar chart.

## Prerequisites
**Data sources**:
* [Energy data](https://data.oecd.org/energy.htm#profile-Energy)
* [Waste data](https://data.oecd.org/waste/municipal-waste.htm) and [recycling data](http://ec.europa.eu/eurostat/tgm/table.do?tab=table&plugin=1&language=en&pcode=t2020_rt120)
* [Gas emission data](https://data.oecd.org/air/air-and-ghg-emissions.htm)

The data will be loaded into one JSON file which then will be loaded into Python.

**External components**:
* d3js.org/d3.v3.min.js
* liquidFillGauge.js

**Similar visiualization**:

A similar visualization from [Eurostat](http://ec.europa.eu/eurostat/tgm/graph.do?tab=graph&plugin=1&language=en&pcode=t2020_rt120&toolbox=type) compares the recycling rate of different European countries through a variety of charts. The user can define the chart he prefers and which countries he likes to compare. The charts are interactive: On hover, they return the exact values in the chart. They also have an interactive map with different shadings per country. A legend reveals the corresponding percentage range of recycling and on hover of the country, the exact percentage is shown.

**Hardest parts**:
* Making the radar chart and streamgraph appear when the user uses the application for the first time.
* Correct explanation of the use such that the user understands immediately how the platform works.
* The interactivity of the circle menu (step 2 in the visualization sketch).
* Loading different data files into one JSON file without using redundant code.

