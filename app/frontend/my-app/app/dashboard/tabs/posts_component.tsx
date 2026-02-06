import {useEffect, useState} from 'react'
import dynamic from 'next/dynamic'
import type {Post} from '../../types_feed'
import { fetchAuth } from '../../utilities/fetch'
import Carousel from '../../components/UI/pic_carousel'
import type {Image} from '../../components/UI/pic_carousel'
import PostEditMenu from '@/app/components/UI/post_edit_menu'
import DeleteBtnModal from '@/app/components/UI/delete_confirm'
const CreateModal = dynamic(() => import('../../home/create_modal'))
import { DelPost } from '@/app/utilities/delete_post'
import { set_visible } from '@/app/utilities/set_visible'
import { create } from 'domain'
import $ from 'jquery'
type DashboardPostsComponentProps = {
  userId: string
}

export const handleMenu = () =>{
    const menus = document.querySelectorAll('.option_menu_hidden')
    
    menus.forEach(menu =>{
      
         menu.classList.remove('visible')
      
     
    })
  }

export default function PostsComponent({userId}:DashboardPostsComponentProps){
  const url = process.env.NEXT_PUBLIC_API_URL
  
  const [posts, setPosts] = useState<Post[]>([])
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post>()
  const [createModal, setCreateModal] = useState(false)
  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({})

  const handlePostEditCreate = (post:Post, edit:boolean) =>{
       if (edit){
         setPosts(prev => prev.map(p => p.id == post.id ? post : p))
 
       }else {
        setPosts([post, ...posts])
       }
  }


  const delPost = (post:Post) => {
    if (selectedPost && posts)
    setPosts(prev => prev.filter(p => p.id !== post.id))
  }


  useEffect(()=>{

   const postsUrl = url + `/dashboard/posts/${userId}`
   fetchAuth(postsUrl, {method: 'GET'}).then(res => res.json()).then(data => setPosts(data.posts))
  
  document.addEventListener('click', (e) => {
     const target =  e.target as HTMLElement
     if (target.id !== 'three_dots_dashboard'){
      setVisibleMap(prev => {
          const newMap: Record<string, boolean> = {}
          for (const key in prev){
            newMap[key] = false

          }
          return newMap
      })
     }
  })
  



  }, [])

  useEffect(()=>{
     posts.forEach(p => { visibleMap[p.id] = false })
  }, [posts])

  return(

       <div className='col-lg-11 col-12'>
        <div className='posts_dashboard_cont'>

               <button className='new_post_btn_dash new_post_btn' id={'new_post_div'} onClick={()=>{setCreateModal(true);
                       $('#feed_modal_bg').show()}}>
                 New post <img src={'/new_post.png'} id='new_post_icon' className='new_post_icon'></img>
                </button>

             {posts && posts.length > 0 && posts.map((post) => {
              const images: Image[] = post.Media.map(i => ({url: url + i.url}))
              return(
                
              <div className='single_post_dash d-flex flex-lg-row flex-column col-12 col-lg-8
               gap-3 gap-lg-0 p-2 pb-5 pb-lg-1 position-relative' key={post.id}
               id={`dash_post_${post.id}`}>

                 <PostEditMenu setEditModalVisible={(bool:boolean) => setEditModalVisible(bool)} visibleMap={visibleMap}
                location={'dashboard'} postId={String(post.id)} setMenuVisible={(postId:string) => {
             
                 setVisibleMap(prev => { 
                   const newMap: Record<string, boolean> = {}
                   for (const key in prev){
                     if (key == postId){
                       newMap[key] = !prev[key]
                     }
                     else {
                      newMap[key] = false
                     }
                   }
                   return newMap
                 })

                }}
                setPostActive={(id:string) => setSelectedPost(posts.find(p => p.id == parseInt(id)))}/>

                  <div className='post_dash_left_content col-12 col-lg-7 mr-5'>
                    <div className='post_dash_title mt-lg-2 mt-1 p-4 p-lg-0 mt-lg-0'>
                        {post.title}
                    </div>
                    <div className='post_dash_description col-11 col-lg-10 mt-lg-3'>
                         {post.content}
                    </div>

                  </div>
                 
                     <div className='post_dash_right_picture col-12 col-lg-4 '>
                    {images && images.length > 0 &&
                    <Carousel images={images} postId={String(post.id)}/>
                    }
       
                  </div>
                  
              
               
              </div>
            ) })


             }
           {(posts && posts.length < 1) && 
           <div className='col-12 justify-content-center d-flex align-lg-center 
           gap-lg-3 gap-0 p-4 no_post_div'>
            <div className='no_post_wrapper col-12 col-lg-6 mt-2'>
            <div className='text_no_post'>Nothing but crickets singing ...

            </div>
            
            <img src={'/cricket2.png'} className='cricket_img'/>
            </div>

            </div>}

           


        </div>
            {createModal && 
            <CreateModal url={url} 
            onClose={()=> setCreateModal(false)} dashboard='dashboard' 
            handlePostEditCreate={(post:Post, edit:boolean) => 
                                                   handlePostEditCreate(post, edit) } />}


          {editModalVisible && <CreateModal url={url} post={selectedPost} edit={true}
            onClose={()=> setEditModalVisible(false)} dashboard='dashboard' 
            handlePostEditCreate={(post:Post, edit:boolean) => 
                                                   handlePostEditCreate(post, edit) }/>}

        

           {selectedPost && <DeleteBtnModal DelPost={async (post:Post) => { 
                 delPost(post);
                 await DelPost(post, url? url: "")
                      .then(s => s == 202 ? delPost(post) : alert('Unauthorized action'))
         
                 }} post={selectedPost}/>}
        </div>
 

    )
    
}