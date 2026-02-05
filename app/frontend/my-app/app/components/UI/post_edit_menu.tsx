type EditMenuProps ={
  setEditModalVisible: (bool: boolean) => void, location?: string, postId: string,
  setPostActive?: (id:string) => void, setMenuVisible: (postId:string) => void, 
  visibleMap?: Record<string, boolean>, visible? : boolean
}
import { handleMenu } from '../../dashboard/tabs/posts_component'
import {set_visible} from '../../utilities/set_visible'

export default function PostEditMenu({setEditModalVisible, setPostActive, setMenuVisible, visibleMap,
  location, postId, visible}: EditMenuProps){
    return (
         <div className={location? `menu_post_dashboard` :'menu_post_detail_cont'}>
              <button id={location? "three_dots_dashboard" :'three_dots_post_detail'}
                      onClick={()=> setMenuVisible(postId)}>...</button>
             {((visibleMap && visibleMap[postId]) || visible) && 
              <div id={location? `option_menu_dashboard_${postId}`:'option_menu_post_detail'}
                   className='option_menu_hidden'>
                   <button className='option_post_detail' 
                   onClick={()=> set_visible('delete_post_detail_confirm')}>Delete post</button>
                   <button className='option_post_detail' onClick={()=> setEditModalVisible(true)}>
                    Edit post</button>
              </div>}
        </div>
    )
}