# Nadja van 't Hoff (11030720)
# This code converts data into JSON format and writes it to a file

import json
import csv

with open("energy.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    next(reader, None)

    country_codes = []
    country_code = 0

    for line in reader:
        if country_code != line[0]:
            country_codes.append(line[0])
            country_code = line[0]

# read data and convert into dict
data = {}

# open CSV file to read data
with open("energy.csv", "r") as File:
    reader = csv.reader(File, delimiter=";")
    next(reader, None)

    country_code = 0
    country_totals = []
    country_partials = []
    values_partial = []
    values_total = []
    for line in reader:

        if country_code != line[0]:
            country_totals.append(values_total)
            country_partials.append(values_partial)
            values_total = []
            values_partial = []
            country_code = line[0]

        values_line_total = {}
        values_line_partial = {}

        values_line_total["year"] = line[1]
        values_line_total["value"] = line[3]

        values_line_partial["year"] = line[1]
        values_line_partial["value"] = line[2]

        values_total.append(values_line_total)
        values_partial.append(values_line_partial)


for i in range(0, len(country_codes)):
    values_object_total = {}
    values_object_total["name"] = "energy_total"
    values_object_total["values"] = country_totals[i]
    values_object_partial = {}
    values_object_partial["name"] = "energy_renewable"
    values_object_partial["values"] = country_partials[i]
    # all_values = []
    # all_values.append(values_object_partial)
    # all_values.append(values_object_total)
    data[country_codes[i]] = [values_object_partial, values_object_total]


# write dict with data to json data file
with open("data_energy.json", "w") as f:
    jsonString = json.dump(data, f, indent = 4)
