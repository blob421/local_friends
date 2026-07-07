"use client";
import { useEffect , useState} from "react";
import dynamic from "next/dynamic";
import type {Comment, Post, User} from '../types_feed'
import { truncateText } from '../components/truncate_text';
import $ from 'jquery'

const MapComponent = dynamic(() => import("./map"), {
  ssr: false
});

const PostDetailModal = dynamic(()=> import('../home/post_detail_modal'))

const default_user:User = {
    id:0,
    username:'defaultUser',
    picture:'null'
  }
export default function MapMain(){
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [postDetailModal, setPostDetailModal] = useState(false)
  const [commentReload, setCommentReload] = useState("")
  const [reqUSer, setReqUser] = useState<User>(default_user)
  const [posts, setPosts] = useState<Post[]>([])
  const [commentDone, setCommentDone] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [commentDeleted, setCommentDeleted] = useState(false)
  
  useEffect(()=>{
  if (!activePost){
    return;
  }
     console.log(activePost)
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
  setPostDetailModal(true)
  setReqUser(activePost.User)


    }, [activePost])


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


  return (
    <div>
  <MapComponent setPost={post => setActivePost(post)} setUser={setReqUser} setCommentReload={setCommentReload} 
   setPosts={(posts)=> setPosts(posts)} posts={posts}/>

  {(activePost && postDetailModal) && <PostDetailModal comments={comments} post={activePost} user={reqUSer} 
  feed={"map"} commentReload={commentReload} 
  delPost={(post)=> {setPosts(prev=> prev.filter(p=> p.id !== post.id));
    setActivePost(null); setPostDetailModal(false)
  }}
  
  postModified={(post:Post) => {setPosts(prev => prev.map(p => p.id == post.id ? post : p));
                                       setActivePost(prev => post)
          } }
  onClose={()=> {setActivePost(null); setPostDetailModal(false)}}
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
                          User: reqUSer,
                          content,
                          createdAt: new Date().toISOString(),
                          id: id,
                          SubComments: []
                        }
                      ] : p.Comments,
                      SubComments: type == "SubComments" ?
                      [...p.SubComments, { User: reqUSer,
                                            CommentId: commentId,
                                            content,
                                            createdAt: new Date().toISOString(),
                                            id: id,
                                            SubComments: []}
                        ]: type == "SubSubComments" ?
                         [...p.SubComments, { User: reqUSer,
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
              }/>}
  </div>
 )
}