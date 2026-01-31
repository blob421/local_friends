import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';


export default function Navbar(){
    const path = usePathname()
    return (
        
        <nav className='nav_main gap-4 gap-lg-3 d-flex justify-content-center mb-lg-1 align-items-center'>
               <Link href={'/dashboard'} className={path == '/dashboard' ? 'toggled_nav': "aligned_nav"} >Dashboard</Link>
               <Link href={'/home'} className={path == '/home' ? 'toggled_nav home_link': "home_link"}>Home 
                   <img src={'/home.jpg'} alt={""} className='home_icon_nav'>
                   </img>
               </Link>
               <Link href={'/map'} className={path == '/map' ?"toggled_nav map_link":'map_link'}>Map
                <img src={'/map_icon.png'} alt={""} className='map_icon'>
                   </img>
               </Link>
        </nav>
    )
}