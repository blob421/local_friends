import { fetchAuth } from "./fetch";
import type {Post} from '../types_feed'
import { set_visible } from "./set_visible";

export const DelPost = async (post:Post, url?:string)=>{
      const delUrl = `${url}/post/region/${post.Region.id}/id/${post._id}`
      let status 
      await fetchAuth(delUrl, {method: 'DELETE'}).then(res => status = res.status)
      set_visible('delete_post_detail_confirm')
    
      return status
    }