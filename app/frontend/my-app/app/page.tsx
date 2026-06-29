'use client'

import Link from 'next/link';
import { useEffect, useState } from "react";
import Register from "./components/registration/register";
import Reset from "./components/registration/reset";
import Login from "./components/registration/login";

export default function Home(){

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
        <div className="container-fluid">
              <div className="row">

                    <div className="col-12 top_bar_landing">
                         <div className="local_friends">
                              Local Friends
                         </div>
                         <div className="login_btn_cont">
                              
                            <Link className="dashboard_btn_landing" href="/dashboard"
                            hidden={!isLoggedIn}>Dashboard
                             
                            </Link>
                            <div className="login_btn_landing" onClick={()=>setLoginV(true)}
                            hidden={isLoggedIn}>
                              Login
                            </div>
                            <div className="reg_btn_landing" onClick={()=>setRegV(true)}
                             hidden={isLoggedIn}>
                              Register
                            </div>
                          

                          </div>
                    </div>
              </div>
              <div className="row d-flex justify-content-center title_header_landing">

                 
                    Report animal sightings and connect with animal lovers
                  
               </div>
                   <div className="row top_landing_row">
                        <div className="col-md-8 big_text_landing">
                         <div className="top_text_landing">
                          The new social media for animals in your region, 
                          because we think they deserve it too.
                         </div>

                          <ul className="bullet_points_top_landing">
                              <li>Help map and get to know animals living in your region</li>
                              <li>Make new friends on the way</li>
                              <li>Get AI feedback and earn badges</li>
                          </ul>
                        </div>
                        <div className="col-md-4">
                             <div className="img-fluid">
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