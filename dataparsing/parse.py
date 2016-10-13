from geopy.geocoders import Nominatim
import json
import sys

geolocator = Nominatim()

all_spottings = []

for line in open("../data/ufos.tsv"):
    split = line.split('\t')
    date2 = 0
    try:
        date2 = int(split[1])
    except:
        date2=0
    date = str(split[0]) if int(split[0]) > date2 else str(date2)
    all_spottings.append([date,split[2]])

out_file = "abcdefg"
of = False
all_spottings.sort(key=lambda x: x[0])
to_print = []

for spot in all_spottings[:1000]:
    if(spot[0][:4] == "0000"):
        continue
    try:
        location = geolocator.geocode(spot[1])
    except:
        continue
    if not (out_file == str(spot[0])[:6]):
        if of != False:
            to_print.sort(key=lambda x: x[0])
            of.write(json.dumps(to_print))
            to_print = []
            of.close()

        of = open("out/"+str(spot[0])[:6]+".json","w")
        out_file = str(spot[0])[:6]
        print("Opened "+ out_file)
    if location is not None:
        to_print.append([spot[0],spot[1],location.latitude,location.longitude])
    else:
        print("location was none for "+str(spot[1]))
