"use client";
import {useState, useEffect } from 'react'
import {fetchAuth} from '../components/fetch'
import $ from 'jquery'
type Post = {
  id: number;
  title: string;
  content: string;
  Media: Media[]
  
};
type Media = {
  url: string;
};

export default function Home(){
const [posts, setPosts] = useState<Post[]>([])

const url = process.env.NEXT_PUBLIC_API_URL
useEffect(()=>{

 const getResponse = async () => {
        const response = await fetchAuth(`${url}/home`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json()
        console.log(data.posts)
        setPosts(data.posts)
 } 
 getResponse();

}, [])


function expand(){
 const right_panel = $('[id="feed_right"]')
 const middle = $('[id="feed_middle"]')
 if (right_panel.hasClass('col-md-2')){
    right_panel.removeClass("col-md-2") 
    right_panel.addClass('col-0')
    right_panel.hide()

    middle.removeClass('col-md-8')
    middle.addClass('col-md-10')
 }else{
    right_panel.removeClass("col-0") 
    right_panel.addClass('col-md-2')
    right_panel.show()
    middle.removeClass('col-md-10')
    middle.addClass('col-md-8')
 }

}

return (
<div className="container-fluid">
        <div className="row">
            <div className="col-md-2 feed_left">
                    
            </div>


            <div className="col-md-8 feed_middle" id='feed_middle'>
                <button className='expand_post_create' onClick={expand}>
                    v
                </button>
                
                {posts?.map(post => (
                    
                    <div className='post_unit_feed' key={post.id}>
                    <div className='post_title'>{post.title}</div>
                    <div className='post_content'>{post.content}</div>
                    <div className='images_cont_feed'>
                       
                   {post.Media?.map((media, index) => (
      <img className='feed_images'
        key={index}
        src={url + "/" + media.url.replace("\\", "/")} // fix Windows-style backslash
        alt={`media for post ${post.id}`}
      />
    ))}
   </div>                   
     
                    </div>
                )
                )
                }
            </div>


            <div className="col-md-2 feed_right" id='feed_right'>
                
                    <form className="post_form" method="POST" action={`${url}/post`}
                    encType='multipart/form-data'>
                        <input type="text" placeholder="Title" name="title" 
                        required>
                        </input>
                        
                        <textarea placeholder="Content" required
                        className="textarea_post_feed" name="content">

                        </textarea>
                        <input type='file' name='images' multiple></input>
                        <button type="submit" className="post_btn_feed">
                         Post
                        </button>
                    </form>
            </div>                
        </div>
</div>
    )
}