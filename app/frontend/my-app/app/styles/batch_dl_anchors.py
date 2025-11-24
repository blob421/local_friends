import requests
from bs4 import BeautifulSoup
import os

url = "https://www.geoapify.com/data-share/localities/"
res = requests.get(url)
soup = BeautifulSoup(res.text, "html.parser")

# Collect all .zip links
zip_links = [a["href"] for a in soup.find_all("a", href=True) if a["href"].endswith(".zip")]

# Ensure absolute URLs
zip_links = [url + link for link in zip_links]

# Download each file
os.makedirs("downloads", exist_ok=True)
for link in zip_links:
    filename = os.path.join("downloads", link.split("/")[-1])
    print(f"Downloading {filename}...")
    r = requests.get(link)
    with open(filename, "wb") as f:
        f.write(r.content)
