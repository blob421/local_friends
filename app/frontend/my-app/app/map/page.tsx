"use client";
import { useEffect , useState} from "react";
import { fetchAuth } from "../components/fetch";
import dynamic from "next/dynamic";
import type {Comment, Post, User} from '../home/page'


const Map = dynamic(() => import("./map"), {
  ssr: false
});
const PostDetailModal = dynamic(()=> import('../home/post_detail_modal'))


const url = process.env.NEXT_PUBLIC_API_URL


export default function MapMain(){
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [postDetailModal, setPostDetailModal] = useState(false)
  const [commentReload, setCommentReload] = useState("")
  const [reqUSer, setReqUser] = useState("")
 
   useEffect(()=>{
    if (!activePost){
      return;
    }     
   
  
          fetchAuth(`${url}/post/${activePost?.id}/comments`).then(res => res.json()).then(
            data => {setComments(data.comments); console.log(data)})
            setPostDetailModal(true)
      }, [activePost])


  return (
    <div>
  <Map setPost={setActivePost} setUser={setReqUser} setCommentReload={setCommentReload}/>
  {(activePost && postDetailModal) && <PostDetailModal comments={comments} post={activePost} user={reqUSer} 
  feed={"map"} commentReload={commentReload} onClose={()=> {setActivePost(null); setPostDetailModal(false)}}/>}
  </div>
 )
}