import {useEffect, useState} from 'react'
import type {Post} from '../types_feed'
import { fetchAuth } from '../components/fetch'
import Carousel from '../home/pic_carousel'
import type {Image} from '../home/pic_carousel'
type DashboardPostsComponentProps = {
  userId: string
}
type Images = {
  
}
export default function PostsComponent({userId}:DashboardPostsComponentProps){
  const url = process.env.NEXT_PUBLIC_API_URL

  const [posts, setPosts] = useState<Post[] | null>(null)
  
  useEffect(()=>{
   const postsUrl = url + `/dashboard/posts/${userId}`
   fetchAuth(postsUrl, {method: 'GET'}).then(res => res.json()).then(data => setPosts(data.posts))


  }, [])

  useEffect(()=>{
  console.log(posts)

  }, [posts])

  return(
 
  
        <div className='posts_dashboard_cont col-lg-11 col-12'>
             {posts && posts.length > 0 && posts.map((post) => {
              const images: Image[] = post.Media.map(i => ({url: url + i.url}))
              return(
              <div className='single_post_dash d-flex flex-lg-row flex-column col-12 col-lg-8
               gap-3 gap-lg-0 p-2 pb-5 pb-lg-1' key={post.id}>
                  <div className='post_dash_left_content col-12 col-lg-7 mr-5'>
                    <div className='post_dash_title mt-lg-2 mt-1 p-4 p-lg-0 mt-lg-0'>
                        {post.title}
                    </div>
                    <div className='post_dash_description col-11 col-lg-10 mt-lg-3'>
                         {post.content}
                    </div>

                  </div>
                  <div className='post_dash_right_picture col-12 col-lg-4'>
                    <Carousel images={images}/>
                  </div>
              </div>
            ) })
             }
        </div>
 

    )
    
}