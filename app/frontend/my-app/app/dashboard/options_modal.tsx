"use client"
import {useState, useEffect} from 'react'
type Settings= {
    showEmail : boolean

}
type settings = {
    settings: Settings,
    hideModal: () => void
}

export default function Settings({settings, hideModal}:settings){
    const [email, setEmail] = useState(false)
    
    const url = process.env.NEXT_PUBLIC_API_URL


    useEffect(()=>{
          setEmail(settings.showEmail)
    }, [settings])

    const form_url = url + '/user_settings/edit'
    return(
        <div className="container">
            <div className="start-0 top-0 h-100 w-100 position-absolute d-flex align-items-center 
            justify-content-center" id='dash_options_bg'>
                
                <div className="col-md-6 col-12 settings_modal">
                    
                    <form className="dash_settings_form" action={form_url} method='POST'>
                        
                        <button type='button' className='x_btn_modal_edit_dash'
                        onClick={hideModal}>X</button>

                        <div className='options_cont'>
                            <div className='setting_section_header'>Dashboard options</div>
                           
                            <div className='option_div'>
                                <label htmlFor='EmailRadio'>Show email</label>
                                <input type="checkbox" name="email" id="EmailRadio"
                                checked={email} onChange={(e)=> setEmail(e.target.checked)}/>
                            </div>
                        </div>
                        <div className='save_setting_cont'>
                               <button type="submit" name="settings" className='save_settings_btn'>
                                Save</button>
                        </div>
                            
                    </form>
                </div>

            </div>
        </div>
    )
}