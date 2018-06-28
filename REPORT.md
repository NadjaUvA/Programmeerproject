# Programmeerproject
## Comparing the environmental performance of European countries

Nadja van 't Hoff (11030720)

## The application
My application is depicted below. Four charts allow for an insight into the performance on three different environmental variables (waste, energy and emission) of the countries in the EU:

* **Map**: The colors give an indication on the environmental friendliness based on a self-created index. The map is linked to the radar chart and the stacked graph.
* **Circle menu**: The heigth of the waves give an indication of the relative performance of the selected country on the variable belonging to that circle. The circles are linked to the stacked graph.
* **Radar chart**: The radar chart allows for relative comparison of the selected countries: The axes show the performance compared to the maximum value of the variable. The radar chart is linked to the map.
* **Stacked graph**: The layers of the graph show the composition of one of the variables waste, energy and emission. Exact values are shown on hover. The legend and y-axis update according to the selected country from the map and the circle menu. The stacked graph is linked to the map and the circle menu.

![image of application](/doc/application.PNG)

## The technical design

The following image gives an overview of the technical design of my code:

![image of technical design](/doc/diagramFinal.PNG)

Unlike I expected in my first technical design, I have multiple javascript files (I didn't use separate code files in *Data Processing*). I have the following files:
* **main file**: The global variables are set and the data is loaded and prepared. Furthermore, the initialization of the charts is called from this file and all links are created.
* **map file**: The map is specified and a function is created that updates the border color of a selected country to black and of the previous selected country to white.
* **stacked graph file**: Four functions are specified in this file. One to start the graph, one to update the graph according to the selected country and variable (these are both global variables that are kept track of), one to add the interactive view of values on hover and a legend function.
* **circle menu**: The function in this file is called once from the main file to draw the circles. These are initiated with the values of the European average
* **liquidFillGauge file**: This file specifies the settings of the circles and an update function which makes updating these circles very easy.
* **Radar chart file**: This file contains a variable that defines the radar chart, a function to start the cahrt, an update function, a function that displays the correct alert when more than four countries are selected in the dropdown menu and a function to draw the legend. The radar chart updates when a checkbox is checked in the dropdown menu.
* **filter file**: This file contains a filter that matches the search terms from the search bar in the dropdown menu to the possible input fields of the checkboxes.

## The challenges

On my way to the final application, I encountered several challenges, leading to different design choices:

* In week 1, the data formed a challenge. I couldn't find data on the goals on waste, energy and emission which is why I did not show the performance of the countries relative to the goals that were set, but I showed the performance relative to the maximum value, meaning that the countries are now compared to each other instead of to the goals.
* In week 2, I noticed that I forgot to add legends to the charts in my original design. Since legends really are impeccable, I decided to change my original design.
* In week 3, when I started working on the slider, I noticed that it really didn't make any sense, because an interactivity of the stacked graph on hover also would be enough. Or otherwise stated: The slider wasn't really connected to any data or update of a graph. So I decided not to implement the slider, but instead I added an interactivity of the values on hover.
* In week 4, I had to replace the slider for another interactivity, since I wouldn't meet the requirements of the project otherwise. I found that it would be of added value to add a reset button. This button resets the circle menu and radar chart to the European average values. This adds another measure of relative performance.
* Not a challenge, but certainly a design choice: A lot of people implemented several tabs on their page with Bootstrap navbar. However, I wanted my application to be like one whole application. I didn't think that there was enough information and that it made sense not to implement such a bar.
* Finally, I really made a mess out of my code on the way to my final product and I had to spend 1,5 day on cleaning it in week 4. I really learned a lesson from this: Next time, sort the code and add comments right from the beginning!

## The design decisions

I am glad that I implemented a reset button instead of a slider, because this gives much more information. The added legends are logically valuable, too. First, I was a disappointed that I couldn't find the right data on the goals. However, this really enables the user to compare countries to each other and gives an insight into the performance from a different angle. In a perfect world with more time, I would not change my current solution. Instead, I would add a button that allows a user to switch the relative view: From the performance relative to the maximum values (as it is implemented now) to the performance relative to the goals (as it was meant to be implemented). This way, the user would get the best of both worlds.
