'use client '
import {fetchAuth} from '../components/fetch'
import {useEffect, useState, useRef} from 'react'
import $ from 'jquery'
import enlarge from './enlarge'
import Carousel from './pic_carousel'
import dynamic from 'next/dynamic';
import EmojiPicker from 'emoji-picker-react';
import { encodeUrlSafe } from '../components/encode';
const CreateModal = dynamic(()=> import('./create_modal'))


import type {Comment, User, Post, Media} from "./page"
type PostDetailModalProps = {
  post: Post
  comments: Comment[] 
  onClose :() => void
  user: string
  feed: string
}

type Image = {
    url: string
}


export default function PostDetailModal({post, comments, onClose, user, feed}:PostDetailModalProps){
    const url = process.env.NEXT_PUBLIC_API_URL
    const [images, setImages] = useState<Image[]>([])
    const [editModalVisible, setEditModalVisible] = useState(false)

    const [parentComment, setParentComment] = useState("")
    const [replyInput, setReplyInput] = useState(false)
    const [parentSubcomment, setParentSubcomment] = useState("")
    const [SubcommentInput, setSubcommentInput] = useState(false)

    const [emoteModal, setEmoteModal] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState("")
    
    const textRef = useRef<HTMLDivElement>(null);
    const [overflowingIds, setOverflowingIds] = useState<string[]>([]);

const removeOverflowingId = (id: string) => {
  setOverflowingIds(prev => prev.filter(existingId => existingId !== id));
};

const ExpandText = (id:String)=>{
  const div = $(`#${id}`)
  div.removeClass('truncated-text')
}
useEffect(() => {
  const newOverflowing: string[] = [];
  const allComments = document.querySelectorAll<HTMLDivElement>(
    ".comment_content_post_detail"
  );

  allComments.forEach(el => {
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * 2; // 2 lines
    if (el.scrollHeight > maxHeight) {
      newOverflowing.push(el.id); // use the div's own id
    }
  });

  setOverflowingIds(newOverflowing);
  console.log(newOverflowing)
}, [comments]);


const InsertEmoji = () =>{
  const input = document.getElementById('sub_input') as HTMLInputElement | null;

  const sub_input = document.getElementById('c_input') as HTMLInputElement | null;

  if (input){
      input.value += selectedEmoji
  }
  else if(sub_input){
     sub_input.value += selectedEmoji
  }
  
}
  const checkTruncatedText = () => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(textRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2; // 2 lines
      return textRef.current.scrollHeight > maxHeight
    }
  }


useEffect(()=>{
   InsertEmoji()
}, [selectedEmoji])
useEffect(() => {
  if (post.Media) {
    setImages(post.Media.map(img => ({ url: url + img.url })))
  }

   
  document.addEventListener('click', (e)=>{
  const target = e.target as HTMLElement;
  if (!target.closest('.single_comment') && !target.closest('.EmojiPickerReact')){
  setReplyInput(false)
  setEmoteModal(false)
  setSubcommentInput(false)
  }
  else if (!target.closest('.EmojiPickerReact') && !target.closest('.smile_emote_comment')){

  setEmoteModal(false)
  
  }
  const comment_inputs = document.querySelectorAll('[id^="input"]')
  const subcomment_inputs = document.querySelectorAll('[id^="input_sub_"]')

  })
  
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
                        {emoteModal && <EmojiPicker width={190} height={300} 
                                              style={{ zIndex: 1000000, position: 'absolute', right: -18, transform: 'scale(0.8'}} 
                                              onEmojiClick={(emojiData)=>{setSelectedEmoji(emojiData.emoji);
                                                setEmoteModal(false); 
                                              }} searchDisabled={true} skinTonesDisabled={true}
                                              previewConfig={{ showPreview: false }}/>}

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
                              const encoded = encodeUrlSafe(String(c.User.id));
                              return <div className='comment_subcomments_cont' key={c.id}>
                              
                              <div className='single_comment' id={`top_comment_${c.id}`} >
                                <div className='left_side_comment'>
                                <div className='user_comment_pic'>
                              {post.User.picture ? <img src={url + post.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                        <a href={`/profile?id=${encoded}`} 
                                          className='anchor_user_home'>{c.User.username}</a>
                                      </div>
                                      <div className='comment_content_post_detail truncated-text' id={`comment_${c.id}`}>
                                        {c.content } 

                                      </div>


                                      <div className={'reply_comment'} 
                                      onClick={()=> {setSubcommentInput(false);setReplyInput(true); 
                                      setParentComment(c.id)}}>Reply</div>


                                    </div>
                                                                            {overflowingIds.includes(`comment_${c.id}`) && (
                                        <button onClick={()=>{ExpandText(`comment_${c.id}`);
                                      removeOverflowingId(`comment_${c.id}`)}} className='see_more'>
                                        See more</button>
                                            )}
                                     </div>
                                      {/******Set size of the input for top comments*****/}
                                      { ((!SubcommentInput && replyInput) && c.id == parentComment ) &&
                                          <div 
                                          
                                          className={'reply_input_cont single_comment' 
                                            + " " + getCommentSize(`top_comment_${c.id}`)
                                        } id={`input_${c.id}`}>    

                                     
                                        <form className="comment_form" method="POST" 
                                                 action={url + `/post/${post.id}/comment/feed/${feed}`}>
                                              <input type='text' name='comment' className='reply_input'
                                              placeholder='Write here ...' id='c_input'/>
                                              <input type='hidden' name='parent' value={parentComment}/>
                                              <img src={'/smile_icon.png'} className='smile_emote_comment'
                                              onClick={()=>{!emoteModal ? setEmoteModal(true): setEmoteModal(false)}}/>
                                            
                                        </form>
                                          </div>

                                      }
                                    {/************************ SUBCOMMENT ***************************/}
                                      {c.SubComments && c.SubComments.map((sub, index)=>{
                                        const encoded = encodeUrlSafe(String(sub.User.id));

                                        return <div className='subcomments_subcomments_cont' key={`subcomment_${sub.id}`}>
                                        <div  className={'reply_input_cont single_comment' 
                                            + " " + getCommentSize(`top_comment_${c.id}`)
                                        }
                                        
                                        id={`subcomment_${sub.id}`}>
                                    <div className='left_side_comment'>

                                    <div className='user_comment_pic'>
                      {sub.User.picture ? <img src={url + sub.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                        <a href={`/profile?id=${encoded}`} 
                                          className='anchor_user_home'>{sub.User.username}</a>
                                      </div>
                                      <div className='comment_content_post_detail' id={`subcomment_${c.id}`}>
                                        {sub.content}
                                      
                                      </div>


                                         <div className={'reply_comment'} 
                                      onClick={()=> {setReplyInput(false);setSubcommentInput(true); setParentSubcomment(sub.id)}}>Reply</div>

                                       

                                          </div>
                                            {overflowingIds.includes(`subcomment_${sub.id}`) && (
                                            <button onClick={()=>{ExpandText(`subcomment_${sub.id}`);
                                          removeOverflowingId(`subcomment_${sub.id}`)}} className='see_more'>
                                            See more</button>
                                            )}
                                          </div>
                                         
                                          { ((!replyInput && SubcommentInput) && sub.id == parentSubcomment ) &&
                                          <div className={'reply_input_cont single_comment' + " " + 

                                            getCommentSize(`subcomment_${sub.id}`)
                                        } id={`input_sub_${sub.id}`}>     


                                              <form className="comment_form" method="POST" 
                                                      action={url + `/post/${post.id}/comment/feed/${feed}`}>
                                                    <input type='text' name='comment' className='reply_input'
                                                    placeholder='Write here ...' id='sub_input'/>

                                                    <img src={'/smile_icon.png'} className='smile_emote_comment'
                                              onClick={()=> {!emoteModal ? setEmoteModal(true): setEmoteModal(false)}}/>


                                                    <input type='hidden' name='parentSub' value={parentSubcomment}/>
                                              </form>

                                          </div>
                                           }

                                         {sub.children && sub.children.map((s, index)=>{
                                           const encoded = encodeUrlSafe(String(s.User.id));
                                          return <div className={'single_comment' + " " + 
                                            getCommentSize(`subcomment_${sub.id}`)} key={`sub_sub_${s.id}`}>
                                           <div className='left_side_comment'>
                                                                                   <div className='user_comment_pic'>
                              {s.User.picture ? <img src={url + s.User.picture} className='picture_comment'/>
                                         : <img src={'/avatar.png'} className='picture_comment'/>}
         
                                        <a href={`/profile?id=${encoded}`} 
                                          className='anchor_user_home'>{s.User.username}</a>
                                      </div>
                                      <div className='comment_content_post_detail' id={`subsub_${s.id}`}>
                                        {s.content}
                                      
                                      </div>
                                     
                                         </div>

   {overflowingIds.includes(`subsub${s.id}`) && (
                                          <button onClick={()=>{ExpandText(`subsub_${s.id}`);
                                        removeOverflowingId(`subsub${s.id}`)}} className='see_more'>
                                          See more
                                          </button>
                                            )}

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
                            action={url + `/post/${post.id}/comment/feed/${feed}`}>
                            
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