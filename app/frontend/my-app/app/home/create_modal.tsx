'use client'
import $ from 'jquery'
import {useState, useEffect} from 'react'
import AsyncSelect from 'react-select/async'
import handle_debounce from '../components/debounce'

type ModalProps = {
    url?: string
    post?: Post
    onClose: () => void
}
type coords = {
    latitude: number
    longitude: number
}
type Post = {
    id: number;
    title:string, 
    content: string, 
    Media: Media[]
    User:User
}
type User = {
  picture: string
  username: string
}
type Media = {
  url: string;
};

export default function CreateModal ({url, post, onClose}:ModalProps){
const [geoAble, setGeoAble] = useState(false)
const [coords , setCoords] = useState<coords | null >(null)
const [title, setTitle] = useState(post?.title ?? "");
const [content, setContent] = useState(post?.content ?? "");
const loadOptions = handle_debounce(url + '/street_addresses', 'streets')
    useEffect(() => {
        if('geolocation' in navigator) {
            setGeoAble(true)
        }
    }, []);

   const getLocation = () => {
         

            navigator.geolocation.getCurrentPosition(({ coords }) => {
            
            console.log(coords)
            const { latitude, longitude } = coords;
            setCoords({latitude: latitude, longitude: longitude})
              
            })
   }
 return (
    

    <div id='feed_modal_bg'>
        
                
          
           <form className='feed_modal' method="POST" action={!post ? `${url}/post` : `${url}/post/edit/${post.id}`}
                    encType='multipart/form-data'>
                         <div className='title_modal_feed'>{post? "Edit post" : "New post"}</div>
                        <button className="x_btn_feed_modal" type="button"
                        onClick={()=> onClose()}>X</button>
                        <input type="text" placeholder="Title" name="title" value={title? title : ""}
                        onChange={(e) => setTitle(e.target.value)}

                        required>
                        </input>
                        
                        <textarea placeholder="Content" required
                        className="textarea_post_feed" name="content" value={content? content: ""}
                        onChange={(e) => setContent(e.target.value)}>
                        </textarea>
                        
                        <input type='file' name='images' multiple></input> 
                        {post? <div className='warn_text_edit_post'>Adding files will replace old files</div>: ""}

                        <div className='location_div_newpost'>
                            <button className={'location_btn_create_post'} type='button' onClick={()=> getLocation()}>
                                Use location
                                <img src={"/compass.png"} className='compass_icon_create_post'/>
                            </button> 
                             OR
                        </div>
                            <AsyncSelect cacheOptions loadOptions={loadOptions} 
                            onChange={(option:any)=> setCoords(option.coords)}
                            placeholder={'Search an address'} className='region_select'/>
                             
 
                       
                        
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