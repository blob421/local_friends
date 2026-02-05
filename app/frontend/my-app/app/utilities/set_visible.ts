import $ from 'jquery'

export function set_visible(id:string){
       const menu = $(`#${id}`)
       
       if (menu.hasClass('visible')){
      
        menu.removeClass('visible')
       
       }else{
        menu.addClass('visible')
        
       }
    }