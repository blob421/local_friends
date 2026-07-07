'use client'

import "leaflet/dist/leaflet.css";
import { fetchAuth } from "../utilities/fetch";
import { useEffect, useRef, useState } from "react";
import L, { LatLng, LatLngBounds, LatLngTuple } from "leaflet";
import type {Post, Media, User, Region} from "../types_feed"


const url = process.env.NEXT_PUBLIC_API_URL;

type MapComponentProps = {
  setPost: (post:Post) => void
  setUser: (user:User) => void
  setCommentReload: (id:string) => void
  setPosts: (posts: Post[]) => void
  posts: Post[]
}

export default function Map({setPost, setUser, setCommentReload, setPosts, posts}: MapComponentProps) {
  const [bbox, setBbox] = useState<number[] | null>(null);

  const map = useRef<L.Map | undefined>(undefined)


///////////////////////// CACHE AND ICON /////////////////////////////

const iconCache: Record<string, L.Icon> = {};

const animalIcon = (name: string) => {
  if (!iconCache[name]) {
    iconCache[name] = L.icon({
      iconUrl: `/animal_icons/${name}_icon.png`,
      iconSize: [30, 30],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }
  return iconCache[name];
};
//////////////////////////////////////////////////////

 const fetchData = async () => {

      try {
        const res = await fetchAuth(`${url}/map`, { method: "GET" });
        const data = await res.json();
   
        setUser(data.user)
        const pin_lists = data.pins.filter((post:Post) => post.latitude).map((post:Post)=>{
   
           const dict = {latitude: post.latitude, longitude: post.longitude,
                         animal: post.guessed_animal, _id: post._id, id: post.id, 
                         guessed_animal: post.guessed_animal,
                        User: {id: post.User.id, username: post.User.username, picture:post.User.picture}, 
                        Media: post.Media, 
                        Region: post.Region,
                        content: post.content, title: post.title, Comments:post.Comments,
                        SubComments:post.SubComments}
           
           return dict
        
      })
    
        setPosts(pin_lists)
        setBbox(prev => data.region.bbox);
      } catch (err) {
        console.log(err);
      }
    };

const buildMap = () => {

    /// Remove from dom 
    if (map.current){
       map.current.remove()      
       map.current = undefined
    }

    /// Build map and tile layer
    map.current = L.map('map', {
            center: [45.51, -73.57],
            zoom:13})

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
        {attribution:"© OpenStreetMap contributors"}).addTo(map.current) 

     /////// Build pins 
    posts.map(p => {
        const pin = L.marker([p.latitude, p.longitude], {icon: animalIcon(p.guessed_animal,)})

        const pop_up = L.popup({closeButton: false, autoClose: false, closeOnClick: false,
                                content: p.guessed_animal
                               }
                              )

    pin.bindPopup(pop_up)
    if (map.current)
    pin.addTo(map.current)

    })

    //// Draw region polygon and zoom to fit boundaries 
    if (bbox){
          const sw = L.CRS.EPSG3857.unproject(L.point(bbox[0], bbox[1]));
          const ne = L.CRS.EPSG3857.unproject(L.point(bbox[2], bbox[3]));
          const bounds:LatLng[] = [sw, ne];
          const lats:[number, number][] = [
              [sw.lat, sw.lng],
              [ne.lat, sw.lng],
              [ne.lat, ne.lng],
              [sw.lat, ne.lng],
              [sw.lat, sw.lng],

            ];
          
          L.polygon(lats, {'color': 'blue', opacity: 0.01}).addTo(map.current)
          map.current.fitBounds(L.latLngBounds(bounds));



    }
  
}

///////////////////////////////////////////////////////////////////////
  useEffect(() => {
   

    fetchData();

  }, []);


/// Build the map as soon as bbox is available ///

 useEffect(()=> {

 if (!bbox) return;
   buildMap()
  
 }, [bbox])



//// Reset the mmap rendered state , required for dev as it renders 2 times ////

useEffect(()=>{
     if (!posts) return;
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

     buildMap()

  },[posts])



  return (
       <div id='map' style={{height: '100vh', width: '100vw'}}>
   
       </div>
  );
}
