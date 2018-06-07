# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

# read data and convert into dict
data = []

# open CSV file to read data
with open("data2015.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    next(reader, None)
    i = 0
    nr_variables = 3
    for line in reader:

        # add country if it is first time this country is registered
        if i % nr_variables == 0:
            value = {}
            value["country"] = line[0]
            value[line[1]] = line[2]

        # add values for energy and emission
        else:
            value[line[1]] = line[2]

        # append object if all variables are added
        if i % nr_variables == nr_variables - 1:
            data.append(value)
        i += 1

# write dict with data to json data file
with open("data2015.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
