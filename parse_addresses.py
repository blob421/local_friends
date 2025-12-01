import json
import csv
import glob

# Path to your folder of GeoJSON files
input_files = glob.glob(r"C:\Users\gabri\Desktop\Python\local_friends\addresses\**\*.geojson", recursive=True)
output_file = r"C:\Users\gabri\Desktop\Python\local_friends\addresses\addresses.csv"

# Define the CSV header
fields = ["number", "street", "unit", "city", "district", "region", "latitude", "longitude"]

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
                        "number": props.get("number", ""),
                        "street": props.get("street", ""),
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