"use client"
import {useState, useEffect} from 'react'
type Settings= {
    showEmail : boolean
    postScopeRegion: boolean

}
type settings = {
    settings: Settings,
    hideModal: () => void
}

export default function Settings({settings, hideModal}:settings){
    const [email, setEmail] = useState(false)
    const [postScope, setpostScope] = useState(false)
    
    const url = process.env.NEXT_PUBLIC_API_URL


    useEffect(()=>{
          setEmail(settings.showEmail)
          setpostScope(settings.postScopeRegion)
    }, [settings])

    const form_url = url + '/user_settings/edit/false'
    return(
    
            <div className="row p-0 m-0 position-absolute d-flex align-items-md-center 
            justify-content-md-center" id='profile_modal_bg'>
                
                <div className="col-md-6 col-12 g-0 settings_modal p-3 p-sm-5 pt-5 pt-md-3">
                    
                    <form className="dash_settings_form" 
                    action={form_url} method='POST'>
                        
                        <button type='button' className='x_btn_reg txt_md'
                        onClick={hideModal}>X</button>


                        <div className='options_cont d-flex flex-column gap-3 gap-sm-5 gap-md-4 
                        pt-3 pt-sm-5'>

                        
                            <div className='option_section txt_md pb-3 pb-sm-4 pb-md-3 d-flex flex-column 
                            align-items-center'>
                                <div className='setting_section_header txt_lg flex-shrink-0'>Dashboard options</div>
                                <div className='option_div'>
                                    
                            
                                    <label htmlFor='EmailRadio'>Show email</label>
                                    <input type="checkbox" name="email" id="EmailRadio"
                                    checked={email} onChange={(e)=> setEmail(e.target.checked)}/>
                            </div>
                       </div>

                            <div className='option_section txt_md pb-3 pb-3 pb-sm-4 pb-md-3 d-flex flex-column 
                            align-items-center'>
                                <div className='setting_section_header txt_lg flex-shrink-0'>Feed options</div>

                                <div className='option_div'>
                                    <label htmlFor='postScope'>Scope posts to region</label>
                                    <input type="checkbox" name="postScope" id="postScope"
                                    checked={postScope} onChange={(e)=> setpostScope(e.target.checked)}/>
                                </div>
                            </div>
                        </div>

                        <div className='bottom_options_submit_cont'>
                               <button type="submit" name="settings" 
                               className='submit_btn_edit_profile txt_md'>
                                Save</button>
                        </div>
                            
                    </form>
                </div>

            </div>

    )
}