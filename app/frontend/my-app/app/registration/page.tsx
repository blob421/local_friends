

"use client";
import {useState, useEffect} from 'react'
import $ from 'jquery';

export default function Register(){
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
        <form className="register_cont" method="POST" action={`${api}/register`}>
                <h1 className="header_reg">Register</h1>

                <input type="text" name="username" required 
                className="reg_input" placeholder="Username">
                </input>
                 <div className='username_help' 
                hidden={!userExists}>
                    Username already in use
                </div>

                <input type="email" name="email" required className="reg_input"
                placeholder="Email">
                </input>
                <div className='email_help' 
                hidden={!emailExists}>
                    This email is already in use
                </div>

                <input type="password" name="password" required 
                className="reg_input" placeholder="Password"
                onChange={(e)=> changePassword(e.target.value)}>
                </input>

                <input type="password" name="password2" required 
                className="reg_input" placeholder="Confirm"
                  onChange={(e) => changeConfirm(e.target.value)}>
                </input>
                
                <div className='pass_help' 
                hidden={passconfirm === password || passconfirm.length < 1}>
                    Passwords don't match
                </div>
               

                <button type="submit" className="btn_reg"
                disabled={passconfirm !== password}>Register</button>
        </form>
    
    )
}