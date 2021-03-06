## 7th of june 2018
Today I started with a world map that I initialized yesterday with the help of [Datamaps](http://datamaps.github.io/):

![worldmap](/doc/log1.PNG)

I had some difficulties with getting a European map instead of just the world or USA. I used code from [Datamaps](http://datamaps.github.io/) and trial and error to zoom in on Europe:

![europe](/doc/log2.PNG)

Then, I made the radar chart using an [example](https://gist.github.com/nbremer/6506614):

![radar chart](/doc/log3.PNG)

Difficulties that I encounter are that my values are not given as percentages, so I transformed my data. The axes still need to be converted and the country codes need to be added to the data to allow for interactivity.

## 10th of june 2018
Today I worked on the circle menu and I changed the data for the circle menu and radar chart to *per capita* values, so that the countries can be compared. I still need to make a dictionary out of the values for the radar chart which will allow easy updates. I encountered while experimenting that the best way to do this is in Javascript. I still have to ask for help on the layout of my page. The circles need to be on the right of the map. The current layout is as follows:

![layout](/doc/log4.PNG)

## 11th of june 2018
Today, I implement the click function for the European map based on an example from [Stackoverflow](https://stackoverflow.com/questions/27215394/d3-datamaps-onclick-events-on-bubbles).

I linked the European map with the circle menu and checked that the data values are correctly updated. Furthermore, I improved the layout of the application and I made the circles have moving waves. In addition, the axes of the radar chart are now correctly scaled. I started experimenting with changing the colors of the map which wasn't very succesful until now. I will go on with this tomorrow as well as with the dropdown menu for the radar chart. Currently, my application looks as follows:

![update](/doc/log5.PNG)

## 12th of june 2018
Today, I worked a bit more on the layout of the page. Moreover, I added a dropdown menu for the radar chart and I added the units of the variables in the circle menu. The text however doesn't position where I want it to be. Furthermore I worked on the colors of the maps using an [example](https://github.com/markmarkoh/datamaps/blob/master/src/examples/highmaps_world.html). I linked the radar chart to the dropdown menu as well as the map. When a user unchecks all boxes, an alert pops up because at least one box has to be checked. Legends for the map and the radar chart are missing. Currently, my application looks as follows:

![update](/doc/log6.PNG)

## 13th of june 2018
Today, I added that the country that is clicked on gets a black border until the next country is clicked on. Furthermore, I updated the layout of the text next to the circles. I added a legend for the map using an [example](http://eyeseast.github.io/visible-data/2013/08/27/responsive-legends-with-d3/). I added a legend for the radar chart that updates when new countries are selected. However, the button to select the countries doesn't work anymore after it is used once. I will sort this problem out soon. Currently, my application looks as follows:

![update](/doc/log7.PNG)

## 14th of june 2018
Yoday, I corrected some faults in my script. I added an alert window in case more than 4 countries are selected for the radar chart. Furthermore, I changed the colors of the circle menu to show whether a variable influences the environment positively or negatively. On top of that I tested my website and all charts now interact perfectly. The only minor detail is the "Cancel" button that has no function in the alert window. I also updated the layout of my application. Currently, my application looks as follows:

![update](/doc/log8.PNG)

## 18th of june 2018
Today, I started with the stacked linegraph. I implemented the graph first with the energy data. I also fully implemented the interactivity with the map which is completely working now. I prepared the data for the other two variables next to energy: waste and emission. The click function on the circle menu works. However, the graph does not update the data of the two new variables. I will go on with this problem the next time. Currently, my application looks as follows:

![update](/doc/log9.PNG)

## 20th of june 2018
Today, I fixed the problem of the data of the new two variables. Furthermore, I started with the slider, but I figured that a tooltip would be ebtter suitedd for my application. To fullfill th requirements, I will implement a search bar instead. Currently, my application looks as follows:

![update](/doc/log10.PNG)

## 21th of june 2018
Today I added the interactive values on hover of the stacked graph using an [example](https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91) which I also used in the subject *Data Processing*. I also implemented the legend for this chart and updated the axes. I further implemented a search bar in the dropdown menu of the radar chart using an example from [W3Schools](https://www.w3schools.com/howto/howto_js_filter_dropdown.asp). The major remaining tasks are cleaning my coe, finding bugs and updating Github. Currently, my application looks as follows:

![update](/doc/log11.PNG)

## 25th of june 2018
Today, I started cleaning my code. I've been busy doing this all day, because my code really was a mess. I added files and merged files, I changed the variables to camelCase and I sorted functions and global variables. The legend for my stacked graph isn't working anymore and this is a problem I will solve tomorrow.

## 26th of june 2018
Today, I went on cleaning my code and I solved the problem of the legends.

## 27th of june 2018
Today, I finished cleaning my code. I implemented a button to reset the values to the European average. I also updated my git. Currently, my application looks as follows:

![update](/doc/log12.PNG)

## 28th of june 2018
Today, I updated all md files on my github page and made a few last changes. A challenge of today was to correctly organize everything. Currently, my application looks as follows:

![final update](/doc/application.PNG)
