"use client"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {useState} from 'react'


export type Image = {
  url: string
}

type CarouselProps = {
  images: Image[], postId? : string
}

export default function Carousel({ images, postId }: CarouselProps) {
      const [enlarged, setEnlarged] = useState(false);

  return (
   
    <div id={`carouselExampleIndicators_${postId}`} className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
          { images.length > 1 &&
      <ol className={postId ?"carousel-indicators": " carousel-indicators carousel_indicators_feed"}>
        {images.map((_, idx) => (
          <li
            key={idx}
            data-bs-target={`#carouselExampleIndicators_${postId}`}
            data-bs-slide-to={idx}
            className={idx === 0 ? "active" : ""}
          ></li>
        ))}
      </ol>
}
      {/* Slides */}
      <div className={"carousel-inner"}>
        {images.map((image, idx) => (
          <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""} `}>
            <img className={enlarged ? "enlarged_img": "d-block h-100 w-100 image_post_detail"} src={image.url} alt={`slide-${idx}`} id={`img_post_${idx}`}
            onClick={()=>{
               if (enlarged){
                setEnlarged(false)
               }else{
                console.log('triggered')
                setEnlarged(true)
               }
            
            } }/>
          </div>
        ))}
      </div>

 
    </div>


  )
}