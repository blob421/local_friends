import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';


export default function Navbar(){
    const path = usePathname()
    return (
        
        <nav className='nav_main gap-1 gap-sm-5
        gap-lg-3 m-0 d-flex justify-content-center 
     
                        align-items-center txt_md'>
              
               <Link href={'/home'} className={path == '/home' ? 'toggled_nav nav_link': "nav_link"}>Home 
                
               </Link>
                <Link href={'/dashboard'} className={path == '/dashboard' ? 'nav_link toggled_nav'
                                                        : "nav_link"} >Dashboard</Link>
               <Link href={'/map'} className={path == '/map' ?"toggled_nav nav_link":'nav_link'}>Map
               
               </Link>
        </nav>
    )
}