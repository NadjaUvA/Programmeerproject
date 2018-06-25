"""
Nadja van 't Hoff (11030720)
This code converts data into JSON format and writes it to a file for the
stacked graph
"""

import json
import csv

def convertVariableData(file, nameJSON):
    " Function that converts data of a variable for the stacked graph "

    # read from specified datafile to get country codes
    with open(file, "r") as File:
        reader = csv.reader(File, delimiter = ";")
        next(reader, None)

        # initiate variables for country codes
        countryCodes = []
        countryCode = 0

        # add country codes for every country
        for line in reader:
            if countryCode != line[0]:
                countryCodes.append(line[0])
                countryCode = line[0]

    # read data and convert into dict
    data = {}

    # open CSV file to read data
    with open(file, "r") as File:
        reader = csv.reader(File, delimiter = ";")
        next(reader, None)

        # initiate variables
        countryCode = 0
        countryTotals = []
        countryPartials = []
        valuesPartial = []
        valuesTotal = []

        # read every line in the csv file
        for line in reader:

            # initiate variables if country code appears for first time
            if (countryCode != line[0] and countryCode != 0):
                countryTotals.append(valuesTotal)
                countryPartials.append(valuesPartial)
                valuesTotal = []
                valuesPartial = []
                countryCode = line[0]

            # initiate variables without appending for first country
            if countryCode == 0:
                valuesTotal = []
                valuesPartial = []
                countryCode = line[0]

            # initiate dicts for data
            valuesLineTotal = {}
            valuesLinePartial = {}

            # add data on total values of variable
            valuesLineTotal["year"] = line[1]
            valuesLineTotal["y"] = line[3]
            valuesLineTotal["y0"] = line[2]

            # add data on partial values of variable
            valuesLinePartial["year"] = line[1]
            valuesLinePartial["y"] = line[2]
            valuesLinePartial["y0"] = 0

            # add data to dict
            valuesTotal.append(valuesLineTotal)
            valuesPartial.append(valuesLinePartial)

    # add data in data structure needed for the stacked graph
    for i in range(0, len(countryTotals)):
        valuesObjectTotal = {}
        valuesObjectTotal["name"] = "total"
        valuesObjectTotal["values"] = countryTotals[i]
        valuesObjectPartial = {}
        valuesObjectPartial["name"] = "partial"
        valuesObjectPartial["values"] = countryPartials[i]
        data[countryCodes[i]] = [valuesObjectPartial, valuesObjectTotal]

    # write data to json data file
    with open(nameJSON, "w") as f:
        jsonString = json.dump(data, f, indent = 4)

# define files to convert and json names
dataFiles = ["waste.csv", "energy.csv", "emission.csv"]
namesJSON = ["dataWaste.json", "dataEnergy.json", "dataEmission.json"]

# convert data for every variable
for i in range(len(dataFiles)):
    convertVariableData(dataFiles[i], namesJSON[i])
