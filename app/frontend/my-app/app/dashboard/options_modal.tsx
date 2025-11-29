"use client"
import {useState} from 'react'
type Settings= {
    showEmail : boolean

}
type settings = {
    settings: Settings
}
export default function Settings({settings}:settings){
    const [email, setEmail] = useState(false)
    return(
        <div className="container">
            <div className="start-0 top-0 h-100 w-100 position-absolute d-flex align-items-center 
            justify-content-center bg-dark jacked_z_index">
                <div className="col-md-6 col-12 settings_modal">
                    <form className="dash_settings_form">
                          <label htmlFor='EmailRadio'>Show email</label>
                          <input type="checkbox" name="email" id="EmailRadio" 
                          checked={email} onChange={(e)=> setEmail(e.target.checked)}
                          ></input>
                          <button type="submit" name="settings">Save</button>
                    </form>
                </div>

            </div>
        </div>
    )
}