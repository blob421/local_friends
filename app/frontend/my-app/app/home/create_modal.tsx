'use client'
import $ from 'jquery'
type ModalProps = {
    url?: string
}
export default function CreateModal ({url}:ModalProps){
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
                        <button type="submit" className="post_btn_feed_modal">
                         Post
                        </button>
                   
           
              </form>
   
    </div>
 )
}