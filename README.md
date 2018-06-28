# Programmeerproject
## Comparing the environmental performance of European countries

Nadja van 't Hoff (11030720)

https://nadjauva.github.io/Programmeerproject/

My application is depicted below this description. ## Application goals
The goal of this application is to inform the user. The user can obtain information on the environmental betterment that a country has been through since 1990 and the environmental performance of that country relatively to Europe through interactive charts. I have four charts that give an insight into the environmental performance and development of the countries of the European Union: A map, a circle menu, a radar chart and a stacked graph.

![image of application](/doc/application.PNG =100x20)

And not to forget: A button to reset the values to the European average in 2015!

![image of reset button](/doc/resetButton.PNG)

To evaluate the countries, I established an index for each of the countries. For every variable, one point could be received. A country yields one full point if it performs best (or a value of zero in the case of the gas emission variable, since this ) on that variable compared to the other countries. So the index gives a relative score. If data was not available, then the country is punished with the minimal amount of points on this variable. When a country is clicked on, the radar chart is updted for this country.

![image of map](/doc/map.PNG)

The circle menu has more information on the year 2015 for the country selected in the map. A full circle indicates that a country performs best per capita (or worst per capita in case of the emission) on this variable. The development of the selected variable in the circle menu will be shown in for the selected country in the map in the stacked graph at the right bottom of the page.

![image of circle menu](/doc/circleMenu.PNG)

In the radar chart, the relative performance on the different variables can be compared for different countries. Again, the score relative to the best (or worst in case of emission) performing country is displayed. The dropdown menu allows to choose between different countries. No more than 4 countries can
be compared at the same time. When clicking on the map, the radar chart will be updated for that selected country.

![image of radar chart](/doc/radarChart.PNG)

The stacked graph shows the performance of a country on one of the three variables during the last years. It is activitated when a country and a variable have been clicked on in step 1 and step 2. The exact values are shown on hover.

![image of stacked graph](/doc/stackedGraph.PNG)

## Purpose


## Sources of external code

License of liquidFillGauge: license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/), Copyright (c) 2015, Curtis Bratton
