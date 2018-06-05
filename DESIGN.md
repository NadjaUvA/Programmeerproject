# Design Document

Nadja van 't Hoff (11030720)

## Data sources

The following data sources are used:
* [OECD](https://data.oecd.org/)
* [Eurostat](http://ec.europa.eu/eurostat/tgm/table.do;jsessionid=PbTQQGJAzezccxsmIuO9cUmiejxpzxCSTmmU_4YBiZirDebj2HrY!1989877910?tab=table&plugin=1&language=en&pcode=t2020_rt120)

For the stacked graph, the data on gas emission, waste and energy from 1990 to 2015 is saved in three separate CSV files. For the radar chart the data on recycled waste, CO2 emission and renewable energy per country for 2015 is saved in one CSV file. The files are read into Python and converted into two JSON files. These then are loaded into Javascript where the strings containing numbers need to be converted into the number type. For the map of Europe and the circles that function as a menu, the values can be obtained through the data for the stacked graph.

The data structure is as follows:
* Radar chart:
* Stacked graph:

## Diagram


## Components

The **European map** contains the countries of the European Union. On hover, the country lights up and the country code is shown. On click, the radar chart updates to the values of the chosen country and the values in the circle menu are updated to that country. When clicked, the country stays in a different color from the rest, so the user can see which country he has clicked on. The following components are necessary to implement this map:
* Tooltip

The **circle menu** is a menu that contains the most up-to-date values on total energy production, green house gas emission per capita and recycled waste per capita of the country that is clicked on. When the user opens the webpage for the first time, the menu is empty. When a circle is clicked on, the stacked graph updates its values to give insight into that variable. The following components are necessary to implement this menu:
* Tooltip

The **radar chart** shows the most up-to-date values on CO2 recycled waste, CO2 emission and renewable energy for the country that was clicked on in the map. It contains a dropdown menu which contains the country codes of all countries and when the checkbox is checked, the radar chart updates and shows the values of that country also in the radar chart, allowing for comparison. When a checked box is clicked on again, the chart updates and the values of the unchecked country disappear. The axes contain the maximum values of Europe. The following components are needed to implement this chart:

