"use client";
import {useState, useEffect } from 'react'
import {fetchAuth} from '../components/fetch'
import $ from 'jquery'
import dynamic from 'next/dynamic';

const CreateModal = dynamic(()=> import('./create_modal'))
const PostDetailModal = dynamic(()=> import('./post_detail_modal'))

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
const [createModal, setModal] = useState(false)
const [postDetailModal, setPostDetailModal] = useState(false)

const [activePost, setActivePost] = useState<Post | null>(null)

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


return (
<div className="flex_cont">
        
            <div className="feed_left">
                    
            </div>


            <div className="feed_middle" id='feed_middle'>
               
              <div className='row d-flex justify-content-center'>
                  
                  <div className='feed_top_bar_create col-md-10'>
                    <button className='new_post_btn' onClick={()=>{setModal(true);
                       $('#feed_modal_bg').show()}}>
                      New post <img src={'/pen.png'} className='new_post_icon'></img>
                    </button>
                     
                    
                  </div>

                  <div className='posts_cont col-md-10'>
                    
                  
                  {posts?.map(post => (
                      
                      <div className='row post_unit_feed' key={post.id} onClick={()=>{
                        setPostDetailModal(true);
                        $('#post_detail_bg').show();
                        setActivePost(post)
                       } }>
                        <div className='left_post_text col-md-8'>
                                    <div className='post_title'>{post.title}</div>
                                    <div className='post_content'>{post.content}</div>
                          </div>

                      <div className='images_cont_feed col-md-4'>
                        
                    {post.Media?.map((media, index) => (
                        <img className='feed_images'
                          key={index}
                          src={url + media.url.replace("\\", "/")} // fix Windows-style backslash
                          alt={`media for post ${post.id}`}
                        />
                      ))}
              </div>                   
      
                      </div>
                  )
                  )
                  }
                  </div>
              </div>

            </div>
            <div className="feed_right" id='feed_right'>
              
                
            </div>
            
          {createModal && <CreateModal url={url}/>}    
          {postDetailModal && (activePost && <PostDetailModal post={activePost}/>)}                 
        </div>









    )
}