from geopy.geocoders import Nominatim
import json

geolocator = Nominatim()

all_spottings = []

for line in open("../data/ufos.tsv"):
    split = line.split('\t')
    all_spottings.append([split[0],split[2]])

to_print = []

for spot in all_spottings:
    try:
        location = geolocator.geocode(spot[1])
    except:
        continue
    if location is not None:
        to_print.append([spot[0],location.latitude,location.longitude])

to_print.sort(key=lambda x: x[0])

print(json.dumps(to_print))
