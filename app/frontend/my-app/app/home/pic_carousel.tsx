"use client"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {useState} from 'react'

type Image = {
  url: string
}

type CarouselProps = {
  images: Image[]
}

export default function Carousel({ images }: CarouselProps) {
      const [enlarged, setEnlarged] = useState(false);

  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators */}
      <ol className="carousel-indicators">
        {images.map((_, idx) => (
          <li
            key={idx}
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={idx}
            className={idx === 0 ? "active" : ""}
          ></li>
        ))}
      </ol>

      {/* Slides */}
      <div className="carousel-inner">
        {images.map((image, idx) => (
          <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""} `}>
            <img className={enlarged ? "enlarged_img": "d-block w-100 image_post_detail"} src={image.url} alt={`slide-${idx}`} id={`img_post_${idx}`}
            onClick={()=>{
               if (enlarged){
                setEnlarged(false)
               }else{
                setEnlarged(true)
               }
            
            } }/>
          </div>
        ))}
      </div>

 
    </div>
  )
}