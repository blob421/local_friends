"use client";

import {useState, useEffect} from 'react'
import $ from 'jquery';

type reg_params = {
    onClose: () => void, reset : () => void
}
export default function Login({onClose, reset}:reg_params){
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [wrong_creds, setWrongCreds] = useState(false)
const api_url = process.env.NEXT_PUBLIC_API_URL

const login = async () => {
    const res = await fetch(api_url + '/login', 
        { body: JSON.stringify({username:username, password:password}), 
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
        credentials: 'include'})

    res.ok ? window.location.href = '/dashboard' : setWrongCreds(true)
   
}


    return (
    <div className="modal_bg row p-0 m-0 d-flex justify-content-center">
      <div className='col-10 col-md-3 position-relative'>
          <form className="register_cont col-10 col-md-3 p-5" action={login}>
              <button type='button' className='x_btn_reg txt_sm' onClick={()=> onClose()}>X</button>
              <h1 className="login_head txt_xl">Login</h1>

              <input type="text" className="home_forms_inputs txt_sm" 
              placeholder="username" value={username}
              required name="username"
              onChange={(e) => {setUsername(e.target.value); setWrongCreds(false)}}></input>

              <input type="password" className="home_forms_inputs txt_sm" 
              placeholder="password" value={password} 
              required name="password"
              onChange={(e)=> {setPassword(e.target.value); setWrongCreds(false)}}></input>

              {wrong_creds && 
                <div className='username_help'>
                 Credentials don't match
                </div>
              }

              <button type="submit" className='home_submit_forms_btns txt_sm'>
                Login
              </button>

              <a className="forgot_password_login txt_sm" onClick={() => reset()}>
                Forgot your password ?</a>
          </form>
       </div>
    </div>
  );
}