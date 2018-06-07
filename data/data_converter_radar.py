# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# open CSV file to read data
with open("data2015.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    next(reader, None)

    # determine maximum of each variable
    maximum_recycled = 0
    maximum_renewable = 0
    maximum_co2 = 0
    for line in reader:
        if line[2] != ".":
            if line[1] == "Recycled waste":
                if float(line[2]) > maximum_recycled:
                    maximum_recycled = float(line[2])

            if line[1] == "Renewable energy":
                if float(line[2]) > maximum_renewable:
                    maximum_renewable = float(line[2])

            if line[1] == "CO2 emission":
                if float(line[2]) > maximum_co2:
                    maximum_co2 = float(line[2])

# read data and convert into dict
data = []
data.append([{"axis": "Recycled waste", "value": maximum_recycled/100},
             {"axis": "Renewable energy", "value": maximum_renewable/100},
             {"axis": "CO2 emission", "value": maximum_co2/100}])

# open CSV file to read data
with open("data2015.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    next(reader, None)

    i = 0
    nr_variables = 3
    for line in reader:

        # add country if it is first time this country is registered
        if i % nr_variables == 0:
            country = []

        if line[1] == "Recycled waste" and line[2] != ".":
            line_data = {}
            line_data["axis"] = line[1]
            line_data["value"] = float(line[2])/maximum_recycled
            country.append(line_data)

        if line[1] == "Renewable energy" and line[2] != ".":
            line_data = {}
            line_data["axis"] = line[1]
            line_data["value"] = float(line[2])/maximum_renewable
            country.append(line_data)

        if line[1] == "CO2 emission" and line[2] != ".":
            line_data = {}
            line_data["axis"] = line[1]
            line_data["value"] = float(line[2])/maximum_co2
            country.append(line_data)

        # append object if all variables are added
        if i % nr_variables == nr_variables - 1:
            data.append(country)

        i += 1

# write dict with data to json data file
with open("data_radar.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
