import glob
import json
from path import path
all_data = {}
for i in glob.glob("used_data/*"):
    if i == "used_data/years.json":
        continue
    key = i[i.rfind("/")+1:i.rfind(".json")]
    with open(i) as f:
        contents = f.read()
        if(contents):
            jsobj = json.loads(contents)
            all_data[key] = jsobj
print(json.dumps(all_data))
