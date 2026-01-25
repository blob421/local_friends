"use client";
import {useState, useEffect } from 'react'
import {fetchAuth} from '../components/fetch'
import $ from 'jquery'
import dynamic from 'next/dynamic';
import { encodeUrlSafe } from '../components/encode';
import { truncateText } from '../components/truncate_text';

const CreateModal = dynamic(()=> import('./create_modal'))
const PostDetailModal = dynamic(()=> import('./post_detail_modal'))
export type Region = {
  id: number
  display_name: string
}
export type Post = {
  _id: string
  id: number;
  title: string;
  content: string;
  Media: Media[]
  User: User
  Comments: Comment[]
  SubComments: SubComment[]
  Region: Region
  latitude: number
  guessed_animal: string
  longitude: number
 
  
};
export type Media = {
  url: string;
  idx: number;
  filename: string;
  mimeType: string;
  
};
export type Comment = {
  content : string
  id: string
  User: User
  SubComments: SubComment[]
  createdAt: string
}
export type SubComment = {
  content : string
  id: string
  User: User
  SubComments: SubComment[]
  createdAt: string
  CommentId ? : number
  ParentId ? : number
}
export type User = {
  picture: string
  id: number
  username: string
}
export default function Home(){
  const default_user:User = {
    id:0,
    username:'defaultUser',
    picture:'null'
  }
const [posts, setPosts] = useState<Post[]>([])
const [noPosts, setPostsNull] = useState(false)
const [postScope, setPostScope] = useState("")

const [createModal, setModal] = useState(false)
const [postDetailModal, setPostDetailModal] = useState(false)
const [comments, setComments] = useState<Comment[]>([])
const [commentDeleted, setCommentDeleted] = useState(false)
const [subcomment, setSubComments] = useState<SubComment[]>([])
const [commentDone, setCommentDone] = useState(false)
const [newComment, setNewComment] = useState("")
const [activePost, setActivePost] = useState<Post | undefined>(undefined)
const [requestUser, setUser] = useState<User>(default_user);
const [commentReload, setCommentReload] = useState("")
const [regionId, setRegionId] = useState("")
const [bottomReached, setBottomReached]= useState(false)
const [noMorePosts, setNoMorePosts] = useState(false)
const [viewedPostsId, setViewedPostsId] = useState<string[]>([])
const [overflowingIds, setOverflowingIds] = useState<string[]>([]);

const removeOverflowingId = (id: string) => {
  setOverflowingIds(prev => prev.filter(existingId => existingId !== id));
};

const getResponse = async (scope:string | null) => {
        const fetch_url = scope ? `${url}/home?scope=${scope.toLowerCase()}` :`${url}/home`
        const response = await fetchAuth(`${fetch_url}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json()
        console.log(data)
        setRegionId(data.region)
        console.log(regionId)
        if (data.posts && data.posts.length > 0){
            setPosts(data.posts)
            setPostsNull(false)
        }else{
          setPostsNull(true)
        }
        if (scope){
          setPostScope(scope)
        }else{
            if (data.region){
              console.log(data.region)
                setPostScope('Region')
              }else{
              setPostScope('World')
              }

        }


        setUser(data.user)
 } 
const url = process.env.NEXT_PUBLIC_API_URL

 useEffect(()=>{
  if (!activePost){
    return;
  }
     
  const map = new Map();

      // Add comments
      activePost.Comments.forEach(c => {
        c.SubComments = [];
        map.set(`c_${c.id}`, c);
      });

      // Add subcomments
      activePost.SubComments.forEach(s => {
        s.SubComments = [];
       map.set(`s_${s.id}`, s);
});

  const roots = new Array;

  activePost.SubComments.forEach(s => {
  if (s.ParentId) {
    map.get(`s_${s.ParentId}`).SubComments.push(s);
 } else if (s.CommentId) {
    map.get(`c_${s.CommentId}`).SubComments.push(s);
  }
});
 activePost.Comments.forEach(c => roots.push(c));
  
  setComments(roots);
    }, [activePost])


/////////////////// HANDLE REFRESH WHEN MAKING A COMMENT AND A POST IS UPDATED 

 useEffect(()=>{
  
    if (commentDone){

    setCommentDone(false)
    document.getElementById(newComment)?.scrollIntoView()
  

    const post = posts.find(obj => obj.id === activePost?.id);
    if (!post) return;

    setActivePost({ ...post }); // post is Post, spread is still Post

    const text_contents = $('.post_content').toArray()
    text_contents.forEach(c=>{
    truncateText(c, 5)
  })
  
 }
 else if (commentDeleted){
   setCommentDeleted(false); 
    const post = posts.find(obj => obj.id === activePost?.id);
    if (!post) return;

    setActivePost({ ...post }); // post is Post, spread is still Post
 }

    }, [posts])


useEffect(()=>{
 const params = new URLSearchParams(window.location.search)
 const feed = params.get('feed')
 const comment = params.get('comment')
 if(comment){
   setCommentReload(comment)
 }
 getResponse(feed || null);
 
 const newPostDiv = document.getElementById('new_post_div')
 const newPostIcon = $('#new_post_icon')
 newPostDiv?.addEventListener('mouseenter', ()=>{
     newPostIcon.addClass('newPostButtonRight')
 })
 newPostDiv?.addEventListener('mouseout', ()=>{
     newPostIcon.removeClass('newPostButtonRight')
 })

const feed_middle= document.getElementById('feed_middle')

let handleFeedGen = () =>{

  if (!feed_middle) return;
     const { scrollTop, scrollHeight, clientHeight } = feed_middle;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    setBottomReached(true)
    console.log('Bottom reached');
  }
};

if (feed_middle){
  feed_middle.addEventListener('scroll', handleFeedGen)

}

}, [])


useEffect(()=>{
   if (!bottomReached || noMorePosts){ return}
   
   const posts_ids = posts.map(post => post._id)
   setViewedPostsId(prev=> [ ...prev, ...posts_ids])
 

}, [bottomReached])

/// Runs when bottom reached
useEffect(()=>{
  const morePosts_url = url + `/more_posts/${postScope}/${regionId}`
 fetchAuth(morePosts_url, {method:'POST', 
                             headers: {'Content-Type': 'application/json'},
                             body: JSON.stringify({ids: viewedPostsId})})
                             .then(res => res.json()).then(data =>{ 
                              console.log(data)
                              if (data.posts.length < 1 ){
                                setNoMorePosts(true)
                              }
                              setPosts(prev => [...prev, ...data.posts])
                              setBottomReached(false)
                             })
}, [viewedPostsId])




useEffect(() => {
  if(commentDeleted) return
  console.log('posts triggered')
  const newOverflowing: string[] = [];
  const allComments = document.querySelectorAll<HTMLDivElement>(
    ".post_text"
  );
  
  allComments.forEach(el => {
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    const maxHeight = lineHeight * 8; // 2 lines
    if (el.scrollHeight > maxHeight) {
      newOverflowing.push(el.id); // use the div's own id
    }
  });
  setOverflowingIds(newOverflowing);
  handle_popups()

   /// Handles trimming posts after reaching the bottom
  if (posts.length > 25){
    setPosts(prev=> prev.filter((p, index) => index >= (posts.length - 15))) // keeping only the last 15 posts
  }

}, [posts]);



const handle_popups = ()=>{




const popUps = document.querySelectorAll('[id^="web_icon"]')



document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
 
  if (!target.closest('.web_icon_cont')) {
    const popUps = document.querySelectorAll('[id^="region_popup_icon_"]')
    popUps.forEach(pop=>{
      pop.classList.remove('visible')
    })
  }
});
}




const setVisiblePopUp = (id:string) => {
  const popUp = $(`#region_popup_icon_${id}`)
  if (popUp.hasClass('visible')){
    popUp.removeClass('visible')
  }else{
  popUp.addClass('visible')
  }
}




return (
 
<div className="container-fluid d-flex justify-content-center">
        
        


            <div className="feed_middle col-12 col-lg-7 col-ipad-pro" id='feed_middle'>
               
              <div className='row d-flex justify-content-center'>
                  
                  <div className='feed_top_bar_create col-md-10'>

                    <button className={postScope !== 'Region' ? 'region_home_btn'
                                                             : 'region_home_btn toggled_btn'}
                     onClick={()=>{ if(postScope == 'World'){getResponse('Region')}}}>
                      Region</button>
                  
                    <button onClick={
                      ()=>{ if(postScope == 'Region'){getResponse('World')}}
                    }
                    className={postScope == 'World' ? 'worldwide_home_btn toggled_btn'
                                                    : 'worldwide_home_btn'}>World</button>




                    <button className='new_post_btn' id={'new_post_div'} onClick={()=>{setModal(true);
                       $('#feed_modal_bg').show()}}>
                      New post <img src={'/new_post.png'} id='new_post_icon' className='new_post_icon'></img>
                    </button>
                     
                    
                  </div>
                  {noPosts ? <div className='col-md-10 no_posts_div'>
                     No posts yet for this region
                    </div>:

                  <div className='posts_cont col-md-10'>
                 
                  
                  {posts?.map(post => {
                    
                       const encoded = encodeUrlSafe(String(post.User.id));
                      return ( 
                        
                      <div className='row post_unit_feed' key={post.id} onClick={()=>{
                       
                        setPostDetailModal(true);
                        $('#post_detail_bg').show();
                        setActivePost(post)
                        setCommentReload("")
                       }}>
                         
                        <div className='left_post_text col-md-8'>
                          <div className='post_title'>

                            {post.Region.display_name && <div className='web_icon_cont'>
                            <img
                                src={'/web_icon2.png'}
                                className='web_icon_posts'
                                id={`web_icon_${post.id}`}
                                onMouseEnter={() => setVisiblePopUp(post.id.toString())}
                                onMouseLeave={() => setVisiblePopUp(post.id.toString())}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  
                                  setVisiblePopUp(post.id.toString());
                                }}
                              />

                               <div id={`region_popup_icon_${post.id}`} className='region_popup_feed'>
                                {post.Region.display_name}
                              </div>
                            </div>
                            }
                            <div className='post_title_text_home'>{post.title}</div>
                        
                            </div>
                          
                                    
                                <div className='post_content'>
                                      <div className='post_home_user'>
                                        {post.User.picture ? <img src={url + post.User.picture} className='post_user_home_img'/>
                                         : <img src={'/avatar.png'} className='post_user_home_img'/>}
                                         
                                          <a href={`/profile?id=${encoded}`} 
                                          className='anchor_user_home'>{post.User.username}</a>
                                     </div>
                                     <div className='post_text truncated_8' id={`post_text_${post.id}`}>
                                      {post.content}
                                     </div>
                                {overflowingIds.includes(`post_text_${post.id}`) && 
                                <div className='show_more_wrapper'>
                                <button className='see_more_main_feed' onClick={(e)=> {e.stopPropagation();
                                  const text = $(`#post_text_${post.id}`)
                                  text.removeClass('truncated_8');
                                  removeOverflowingId(`post_text_${post.id}`)
                                }}>Show more

                                </button>
                                </div>
                                
                                }
                                </div>


                          </div>

                      <div className='images_cont_feed col-md-4'>
                        
                       <div className='feed_img_cont'>
                          <img className='feed_images'
                            src={url + post.Media[0].url.replace("\\", "/")} // fix Windows-style backslash
                            alt={`media for post ${post.id}`}
                          />
                        </div>
                     
              </div>                   
                       
                      </div>
                  )}
                  )
                  
                  }

                       {noMorePosts && <div className='noMorePosts'> No more posts for the moment</div>}
                  </div>
            }  </div>

            </div>
      
            
          {createModal && <CreateModal url={url} onClose={()=> setModal(false)}/>}    
          {postDetailModal && (activePost && <PostDetailModal feed={postScope} commentReload={commentReload}
          comments={comments} delPost={(post)=> {
            setPosts(prev=> prev.filter(p=> p.id !== post.id));
            setPostDetailModal(false)
          }}
          delComment={(commentId, type, subComments) => {
          
          setPosts(prev =>
              prev.map(p =>
                p.id === activePost.id
                  ? {
                      ...p,
                      Comments:
                        type === "Comments"
                          ? p.Comments.filter(c => c.id !== commentId)
                          : p.Comments,
                      SubComments:
                        type === "SubComments"
                          ? p.SubComments.filter(s => !subComments.includes(parseInt(s.id)))
                          : 
                        type === "Comments" ? p.SubComments.filter(s => !subComments.includes(parseInt(s.id)))
                          :
                          p.SubComments
                    }
                  : p
              )
            );
              console.log(posts)
              setCommentDeleted(true)
          }}
          //////////////////////// ADDING COMMENTS DYNAMICALLY
            setComment={(type, content, id, commentId, parentId) => {
           
       
             
              setPosts(prev =>
                prev.map(p => {
                  if (p.id === activePost.id) {
    

                    return {
                      ...p,
                      Comments: 
                      type == "Comments" ?
                      [
                        ...p.Comments,
                        {
                          User: requestUser,
                          content,
                          createdAt: new Date().toISOString(),
                          id: id,
                          SubComments: []
                        }
                      ] : p.Comments,
                      SubComments: type == "SubComments" ?
                      [...p.SubComments, { User: requestUser,
                                            CommentId: commentId,
                                            content,
                                            createdAt: new Date().toISOString(),
                                            id: id,
                                            SubComments: []}
                        ]: type == "SubSubComments" ?
                         [...p.SubComments, { User: requestUser,
                                            ParentId: parentId,
                                            content,
                                            createdAt: new Date().toISOString(),
                                            id: id,
                                            SubComments: []}
                        ]: p.SubComments
                    };
                  }

                  return p;
                })
              );
              setCommentDone(true);
              type == 'Comments' ? setNewComment(`top_comment_${id}`)
                                 : type == "SubComments" ? setNewComment(`subcomment_${id}`):
                                 setNewComment(`sub_sub_${id}`)
              }
              }           

      
          
          post={activePost} user={requestUser} onClose={() => setPostDetailModal(false)}/>)}                 
        </div>









    )
}