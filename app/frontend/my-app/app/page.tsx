'use client'

import Link from 'next/link';
import { useEffect, useState } from "react";
import Register from "./components/registration/register";
import Reset from "./components/registration/reset";
import Login from "./components/registration/login";

import InfoBanner from './components/banners/home_banner';

export default function Home(){
      const bannerSlides = ['Report animal sightings and connect with animal lovers',
                            'New feature has just rolled out',
                            'Tell your friends ',
                         'Wooah']

      const url = process.env.NEXT_PUBLIC_API_URL + '/auth'
      const [regV , setRegV] = useState(false)
      const [loginV , setLoginV] = useState(false)
      const [resetV , setResetV] = useState(false)

      const [isLoggedIn, setLoggedIn] = useState(false)

      const isAuth = async () => {
          const res = await fetch(url, {credentials: 'include', method:'GET'})
          if (res.ok){
               setLoggedIn(true)
          }
      }
     useEffect(()=> {
        isAuth()
     }, [])
     
    return(
        <div className="container-fluid p-0 m-0">
              <div className="row p-0 m-0">

                    <div className="col-12 top_bar_landing p-5">
                         <div className="local_friends txt_xl text_center">
                              Local Friends
                         </div>
                         <div className="login_btn_cont d-flex flex-column flex-lg-row justify-content-center
                         pr-3 pr-md-5 gap-2 gap-md-3 align-items-center">
                              
                            <Link className="dashboard_btn_landing txt_md" href="/dashboard"
                            hidden={!isLoggedIn}>Dashboard
                             
                            </Link>
                            <div className="login_btn_landing txt_md" onClick={()=>setLoginV(true)}
                            hidden={isLoggedIn}>
                              Login
                            </div>
                            <div className="reg_btn_landing txt_md" onClick={()=>setRegV(true)}
                             hidden={isLoggedIn}>
                              Register
                            </div>
                          

                          </div>
                    </div>
              </div>

              <InfoBanner slides={bannerSlides}/>

                   <div className="row top_landing_row pl-0 mr-0">
                        <div className="col-md-8 big_text_landing gap-4 gap-md-5 pb-2 pb-md-0
                                        align-items-center">
                              <div className="top_text_landing txt_xxl pb-2 pb-md-0 pt-4
                                              text-left 
                                                                    ml-md-5
                                                                       pt-md-5 mt-1 mt-md-0">
                              The new social media for animals in your region, 
                              because we think they deserve it too.
                              </div>

                              <ul className="txt_lg">
                                   <li>Help map and get to know animals living in your region</li>
                                   <li>Make new friends on the way</li>
                                   <li>Get AI feedback and earn badges</li>
                              </ul>
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                             <div className="img-fluid p-5 p-md-0">
                                  <img src={'/earth.png'} className="earth_image"></img>
                             </div>
                        </div>
                   </div>
                  
              
               <div className="row bottom_landing_row">
                  <div className="col 12 icons_div_landing">
                    <img src={'/x_icon.png'} alt="X" 
                    style={{ width: "45px", height: "45px", objectFit: 'contain' }}/>
                    <img src={'/f_icon.png'} alt="facebook" 
                    style={{ width: "35px", height: "35px", objectFit: 'contain' }}/>
                  </div>

                    
               
                  
              </div>

              {loginV && <Login onClose={()=> setLoginV(false)} 
                                reset={()=> {setLoginV(false); setResetV(true)}}/>}

              {regV && <Register onClose={()=> setRegV(false)}/>}
              {resetV && <Reset onClose={()=> setResetV(false)}/>}
        </div>
    )
}