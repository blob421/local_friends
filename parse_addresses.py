import json
import csv
import glob
import os
## PARSING FILES FROM openaddresses.io
# Path to your folder of GeoJSON files

CUR_DIR = os.path.dirname(__file__)
REGIONS_DATA_FOLDER = os.path.join(CUR_DIR, 'regions_data')
input_files = glob.glob(rf"{REGIONS_DATA_FOLDER}/**/*.geojson", recursive=True)
output_file = os.path.join(REGIONS_DATA_FOLDER ,'addresses.csv')

# Define the CSV header
fields = ["street", "number", "unit", "city", "district", "region", "latitude", "longitude"]

with open(output_file, "w", newline="", encoding="utf-8") as csvfile:

    writer = csv.DictWriter(csvfile, fieldnames=fields)
    writer.writeheader()

    for file in input_files:
        try:
            with open(file, "r", encoding="utf-8") as f:
               
                for line in f:
                    data = json.loads(line)
                    if data.get('type') != 'Feature':
                        continue
                    if not line.strip():
                        continue
                    # Each file may contain multiple features
                    if not isinstance(data, dict):
                        print("Unexpected type:", type(data))
                        continue

                    props = data.get("properties", {})
                    coords = data.get("geometry", {})
                    if coords:
                        type = coords.get("type")
                        geo = coords.get("coordinates", [])
                  
                    lat = None
                    lon = None
                    if type == 'Point':
                        if isinstance(geo, (list, tuple)) and len(geo) >= 2:
                                lon, lat = geo[0], geo[1]
                    if type == 'Polugon':
                        if isinstance(geo, list) and len(geo) > 0 and len(geo[0]) > 0:

                            lon, lat = geo[0][0][0], geo[1][1][1]

                    row = {
                       
                        "street": props.get("street", ""),
                        "number": props.get("number", ""),
                        "unit": props.get("unit", ""),
                        "city": props.get("city", ""),
                        "district": props.get("district", ""),
                        "region": props.get("region", ""),
                        "latitude": lat,
                        "longitude": lon
                    }
                    writer.writerow(row)
        except Exception as e:
            print(file)
            print(e)
            break
           

print(f"Flattened {len(input_files)} files into {output_file}")