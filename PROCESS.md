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
