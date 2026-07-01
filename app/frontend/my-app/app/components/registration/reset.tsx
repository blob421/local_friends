"use client"
import { useState, useMemo } from "react"

type reg_params = {
    onClose: () => void
}


export default function Reset({onClose}: reg_params){

 const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/reset'
 const code_url = process.env.NEXT_PUBLIC_API_URL + '/codevalidate'
 const resetUrl = process.env.NEXT_PUBLIC_API_URL + '/password_reset'

 const [email, setEmail] = useState('')
 const [username, setUsername] = useState("")
 const [mailSent, setMailSent] = useState(false)
 const [codeSent, setcodeSent] = useState(false)
 const [code , setCode] = useState('')
 const [passwordProcessCompleted, setpasswordProcessCompleted]= useState(false)
 const [codeValid, setcodeValid] = useState(false)
 const [message, setMessage] = useState('A recovery code has been sent if this address was valid')
 const [password, changePassword] = useState("")
 const [passconfirm, changeConfirm] = useState('')

 const send = async () => {

    await fetch(apiUrl, {method: 'POST', headers: {'Content-Type': 'application/json'},
                                     body: JSON.stringify({email: email})})
    setMailSent(true)
 }

 const sendCode = async ()=> {
  
    const res = await fetch(code_url, {method: 'POST', headers: {'Content-Type': 'application/json'},
                                     body: JSON.stringify({email: email, code:code})})
    console.log(res.status)
    if (res.ok) {
      const data = await res.json()
      setUsername(data.username)
      setcodeValid(true)
   }

    else {setMessage('This code is invalid')}
   setcodeSent(true)
 }


 const passwordReset = async () => {
    const res = await fetch(resetUrl, {method: 'POST', headers: {'Content-Type': 'application/json'},
                                     body: JSON.stringify({email:email, password: password})})

 
   
    if (!res.ok){
      setMessage('Password change failed, try again later')
    }
    else{
      setMessage('Password changed successfully, close this window')
    }
   setpasswordProcessCompleted(true)
 }
 
 const passMatch = useMemo(() =>  password == passconfirm, [passconfirm, password])

 return (
   <div className="modal_bg row p-0 m-0 d-flex justify-content-center">
    <div className='col-10 col-md-3 position-relative'>
      {!mailSent ?
      <form action={send} className="register_cont col-10 col-md-3 p-5">
              <button type='button' className='x_btn_reg txt_sm' onClick={()=> onClose()}>X</button>
              <h1 className="login_head txt_xl">Reset</h1>
        <input type="email" required className="home_forms_inputs txt_sm" placeholder="Email address"
        onChange={(e)=> {setMailSent(false); setEmail(e.target.value)}}>
        
        </input>


       <input type="submit" value={'Submit'} className="home_submit_forms_btns txt_sm"/>
      </form>

       : codeValid ?

     <form action={passwordReset} className="register_cont col-10 col-md-3 p-5">
            <button type='button' className='x_btn_reg txt_sm' onClick={()=> onClose()}>X</button>
            <h1 className="login_head txt_xl">New password</h1>
              <input type="text" name="username" value={username} disabled required={false}
              className="disabled_inputs txt_sm"/>
              <input type="password" name="password" required 
                className="home_forms_inputs txt_sm" placeholder="Password"
                onChange={(e)=> changePassword(e.target.value)}>
                </input>

                <input type="password" name="password2" required 
                className="home_forms_inputs txt_sm" placeholder="Confirm"
                  onChange={(e) => changeConfirm(e.target.value)}>
                </input>

                {(!passMatch && !passwordProcessCompleted) &&
                   <div className="username_help yellow_help txt_xs">
                    Passwords don't match
                  </div>}

               {passwordProcessCompleted && 
                  <div className="username_help yellow_help txt_xs">
                     {message}
                  
                  </div>}

         
         
         
            <input type="submit" value={'Reset'} className="home_submit_forms_btns txt_sm" 
            disabled={!passMatch || passwordProcessCompleted}/>
      </form>     
      
      
       : 
       
      <form action={sendCode} className="register_cont col-10 col-md-3  p-5">
            <button type='button' className='x_btn_reg txt_sm' onClick={()=> onClose()}>X</button>
            <h1 className="login_head txt_xl">Confirm</h1>
            <input type="text" required className="home_forms_inputs txt_sm" placeholder="Code" maxLength={6}
            onChange={(e)=> {setCode(e.target.value)}}>
            
            </input>

         
                  <div className={codeSent ? "username_help red_help txt_sm": "username_help yellow_help txt_xs"}>
                     {message}
                  </div>
         
         
            <input type="submit" value={'Validate'} className="home_submit_forms_btns txt_xs"/>
      </form>      
       
       }
       </div>
   </div>

 )
}