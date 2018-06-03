# Programmeerproject
Nadja van 't Hoff (11030720)

## Problem statement
The European Union has formulated [20-20-20 targets](https://www.eea.europa.eu/themes/climate/trends-and-projections-in-europe/trends-and-projections-in-europe-2016/1-overall-progress-towards-the) to reduce greenhouse gas emission and to increase the use of renewable energy. Moreover, the European Union wants to reduce [waste](https://www.theguardian.com/environment/2018/jan/16/eu-declares-war-on-plastic-waste-2030) and recycle more. Though it is generally known that these goals need to reached, only few people are aware of the progress each country in Europe makes. Especially to politicians and environmental activists, an overview that combines information about these goals can be extremely valuable.

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
* Different colors in the map that shows the environmental performance for that country and a legend to explain the colors.
* Updating the radar chart to the year which is clicked on on the streamgraph.
* A possibility to compare the streamgraphs of countries through the dropdown menu used for the radar chart.

## Prerequisites

