import type {Post} from '../../types_feed'
type DeleteBtnProps = {
    DelPost: (post:Post) => void, post: Post
}


export default function DeletePostModal({DelPost, post}:DeleteBtnProps){

    return (
        <div id='delete_post_detail_confirm'>
          Are you sure you want to delete this post ? 
         <button className='btn btn-danger' onClick={()=> DelPost(post)}>Delete</button>
      </div>
    )
}