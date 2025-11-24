import Image from "next/image";
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Home(){
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')
  const hasJwt = !!jwt;
    return(
        <div className="container-fluid">
              <div className="row">

                    <div className="col-12 top_bar_landing">
                         <div className="login_btn_cont">
                            <Link className="dashboard_btn_landing" href="/dashboard"
                            hidden={!hasJwt}>Dashboard
                             
                            </Link>
                            <Link className="login_btn_landing" href="/login"
                            hidden={hasJwt}>
                              Login
                            </Link>
                            <Link className="reg_btn_landing" href="/registration"
                             hidden={hasJwt}>
                              Register
                            </Link>

                          </div>
                    </div>
              </div>
              <div className="row">

                   <div className="col-12">
                    Report animal sighting and connect with animal lovers
                   </div>
                  
              </div>
               <div className="row">

                   <div className="img-fluid object-fit-cover w-100">
                    
                   </div>
                  
              </div>
        </div>
    )
}