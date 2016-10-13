from geopy.geocoders import Nominatim
import json
import sys

geolocator = Nominatim()

all_spottings = []

for line in open("../data/ufos.tsv"):
    split = line.split('\t')
    all_spottings.append([split[0],split[2]])

out_file = "0000"
of = None
all_spottings.sort(key=lambda x: x[0])
to_print = []

for spot in all_spottings:
    try:
        location = geolocator.geocode(spot[1])
    except:
        continue
    print(spot[0])
    if not (out_file == str(spot[0])[:4]):
        print("now setting file to: out/"+str(spot[0])[:4]+".json")
        if of:
            of.write(json.dumps(to_print))
            to_print = []
            of.close()
        of = open("out/"+str(spot[0])[:4]+".json","w")
        out_file = str(spot[0])[:4]
    else:
        print(out_file + " equals "+ str(spot[0])[:4])
    if location is not None:
        to_print.append([spot[0],spot[1],location.latitude,location.longitude])

to_print.sort(key=lambda x: x[0])
print(json.dumps(to_print))
