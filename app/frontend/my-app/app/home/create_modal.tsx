'use client'
import $ from 'jquery'
import {useState, useEffect, FormEvent} from 'react'
import AsyncSelect from 'react-select/async'
import handle_debounce from '../utilities/debounce'

type ModalProps = {
    url?: string, handlePostEditCreate: (post:Post, edit:boolean) => void
    post?: Post
    onClose: () => void
    edit?: boolean
    dashboard?: string
}
type coords = {
    latitude: string
    longitude: string
}
import type {Comment, User, Post, Media} from "../types_feed"
import { fetchAuth } from '../utilities/fetch'


export default function CreateModal ({url, post, onClose, edit, dashboard, 
                                                                handlePostEditCreate}:ModalProps){

const [geoAble, setGeoAble] = useState(false)
const [coords , setCoords] = useState<coords | null >(null)
const [title, setTitle] = useState(post?.title ?? "");
const [content, setContent] = useState(post?.content ?? "");
const [files, setFiles] = useState<File[]>([])

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
            setCoords({latitude: String(latitude), longitude: String(longitude)})
              
            })
   }
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files) // convert FileList → File[]
        setFiles(files)
        }

   const SendPostEditCreate = (e:React.FormEvent) =>{
    e.preventDefault()
    const fetchUrl = !post ? `${url}/post` : `${url}/post/edit/${post._id}`
    
    const editedTitle = post?.title !== title ? title: post.title
    const editedContent = post?.content !== content ? content: post.content
    const editedLatitude = coords?.latitude ? parseFloat(coords?.latitude) : post?.latitude
    const editedLongitude = coords?.longitude ? parseFloat(coords?.longitude): post?.longitude
    let newPost:Post

    const formData = new FormData()

    formData.append("title", title)
    formData.append("content", content)
    if (coords){
    formData.append("latitude", coords.latitude)
    formData.append("longitude", coords.longitude)
    }

    files.forEach(file => {
    formData.append("images", file)
    })

    fetchAuth(fetchUrl, {method: 'POST', 
                         body: formData
                         }).then(res => res.json()).then(data => {
                         
                         
                         if (edit && editedLatitude && editedLongitude && post){
                             newPost = {...post, title: editedTitle, content: editedContent, 
                                                 latitude: editedLatitude, longitude: editedLongitude,
                                                 Media: data.Media}
                         }
                         else {
                             newPost = data.post

                         }
                        
                         handlePostEditCreate(newPost, edit? edit:false)
                         onClose()
            })

                     
   }
 return (
    

    <div id='feed_modal_bg'>
        
                
          
           <form className='feed_modal' onSubmit={SendPostEditCreate}>

                         <div className='title_modal_feed'>{post? "Edit post" : "New post"}</div>
                        <button className="x_btn_feed_modal" type="button"
                        onClick={()=> onClose()}>X</button>
                        <input type="text" placeholder="Title" name="title" value={title? title : ""}
                        onChange={(e) => setTitle(e.target.value)}

                        required maxLength={40}>
                        </input>
                        
                        <textarea placeholder="Content" required
                        className="textarea_post_feed" name="content" value={content? content: ""}
                        onChange={(e) => setContent(e.target.value)}>
                        </textarea>

                       {dashboard && <input type='hidden' name='dashboard' value={dashboard}></input>}
                        

                        <input type='file' name='images' multiple onChange={(e) => handleFileChange(e)}></input> 
                        {post? <div className='warn_text_edit_post'>Adding files will replace old files</div>: ""}

                        <div className='location_div_newpost'>
                            <button className={'location_btn_create_post'} type='button' onClick={()=> getLocation()}>
                                {edit? "Change location " : "Use location"}
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
                        
                        <button type="submit" className={
                              edit ? "post_create_btn_ready post_btn_feed_modal"
                                   :
                            coords ? "post_create_btn_ready post_btn_feed_modal"
                                   :"post_btn_feed_modal"} disabled={!edit && coords === null}>
                         Post
                        </button>
                   
           
              </form>
   
    </div>
 )
}