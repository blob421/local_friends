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
  User: User
  
};
type Media = {
  url: string;
};
type Comment = {
  content : string
  id: string
  User: User
  PostId: string
  UserId: string
}
type User = {
  picture: string
  username: string
}
export default function Home(){
const [posts, setPosts] = useState<Post[]>([])
const [createModal, setModal] = useState(false)
const [postDetailModal, setPostDetailModal] = useState(false)
const [comments, setComments] = useState<Comment[]>([])
const [activePost, setActivePost] = useState<Post | undefined>(undefined)


const url = process.env.NEXT_PUBLIC_API_URL
 useEffect(()=>{
  if (!activePost){
    return;
  }
        fetchAuth(`${url}/post/${activePost?.id}/comments`).then(res => res.json()).then(
          data => {setComments(data.comments); console.log(data)})
    }, [activePost])


 useEffect(()=>{
  const params = new URLSearchParams(window.location.search)
  const isPost = params.get('post')

    if (isPost){
  const postId = parseInt(isPost)
  setPostDetailModal(true)
  setActivePost(posts.find(obj=> obj.id === postId))
  
 }
    
    }, [posts])


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
 
<div className="row">
        
            <div className="feed_left d-none d-md-block col-md-2">
                    
            </div>


            <div className="feed_middle col-12 col-md-8" id='feed_middle'>
               
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
                          <div className='post_home_user'>
                            <img src={url + post.User.picture} className='post_user_home_img'/>
                            {post.User.username}
                            </div>
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
            <div className="feed_right col-md-2" id='feed_right'>
              
                
            </div>
            
          {createModal && <CreateModal url={url}/>}    
          {postDetailModal && (activePost && <PostDetailModal comments={comments} post={activePost}/>)}                 
        </div>









    )
}