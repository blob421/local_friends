import os
import zipfile
import psycopg2
import json
PGHOST='localhost'
PGPORT=5432
PGUSER='postgres'
PGDATABASE='js-backend'
PGPASSWORD="1246" 


path = "C:/Users/gabri/Desktop/Python/projects/local-friends/downloads/"
files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]

conn = psycopg2.connect(
    dbname=PGDATABASE,
    host=PGHOST,
    user=PGUSER,
    port=PGPORT,
    password=PGPASSWORD,
    connect_timeout=10,
    sslmode="prefer"
)
cursor = conn.cursor()

for file in files:
    with zipfile.ZipFile(os.path.join(path, file), 'r') as zf:
       for json_file in zf.namelist():
            with zf.open(json_file, 'r') as json_content:
                
                for line in json_content:
                    
               
                        
                        record = json.loads(line.decode('utf-8', errors="replace"))
                        values = (
                            int(record.get('osm_id')) if record.get("osm_id") else None ,
                            record.get('osm_type') if record.get("osm_type") else None,
                            record.get("display_name") if record.get("display_name") else None ,
                            record.get("name") if record.get("name") else None,
                            record.get("address", {}).get("county"),
                            record.get("address", {}).get("country"),
                            record.get("address", {}).get("country_code"),
                            record.get("address", {}).get("ISO3166-2-lvl4"),
                            record.get("address", {}).get("state") ,
                            record.get("type"),
                            [float(x) for x in record.get("bbox", [])] if record.get("bbox") else None,
                            [float(x) for x in record.get("location", [])] if record.get("location") else None,
                        )
                        cursor.executemany("""INSERT INTO "Regions" (osm_id, osm_type, name, 
                                           display_name, 
                        county , country, country_code, iso, state, kind, bbox, location) 
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        [values])
                        
                  

conn.commit()
cursor.close()
conn.close()