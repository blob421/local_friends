'use client '
type Post = {
     id: number;
    title:string, 
    content: string, 
    Media: Media[]
}
type Media = {
  url: string;
};

type PostDetailModalProps = {
  post: Post
}

export default function PostDetailModal({post}:PostDetailModalProps){
    const url = process.env.NEXT_PUBLIC_API_URL
    return(
        <div id="post_detail_bg">
           
             <div className="post_detail_modal">
                     <div className="title_post_detail">
                      {post.title}
                    </div>
                    <div className="description_post_detail">
                        {post.content}
                    </div>
                     <div className="post_detail_pictures_cont">
                        {post.Media?.map(img=>{
                           return <img src={url + img.url} className="image_post_detail"></img>
                        })
                        }
                         
                     </div>

                     <div className="comments_post_detail_cont">

                   
                            <form className="comment_form" method="POST" 
                            action={url + `post/${post.id}/comment`}>
                            <input type="text" placeholder="Type here ..." className="comment_bar">
                            </input>
                            </form>
                    </div>
             </div>
        </div>
    )
}