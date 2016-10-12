from geopy.geocoders import Nominatim

geolocator = Nominatim()

all_spottings = []

for line in open("../data/ufos.tsv"):
    split = line.split('\t')
    all_spottings.append(split[1:3])

to_print = []

for spot in all_spottings:
    try:
        location = geolocator.geocode(spot[1])
    except:
        continue
    if location is not None:
        to_print.append([location.latitude,location.longitude])
    else:
        print(spot[1])

print(to_print)
