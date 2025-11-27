'use client '
import {fetchAuth} from '../components/fetch'
import {useEffect, useState} from 'react'
import $ from 'jquery'
type Post = {
    id: number;
    title:string, 
    content: string, 
    Media: Media[]
    User:User
}
type Media = {
  url: string;
};

type PostDetailModalProps = {
  post: Post
  comments: Comment[] 
}
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
export default function PostDetailModal({post, comments}:PostDetailModalProps){
    const url = process.env.NEXT_PUBLIC_API_URL
    

   
    return(
        <div id="post_detail_bg">
           
             <div className="post_detail_modal">
              <button className="x_btn_feed_modal" onClick={()=>{
                $('#post_detail_bg').hide()
              }}>X</button>
                     <div className="title_post_detail">
                      {post.title}
                    </div>

                    <div className='container'>
                        <div className='row p-2'>
                            <div className="description_post_detail col-md-5">
                              <div className='post_detail_author'>
                                <img src={url + post.User.picture} className='img_post_detail_author'/>
                                {post.User.username}
                              </div>
                                {post.content}
                            </div>
                            <div className="post_detail_pictures_cont col-md-7">
                                {post.Media?.map(img=>{
                                  return <img src={url + img.url} className="image_post_detail" 
                                  key={post.id}></img>
                                })
                                }
                            </div>    
                        </div>
                     </div>
                     
                     <div className="comments_post_detail_cont">
                            
                            {comments && comments.map(c=>{
                              return <div className='single_comment' key={c.id}>
                                      <div className='user_comment_pic'>
                                        
                                       <img src={url + c.User.picture} className='picture_comment'/>
                                       {c.User.username}
                                      </div>
                                      <div className='comment_content_post_detail'>
                                        {c.content}
                                      </div>
                                      
                              
                                     </div>
                            })}
                            {comments.length < 1 && <div
                            className='first_comment'> Be the first to make a comment</div>}
                   
                            
                    </div>
                    <form className="comment_form" method="POST" 
                            action={url + `/post/${post.id}/comment`}>
                            
                                <input type="text" placeholder="Type here ..." className="comment_bar" 
                                name='comment'>
                                </input>
                                <button type='submit' className='submit_comment_post'>Go</button>
                              
                            </form>
             </div>
        </div>
    )
}