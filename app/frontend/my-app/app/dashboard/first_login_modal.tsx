"use client"
import { fetchAuth } from "../components/fetch"

import $ from 'jquery'
export default function FirstLoginModal(){
    const modifySettings = async()=>{
        const fetch_url = `${process.env.NEXT_PUBLIC_API_URL}/user_settings/edit/true`
        await fetchAuth(fetch_url, {method: 'POST'}).then(res=> {if(res.status == 200){
         $('#first_login_bg').hide()
      
        }})
        
    }
    return (
        <div id="first_login_bg">
             <div className="first_login_modal">
                <h1 className="header_welcome_modal"> Welcome to local friends</h1>
                <div className="text_first_login">
                You're almost there but first you need to set a team and a region
                to access the main feed .
                </div>
                <button className="first_login_gotit_btn btn btn-primary" onClick={()=>modifySettings()}>
                    Got it !
                </button>
             </div>

        </div>
    )
}