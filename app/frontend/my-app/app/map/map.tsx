'use client'
import { MapContainer, TileLayer, Polygon, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAuth } from "../components/fetch";
import { useEffect, useState } from "react";
import L from "leaflet";

const url = process.env.NEXT_PUBLIC_API_URL;

type BBox = [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
type Coords = [number, number][];

type coords = {
    latitude: number
    longitude: number
    animal: string
    id: number
}
type pins = coords[]

function FitBBox({ bbox }: { bbox: BBox }) {
  const map = useMap();
  const southWest: [number, number] = [bbox[1], bbox[0]]; // [lat, lon]
  const northEast: [number, number] = [bbox[3], bbox[2]];
  map.fitBounds([southWest, northEast],{
    padding: [2,2],
    maxZoom: 17
  }
  );
  return null;
}

export default function Map() {
  const [bbox, setBbox] = useState<BBox | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [pinCoords, setPinCoords] = useState<pins | undefined>(undefined)

  const animalIcon = new L.Icon({
  iconUrl: "/cat_icon.png",   // put your image in /public
  iconSize: [30, 30],    // size of the icon
  iconAnchor: [20, 40],  // point of the icon which corresponds to marker's location
  popupAnchor: [0, -40]  // where the popup opens relative to the icon
});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAuth(`${url}/map`, { method: "GET" });
        const data = await res.json();
        console.log(data.pins)
        const pin_lists = data.pins.filter(post => post.latitude).map(post=>{
         
           const dict = {latitude: post.latitude, longitude: post.longitude,
                         animal: post.guessed_animal, id: post.id}
           
           return dict
        
      })
        console.log(pin_lists)
        setPinCoords(pin_lists)
        setBbox(data.region.bbox);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  // derive coords whenever bbox changes
  useEffect(() => {
    if (bbox) {
      setCoords([
        [bbox[1], bbox[0]], // SW
        [bbox[3], bbox[0]], // NW
        [bbox[3], bbox[2]], // NE
        [bbox[1], bbox[2]], // SE
        [bbox[1], bbox[0]], // close polygon
      ]);
    }
  }, [bbox]);

  return (
    <MapContainer
      style={{ height: "85vh", width: "100%", margin:"2vh"}}
      center={[45.51, -73.57]}
      zoom={13}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {pinCoords && pinCoords.map(pin =>{
      return <Marker position={[pin.latitude, pin.longitude]} key={pin.id} icon={animalIcon}>
        <Popup>
          {pin.animal || "Not verified"}
        </Popup>
      </Marker>
      })}


      {coords && <Polygon positions={coords} color="blue" opacity={0.01} />}
      {bbox && <FitBBox bbox={bbox} />}
    </MapContainer>
  );
}
