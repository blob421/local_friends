
"use client";
import Image from "next/image";
import { useState } from 'react'
import { useRouter } from "next/navigation";


export default function Home() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const url = process.env.NEXT_PUBLIC_API_URL as string;;


  return (
    <div className="login_outer">
      
          <form method="POST" className="login_cont" action={`${url}/login`}>

              <h1 className="login_head">Login</h1>

              <input type="text" className="username_input" 
              placeholder="username" value={username}
              required name="username"
              onChange={(e) => setUsername(e.target.value)}></input>

              <input type="password" className="password_input" 
              placeholder="password" value={password} 
              required name="password"
              onChange={(e)=> setPassword(e.target.value)}></input>

              <button type="submit" className='submit_login'>
                Login
              </button>
          </form>
       
    </div>
  );
}
