import json
years = []
with open("../data/ufos.tsv") as f:
    for line in f:
        split = line.split('\t')
        year = split[0][:6] if int(split[0][:6]) > int(split[1][:6]) else split[1][:6]
        if not year in years:
            years.append(year)

with open("years.json","w") as of:
    years.sort(key=lambda x: int(x))
    of.write(json.dumps(years))
