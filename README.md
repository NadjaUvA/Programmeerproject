# Programmeerproject

## Comparing the environmental performance of the countries in the EU

Nadja van 't Hoff (11030720)

https://nadjauva.github.io/Programmeerproject/

[Product demo video](https://www.youtube.com/watch?v=jAWLNrtln_o&feature=youtu.be) (Unfortunately, alerts cannot be seen in the video)

## The description

My application is depicted below. I have four charts that give an insight into the performance on three environmental variables (waste and recycling, energy production and greenhouse gas emission) and development of the countries of the European Union: A map, a circle menu, a radar chart and a stacked graph.

![image of application](/doc/application.PNG)

By clicking the button on top of the charts, the user is able to reset the values of the circle menu and the radar chart to the European average values in 2015. The stacked graph will be removed from the page.

![image of reset button](/doc/resetButton.PNG)

To evaluate the countries, I established an index for each of the countries. For every variable, one point could be obtained. A country yields one full point if it performs best (or a value of zero in the case of the gas emission variable, since this is something you want to reduce) on that variable compared to the other countries. So the index gives a relative score, where 0 is the lowest possible score to achieve and 3 the highest possible score. If data on a variable was not available, then the country with the missing data is punished with the minimal amount of points on this variable. When a country is clicked on, the radar chart is updated for this country.

![image of map](/doc/map.PNG)

The circle menu presents more information on the year 2015 for the country selected in the map. From the black border, it can be seen what country is selected. A full circle indicates that this country relatively performs best per capita (or worst per capita in case of the emission) on this variable. The development of the selected variable in the circle menu will be shown in the stacked graph at the right bottom of the page for the country that was selected in the map.

![image of circle menu](/doc/circleMenu.PNG)

In the radar chart, the relative performance on the different variables can be compared for different countries. Again, the score relative to the best (or worst in case of emission) performing country is displayed. The dropdown menu allows to choose between different countries. It also has a search bar option where countries can be searched for. No more than 4 countries can
be compared at the same time. If the user clicks on more than 4 countries, an alert pops up asking which country needs to be removed from the radar chart. An alert will also appear if the user tries to unclick all checkboxes of the dropdown menu once the radar chart is activated. When clicking on a country in the map, the radar chart will be updated for that selected country and all earlier selections in the dropdown menu will be erased.

![image of radar chart](/doc/radarChart.PNG)

The stacked graph shows the performance of a country on one of the three variables during the last years. It is activitated when a country and a variable have been clicked on in step 1 and step 2 (the order of selecting a country or variable does not matter). The exact values are shown on hover. The legend depicts which variable and country are selected and the y axis updates when another variable is clicked to show the correct scale.

![image of stacked graph](/doc/stackedGraph.PNG)

## The purpose of the application

The goal of this application is to inform the user on the relative environmental performance of the countries of the European Union. The user can obtain information on the environmental betterment that a country has been through since 1990 and the environmental performance of that country in 2015 relatively to other European countries through the interactive charts.

The European Union has formulated [20-20-20 targets](https://www.eea.europa.eu/themes/climate/trends-and-projections-in-europe/trends-and-projections-in-europe-2016/1-overall-progress-towards-the) to reduce greenhouse gas emission and to increase the use of renewable energy. Moreover, the European Union wants to reduce [waste](https://www.theguardian.com/environment/2018/jan/16/eu-declares-war-on-plastic-waste-2030) and recycle more. Though it is generally known that these goals need to be reached, only few people are aware of the progress each country in Europe makes. Especially to politicians and environmental activists, an overview that combines information on the environmental performance of the countries in the European Union can be extremely valuable. Since it is suspected that the set goals won't be met and that finally, the relative performance of a country will be more important as opposed to actually meeting the goal, this project offers an overview of the performance of a European country on the environmental performance relatively to the other European Countries as well as its progress since 1990, which is often used as an index year.

## Sources of external code

Map:
* http://datamaps.github.io/
* https://stackoverflow.com/questions/27215394/d3-datamaps-onclick-events-on-bubbles
* http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/

Circle menu:
* [liquidFillGauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6) of (c) Curtis Bratton (2015)

Radar chart:
* https://gist.github.com/nbremer/6506614
* https://www.w3schools.com/howto/howto_js_filter_dropdown.asp

Stacked graph:
* https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

Images:
* [warning image](http://scream-queens.wikia.com/wiki/File:Spoiler_alert.png)
* [thumbs up image](http://www.emoji.co.uk/view/7284/)

## Copyright notice

When code is copied from this repository, it is required to preserve the copyright and license notices. I, Nadja van 't Hoff, provide an express grant of patent rights. The code may be distributed under different terms and without source code.

Limitations of the copyright are the trademark use, liability and warranty.
