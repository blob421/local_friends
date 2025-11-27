'use client'
import $ from 'jquery'

export default function enlarge(idx?:string){
      
          const img = $(`#img_post_${idx}`)
        
         
          if (img.hasClass('image_post_detail')){
          img.addClass('enlarged_img')
         
         
          img.removeClass('image_post_detail')
          }else{
            img.removeClass('enlarged_img')
          img.addClass('image_post_detail')
         

          img.addClass('image_post_detail')
          }
    
        }
