'use client '
import {fetchAuth} from '../components/fetch'
import {useEffect, useState} from 'react'
import $ from 'jquery'
import enlarge from './enlarge'
import Carousel from './pic_carousel'
import dynamic from 'next/dynamic';

const CreateModal = dynamic(()=> import('./create_modal'))

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
  user: string
}
type Comment = {
  content : string
  id: string
  User: User
  PostId: string
  UserId: string
  SubComments : Comment[]
  children?: Comment[]
}
type User = {
  picture: string
  username: string
}

type Image = {
    url: string
}
export default function PostDetailModal({post, comments, onClose, user}:PostDetailModalProps){
    const url = process.env.NEXT_PUBLIC_API_URL
    const [images, setImages] = useState<Image[]>([])
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [parentComment, setParentComment] = useState("")
    const [replyInput, setReplyInput] = useState(false)
    const [parentSubcomment, setParentSubcomment] = useState("")
    const [SubcommentInput, setSubcommentInput] = useState(false)

    useEffect(() => {
  if (post.Media) {
    setImages(post.Media.map(img => ({ url: url + img.url })))
  }
}, [post, url])

    const set_visible = (id:string) => {
       const menu = $(`#${id}`)
       
       if (menu.hasClass('visible')){
        menu.removeClass('visible')
       
       }else{
        menu.addClass('visible')
        
       }
    }
    const getCommentSize = (id:string) =>{
       const parent = $(`#${id}`)
       if (parent.hasClass('large_width')){
        return 'medium_width'
       }
       else if (parent.hasClass('medium_width')){
        return 'small_width'
       }
       else if(parent.hasClass('small_width')){
        return ""
       }
       else{
        return 'large_width'
       }
    }
    const DelPost = async ()=>{
      const delUrl = `${url}/post/${post.id}`
      await fetchAuth(delUrl, {method: 'DELETE'}).then(res=> {if (res.status == 401){
        alert('Unauthorized action');
        window.location.href = '/home'
      }
       if(res.status == 202){
        window.location.href= '/home'
       }})
    }
    return(
        <div className='container h-100'>
          <div className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-center" id="post_detail_bg">
         
             <div className="post_detail_modal col-12 col-lg-7">

              {post.User.username == user && 
              <div className='menu_post_detail_cont'>
              <button id='three_dots_post_detail' onClick={()=>set_visible('option_menu_post_detail')}>...</button>

              <div id='option_menu_post_detail'>
                   <button className='option_post_detail' 
                   onClick={()=> set_visible('delete_post_detail_confirm')}>Delete post</button>
                   <button className='option_post_detail' onClick={()=> setEditModalVisible(true)}>
                    Edit post</button>
              </div>
              </div>}



              <button className="x_btn_feed_modal" onClick={onClose}>X</button>
                     <div className="title_post_detail">
                      {post.title}
                    </div>

                    <div className='container'>
                        <div className='row p-2' id='description_image_row'>
 
                            <div className="description_post_detail col-md-6">
                              <div className='post_detail_author'>
                                        {post.User.picture ? <img src={url + post.User.picture} className='img_post_detail_author'/>
                                         : <img src={'/avatar.png'} className='img_post_detail_author'/>}
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
                            <img className={'expand_icon_post_detail'} src={'/arrow_expand.png'} onClick={()=>{
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
                              return <div className='comment_subcomments_cont' key={c.id}>
                              
                              <div className='single_comment' id={`top_comment_${c.id}`} >
                                      <div className='user_comment_pic'>
                              {post.User.picture ? <img src={url + post.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                       {c.User.username}
                                      </div>
                                      <div className='comment_content_post_detail'>
                                        {c.content}
                                      </div>

                                      <div className={'reply_comment'} 
                                      onClick={()=> {setReplyInput(true); setParentComment(c.id)}}>Reply</div>


                                    
                                     </div>
                                      {/******Set size of the input for top comments*****/}
                                      { (replyInput && c.id == parentComment ) &&
                                          <div 
                                          
                                          className={'reply_input_cont single_comment' 
                                            + " " + getCommentSize(`top_comment_${c.id}`)
                                        } id={`input_${c.id}`}>    


                                        <form className="comment_form" method="POST" 
                                                 action={url + `/post/${post.id}/comment`}>
                                              <input type='text' name='comment' className='reply_input'/>
                                              <input type='hidden' name='parent' value={parentComment}/>
                                        </form>
                                          </div>

                                      }
                                    {/************************ SUBCOMMENT ***************************/}
                                      {c.SubComments && c.SubComments.map((sub, index)=>{

                                        return <div className='subcomments_subcomments_cont'>
                                        <div  className={'reply_input_cont single_comment' 
                                            + " " + getCommentSize(`top_comment_${c.id}`)
                                        }
                                        
                                        key={`subcomment_${sub.id}`} id={`subcomment_${sub.id}`}>

                                    <div className='user_comment_pic'>
                      {sub.User.picture ? <img src={url + sub.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                       {sub.User.username}
                                      </div>
                                      <div className='comment_content_post_detail'>
                                        {sub.content}
                                      </div>
                                         <div className={'reply_comment'} 
                                      onClick={()=> {setSubcommentInput(true); setParentSubcomment(sub.id)}}>Reply</div>

                                       


                                          </div>
                                          { (SubcommentInput && sub.id == parentSubcomment ) &&
                                          <div className={'reply_input_cont single_comment' + " " + 

                                            getCommentSize(`subcomment_${sub.id}`)
                                        }>     
                                              <form className="comment_form" method="POST" 
                                                      action={url + `/post/${post.id}/comment`}>
                                                    <input type='text' name='comment' className='reply_input'/>
                                                    <input type='hidden' name='parentSub' value={parentSubcomment}/>
                                              </form>
                                          </div>
                                           }
                                         {sub.children && sub.children.map((s, index)=>{
                                          return <div className={'single_comment' + " " + 
                                            getCommentSize(`subcomment_${sub.id}`)} key={`sub_sub_${sub.id}`}>
                                                                                   <div className='user_comment_pic'>
                              {s.User.picture ? <img src={url + s.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                       {s.User.username}
                                      </div>
                                      <div className='comment_content_post_detail'>
                                        {s.content}
                                      </div>
                                            </div>
                                         })}
                                     

                                          </div>      
                                      })}
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
       {editModalVisible && <CreateModal url={url} post={post} 
      onClose={()=> setEditModalVisible(false)}/>}
    </div>
    
       <div id='delete_post_detail_confirm'>
          Are you sure you want to delete this post ? 
         <button className='btn btn-danger' onClick={()=> DelPost()}>Delete</button>
      </div>

      
    </div>
    )
}