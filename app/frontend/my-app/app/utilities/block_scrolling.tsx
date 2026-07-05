export const block_scrolling = (classname?:string, disable = true) => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    if (!isPortrait) return;

    const body = document.body;
   
    let formH = 'auto'

    if (disable){
     if (classname){
       const form = document.querySelector(`.${classname}`) as HTMLElement
       formH = window.getComputedStyle(form).height
     }
     else {
      formH = '100vh'
     }

    
    }
  
    body.style.height = formH
   
    
   
   }