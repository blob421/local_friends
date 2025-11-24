import Link from 'next/link';
import Image from 'next/image'



export default function Navbar(){
    return (
        
        <nav className='nav_main'>
               <Link href={'/dashboard'}>Dashboard</Link>
               <Link href={'/home'} className='home_link'>Home 
                   <Image width={24} height={20} src={'/home.jpg'} alt={""}>
                   </Image>
               </Link>
               <Link href={'/map'}>Map</Link>
        </nav>
    )
}