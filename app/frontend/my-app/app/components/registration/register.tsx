"use client";

import {useState, useEffect} from 'react'
import $ from 'jquery';

type reg_params = {
    onClose: () => void
}
export default function Register({onClose}:reg_params){
  const [userExists, changeUser] = useState(false)
  const [emailExists, changeEmail] = useState(false)

 useEffect(()=>{

    
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');
  const username = params.get('username');
  const email = params.get('email');
  

  if (error === 'username_exists') {
      changeUser(true)
  } else if (error === 'email_exists') {
      changeEmail(true)
  }

  if (username) {
    $('input[name="username"]').val(username);
   
  }
  if (email) {
    $('input[name="email"]').val(email);
    
  }

  }, [])
    const [password, changePassword] = useState("")
    const [passconfirm, changeConfirm] = useState('')
 

    const api = process.env.NEXT_PUBLIC_API_URL
    return(
    <div className='modal_bg row p-0 m-0 d-flex justify-content-center'>
        <div className='col-10 col-md-3 position-relative'>
        <form className="register_cont p-5" method="POST" action={`${api}/register`}>
                <button type='button' className='x_btn_reg txt_sm' onClick={()=> onClose()}>X</button>
                <h1 className="header_reg txt_xl">Register</h1>

                <input type="text" name="username" required 
                className="home_forms_inputs txt_sm" placeholder="Username" maxLength={26}>
                </input>
                 <div className='username_help txt_sm' 
                hidden={!userExists}>
                    Username already in use
                </div>

                <input type="email" name="email" required className="home_forms_inputs txt_sm"
                placeholder="Email">
                </input>
                <div className='email_help txt_xs' 
                hidden={!emailExists}>
                    Email address already in use
                </div>

                <input type="password" name="password" required 
                className="home_forms_inputs txt_sm" placeholder="Password"
                onChange={(e)=> changePassword(e.target.value)}>
                </input>

                <input type="password" name="password2" required 
                className="home_forms_inputs txt_sm" placeholder="Confirm"
                  onChange={(e) => changeConfirm(e.target.value)}>
                </input>
                
                <div className='pass_help txt_xs' 
                hidden={passconfirm === password || passconfirm.length < 1}>
                    Passwords don't match
                </div>
               

                <button type="submit" className="btn_reg txt_sm"
                disabled={passconfirm !== password}>Register</button>
        </form>
        </div>
    </div>
    
    )
}