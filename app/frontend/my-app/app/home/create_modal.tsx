'use client'
import $ from 'jquery'
import {useState, useEffect} from 'react'
import AsyncSelect from 'react-select/async'
import handle_debounce from '../components/debounce'

type ModalProps = {
    url?: string
}
type coords = {
    latitude: Number
    longitude: Number
}
export default function CreateModal ({url}:ModalProps){
const [geoAble, setGeoAble] = useState(false)
const [coords , setCoords] = useState<coords | null >(null)
const loadOptions = handle_debounce(url + '/street_addresses', 'streets')
    useEffect(() => {
        if('geolocation' in navigator) {
            setGeoAble(true)
        }
    }, []);

   const getLocation = () => {
         
            navigator.geolocation.getCurrentPosition(({ coords }) => {
            setCoords(coords)
            const { latitude, longitude } = coords;
               
              
            })
   }
 return (
    

    <div id='feed_modal_bg'>
        
                
          
           <form className='feed_modal' method="POST" action={`${url}/post`}
                    encType='multipart/form-data'>
                         <div className='title_modal_feed'>New post</div>
                        <button className="x_btn_feed_modal" type="button"
                        onClick={()=> $('#feed_modal_bg').hide()}>X</button>
                        <input type="text" placeholder="Title" name="title" 
                        required>
                        </input>
                        
                        <textarea placeholder="Content" required
                        className="textarea_post_feed" name="content">
                        </textarea>
                        
                        <input type='file' name='images' multiple></input>

                        <div className='location_div_newpost'>
                            <button type='button' onClick={()=> getLocation()}>
                                Use current location
                            </button> or

                            <AsyncSelect cacheOptions loadOptions={loadOptions} 
                            onChange={(option:any)=> setCoords(option.coords)}
                            placeholder={'Search an address'} className='region_select'/>
                        </div>
                        
                        <input type='hidden' name='latitude' 
                        value={coords?.latitude ? String(coords.latitude) : ""}/>
                        <input type='hidden' name='longitude' 
                        value={coords?.longitude ? String(coords.longitude) : ""}/>
                        
                        <button type="submit" className="post_btn_feed_modal" disabled={coords === null}>
                         Post
                        </button>
                   
           
              </form>
   
    </div>
 )
}