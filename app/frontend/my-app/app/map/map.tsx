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

type MapComponentProps = {
  setPost: (post:Post) => void
  setUser: (username:string) => void
  setCommentReload: (id:string) => void
}

import type {Post, Media, User, Region } from "../home/page.tsx"
export default function Map({setPost, setUser, setCommentReload}: MapComponentProps) {
  const [bbox, setBbox] = useState<BBox | null>(null);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [pinCoords, setPinCoords] = useState<pins | undefined>(undefined)
  const [posts, setPosts] = useState<Post[]>([])

///////////////////////// CACHE AND ICON /////////////////////////////

const iconCache: Record<string, L.Icon> = {};
const animalIcon = (name: string) => {
  if (!iconCache[name]) {
    iconCache[name] = new L.Icon({
      iconUrl: `/animal_icons/${name}_icon.png`,
      iconSize: [30, 30],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }
  return iconCache[name];
};

///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAuth(`${url}/map`, { method: "GET" });
        const data = await res.json();
    
        setUser(data.user)
        const pin_lists = data.pins.filter((post:Post) => post.latitude).map((post:Post)=>{
   
           const dict = {latitude: post.latitude, longitude: post.longitude,
                         animal: post.guessed_animal, id: post.id, guessed_animal: post.guessed_animal,
                        User: {id: post.User.id, username: post.User.username}, Media: post.Media, 
                          content: post.content, title: post.title}
           
           return dict
        
      })
    
        setPosts(pin_lists)
        setBbox(data.region.bbox);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(()=>{
     const params = new URLSearchParams(window.location.search)
     const postId = params.get('post')
     const comment= params.get('comment')

     if (postId){
      const activePost = posts.filter(post => post.id == parseInt(postId))
      
      setPost(activePost[0])
    if(comment){
         setCommentReload(comment)
      }
      
     }

  },[posts])

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
    <div className="container d-flex justify-content-center w-100 mt-3">
    <MapContainer
      style={{ height: "85vh", width: "100vw"}} className="map"
      center={[45.51, -73.57]}
      zoom={13}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      
      {posts.length > 0 && posts.map(pin =>{
      return <Marker position={[pin.latitude, pin.longitude]} key={pin.id} 
      icon={animalIcon(pin.guessed_animal)}  eventHandlers={{
      click: () => {
         
      
        setPost(pin); 
     
      },
      mouseover: (e) => {
        e.target.openPopup();  
      },
      mouseout: (e) => {
        e.target.closePopup();  
      }

    }}
  >

        <Popup closeButton={false} autoClose={false} closeOnClick={false}>
          {pin.guessed_animal || "Not verified"}
        </Popup>
      </Marker>
      })}


      {coords && <Polygon positions={coords} color="blue" opacity={0.01} />}
      {bbox && <FitBBox bbox={bbox} />}
    </MapContainer>
    </div>
  );
}
