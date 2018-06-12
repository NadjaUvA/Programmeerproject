## 7th of june 2018
Today I started with a world map that I initialized yesterday with the help of [Datamaps](http://datamaps.github.io/):

![worldmap](/doc/log1.PNG)

I had some difficulties with getting a European map instead of just the world or USA. I used code from [Datamaps](http://datamaps.github.io/) and trial and error to zoom in on Europe:

![europe](/doc/log2.PNG)

Then, I made the radar chart using an [example](https://gist.github.com/nbremer/6506614):

![radar chart](/doc/log3.PNG)

Difficulties that I encounter are that my values are not given as percentages, so I transformed my data. The axes still need to be converted and the country codes need to be added to the data to allow for interactivity.


## 10th of june 2018
Today I worked on the circle menu and I changed the data for the circle menu and radar chart to *per capita* values, so that the countries can be compared. I still need to make a dictionary out of the values for the radar chart which will aloow easy updates. I encountered while experimenting that the best way to do this is in Javascript. I still have to ask for help on the layout of my page. The circles need to be on the right of the map. The current layout is as follows:

![layout](/doc/log4.PNG)

## 11th of june 2018
Today, I implement the click function for the European map based on an example from [Stackoverflow](https://stackoverflow.com/questions/27215394/d3-datamaps-onclick-events-on-bubbles).

I linked the European map with the circle menu and checked that the data values are correctly updated. Furthermore, I improved the layout of the application and I made the circles have moving waves. In addition, the axes of the radar chart are now correctly scaled. I started experimenting with changing the colors of the map which wasn't very succesful until now. I will go on with this tomorrow as well as with the dropdown menu for the radar chart. Currently, my application looks as follows:

![update](/doc/log5.PNG)

## 12th of june 2018

Today, I worked a bit more on the layout of the page. Moreover, I added a dropdown menu for the radar chart and I added the units of the variables in the circle menu. The text however doesn't position where I want it to be. Furthermore I worked on the colors of the maps using an [example](https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html). I linked the radar chart to the dropdown menu as well as the map. When a user unchecks all boxes, an alert pops up because at least one box has to be checked. Legends for the map and the radar chart are missing. Currently, my application looks as follows:

![update](/doc/log6.PNG)
