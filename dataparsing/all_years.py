import json
years = []
with open("../data/ufos.tsv") as f:
    for line in f:
        split = line.split('\t')
        year = split[0][:8] if int(split[0][:8]) > int(split[1][:8]) else split[1][:8]
        if not year in years:
            years.append(year)

with open("years.json","w") as of:
    years.sort(key=lambda x: int(x))
    of.write(json.dumps(years))
