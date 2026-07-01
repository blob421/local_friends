'use client'

import { useState, useEffect, useRef } from "react"


type infoBannerProps = {
    slides: string[]
}
export default function InfoBanner({slides}: infoBannerProps){

    const [current, setCurrent] = useState(-1)

    const [sliding , setSliding] = useState(false)
    const interval = useRef(0)

    function startTimeout() {

    interval.current= window.setInterval(() => {   // 

        setSliding(true)

        setTimeout(() => {
            setCurrent(prev => (prev + 1) % slides.length) /// Change the center by array length 
            setSliding(false)                              /// React will batch both 
        }, 2000)

        }, 8000)
    }
    function handleVisibility() {
       if (document.hidden) {
        window.clearInterval(interval.current)
        interval.current = 0
       }
       else if (!interval.current){

         startTimeout()

       }
  
    }

  useEffect(() => {
    startTimeout()
    document.addEventListener("visibilitychange", handleVisibility);
    


    return () => {clearInterval(interval.current);   
        document.removeEventListener("visibilitychange", handleVisibility);}

  }, [])




    return (

      <div className="info_banner_main row txt_sm">
            {slides.map((s, idx) => {

                const pos = (idx - current + slides.length) % slides.length 
            // get how spaced they are 
            // we can sum slides.len since modulo counts it as one division and makes it positive
                 
 
                const cls =
                        pos === 1 && !sliding ? "middle_slide info_banner" :
                        pos === 1 && sliding  ? "slide_left info_banner" :

                        pos === 0 && !sliding ? "slide_left info_banner" :
                        pos === 0 && sliding  ? "slide_right hidden info_banner" :
                        
                        pos == 2 && !sliding ? "slide_right hidden info_banner":
                        pos == 2 &&  sliding ? "middle_slide info_banner":
                        

                        "slide_right info_banner"
                         /// Only change classes to avoid DOM node recreation and loosing 
                         /// previous classes 
                return (

                            <div className={cls} key={idx}>
                                    {s}
                                </div>

                )
            })}
      </div>
    )
}