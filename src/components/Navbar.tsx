import Link from "next/link";
import Image from "next/image";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Navbar() {
    return (
        <nav className='fixed flex items-center justify-between p-4 w-full text-s border-b-2 border-[#4a4a4a]'>


            <div className="Logo">
                <Link href="/">
                    <Image src="/logo/dante-logo.png" alt="Dante" width="65" height="65"/>
                </Link>
            </div>

            
            <div>
                <ul className="flex list-none gap-7 text-[15px] font-normal items-center">
                    <li><Link href="/sets">My Sets</Link></li>
                    <li><Link href="/flashcards/create">Create Set</Link></li>
                    <li><Link href="/pricing">Pricing</Link></li>
                </ul>
            </div>


            <div className="w-[65px] flex justify-center z-1">
                <SignedIn><UserButton /></SignedIn>
                <SignedOut><SignUpButton/></SignedOut>
            </div>
            <div className="fixed w-[75px] h-[50px] top-[5px] right-0 bg-[#D9D9D9] z-0 rounded-tl-3xl rounded-bl-3xl"></div>
        </nav>
    )
}