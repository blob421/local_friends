'use client';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('./navbar'));

export default function Nav(){
  const path = usePathname();
  const unallowed = ['/'];
  if (!unallowed.includes(path)){
    return <Navbar />
  }
}