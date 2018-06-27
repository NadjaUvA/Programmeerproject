"""
Nadja van 't Hoff (11030720)
This code converts data of 2015 into JSON format and writes it to three files of
which one is used for the radar chart, one for the circle menu and one for the map.
"""

import json
import csv

# open CSV file to read data
with open("csvFiles/data2015.csv", "r") as File:
    reader = csv.reader(File, delimiter = ";")
    next(reader, None)

    # determine maximum of each variable
    maxRecycled = 0
    maxRenewable = 0
    maxCO2 = 0
    for line in reader:
        if line[2] != ".":
            if line[1] == "Recycled waste":
                if float(line[2]) > maxRecycled:
                    maxRecycled = float(line[2])

            if line[1] == "Renewable energy":
                if float(line[2]) > maxRenewable:
                    maxRenewable = float(line[2])

            if line[1] == "CO2 emission":
                if float(line[2]) > maxCO2:
                    maxCO2 = float(line[2])

# initiate data variables
dataCircles = {}
dataCircles["max"] = [maxRecycled, maxRenewable, maxCO2]
dataRadar = {}
dataMap = []

# open CSV file to read dataCircles
with open("csvFiles/data2015.csv", "r") as File:
    reader = csv.reader(File, delimiter = ";")
    next(reader, None)
    i = 0
    nrVariables = 3
    for line in reader:

        # add country if it is first time this country is registered
        if i % nrVariables == 0:
            value2015 = []
            value2015.append(line[2])
            countryRadar = []
            valueMap = 0

        # add values for energy and emission for circle menu
        else:
            value2015.append(line[2])

        if line[1] == "Recycled waste":

            # add data for radar chart and map
            lineData = {}
            lineData["axis"] = line[1]
            if line[2] != ".":
                lineData["value"] = float(line[2])/maxRecycled
                valueMap += float(line[2])/maxRecycled

            # punish if value not available
            else:
                lineData["value"] = 0
                valueMap = valueMap - 1
            countryRadar.append(lineData)

        if line[1] == "Renewable energy":

            # add data for radar chart and map
            lineData = {}
            lineData["axis"] = line[1]
            if line[2] != ".":
                lineData["value"] = float(line[2])/maxRenewable
                valueMap += float(line[2])/maxRenewable

            # punish if value not available
            else:
                lineData["value"] = 0
                valueMap = valueMap - 1
            countryRadar.append(lineData)

        if line[1] == "CO2 emission":

            # add data for radar chart
            lineData = {}
            lineData["axis"] = line[1]
            if line[2] != ".":
                lineData["value"] = float(line[2])/maxCO2
                valueMap = valueMap - float(line[2])/maxCO2

            # punish if value not available
            else:
                lineData["value"] = 1
                valueMap = valueMap - 1
            countryRadar.append(lineData)

        # append objects and list if all variables are added
        if i % nrVariables == nrVariables - 1:
            dataCircles[line[0]] = value2015
            dataRadar[line[0]] = countryRadar
            dataMap.append([line[0], valueMap])

        i += 1

# write data to json data files
with open("dataCircles.json", "w") as f:
    jsonString = json.dump(dataCircles, f, indent = 4)
with open("dataRadar.json", "w") as f:
    jsonString = json.dump(dataRadar, f, indent = 4)
with open("dataMap.json", "w") as f:
    jsonString = json.dump(dataMap, f, indent = 4)
