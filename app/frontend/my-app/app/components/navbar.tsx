import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation';


export default function Navbar(){
    const path = usePathname()
    return (
        
        <nav className='nav_main'>
               <Link href={'/dashboard'} className={path == '/dashboard' ? 'toggled_nav': ""} >Dashboard</Link>
               <Link href={'/home'} className={path == '/home' ? 'toggled_nav home_link': "home_link"}>Home 
                   <Image width={24} height={20} src={'/home.jpg'} alt={""}>
                   </Image>
               </Link>
               <Link href={'/map'} className={path == '/map' ?"toggled_nav map_link":'map_link'}>Map</Link>
        </nav>
    )
}