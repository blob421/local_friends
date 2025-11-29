'use client '
import {fetchAuth} from '../components/fetch'
import {useEffect, useState} from 'react'
import $ from 'jquery'
import enlarge from './enlarge'
import Carousel from './pic_carousel'
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
  onClose :() => void
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

type Image = {
    url: string
}
export default function PostDetailModal({post, comments, onClose}:PostDetailModalProps){
    const url = process.env.NEXT_PUBLIC_API_URL
    const [images, setImages] = useState<Image[]>([])
 
   
    useEffect(() => {
  if (post.Media) {
    setImages(post.Media.map(img => ({ url: url + img.url })))
  }
}, [post, url])


    return(
        <div className='container h-100'>
          <div className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-center" id="post_detail_bg">
         
             <div className="post_detail_modal col-12 col-lg-7">
              <button className="x_btn_feed_modal" onClick={onClose}>X</button>
                     <div className="title_post_detail">
                      {post.title}
                    </div>

                    <div className='container'>
                        <div className='row p-2' id='description_image_row'>
 
                            <div className="description_post_detail col-md-6">
                              <div className='post_detail_author'>
                                <img src={url + post.User.picture} className='img_post_detail_author'/>
                                {post.User.username}
                              </div>
                                {post.content}
                            </div>
                                <div className="post_detail_pictures_cont col-md-6">
                                 {images.length > 1 && <Carousel images={images}/>}
                                 
                                 {images.length == 1 && post.Media?.map(img=>{
                                  return <img src={url + img.url} className="image_post_detail" 
                                  onClick={()=> enlarge('0')} id='img_post_0' 
                                  key={post.id}></img>
                                })
                                }
                            </div>   
                        
                        </div>
                     </div>
                      <div className='comments_form_wrapper' id='comment_wrapper'>
                     <div className="comments_post_detail_cont">
                            <img src={'/arrow_expand.png'} onClick={()=>{
                             const row = $('#description_image_row')
                             const wrapper = $('#comment_wrapper')
                             if (row.hasClass('shrinked_row')){
                              row.removeClass('shrinked_row')
                              wrapper.removeClass('expanded_wrapper')
                             }else{
                             row.addClass('shrinked_row')
                             wrapper.addClass('expanded_wrapper')
                             }
                             
                            }}/>
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
                            
                                <textarea placeholder="Type here ..." 
                                className="comment_bar" 
                                name='comment'>
                                </textarea>
                                <button type='submit' className='submit_comment_post'>Go</button>
                              
                    </form>
             </div>
       </div>
    </div>
    
    </div>
    )
}