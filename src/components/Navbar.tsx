'use client'

import Link from "next/link";
import Image from "next/image";
import {
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { useState } from "react";
import { Menu } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
    const [responsive, setResponsive] = useState(false);
    const ani = "bottom-0";

    return (
        <nav className='fixed items-center z-1000 bg-[#141414] w-full '>

            <div className="hidden md:flex border-b-2 border-[#4a4a4a]">
                <div className="Logo">
                    <Link href="/">
                        <Image src="/logo/dante-logo.png" alt="Dante" width="65" height="65"/>
                    </Link>
                </div>

                <div>
                    <ul className="flex list-none gap-7 text-[15px] font-normal items-center">
                        <li><Link href="/flashcards/my-sets">My Sets</Link></li>
                        <li><Link href="/flashcards/manager">Set Manager</Link></li>
                        {/* <li><Link href="/pricing">Pricing</Link></li> */}
                    </ul>
                </div>

                <div className="w-[65px] flex justify-center z-1 text-[#141414]">
                    <SignedIn><UserButton/></SignedIn>

                    <SignedOut><SignUpButton/></SignedOut>

                </div>
                <div className="fixed w-[75px] h-[50px] top-[5px] right-0 bg-[#D9D9D9] z-0 rounded-tl-3xl rounded-bl-3xl"></div>
            </div>


            <div className="flex md:hidden items-center justify-between border-b-2 border-[#4a4a4a] p-2">
                <div className={clsx("Logo", responsive && "left-[8.4px] top-[11.5px] absolute")}>
                    <Link href="/">
                        <Image src="/logo/dante-logo.png" alt="Dante" width="40" height="40"/>
                    </Link>
                </div>

                <div className={`absolute bottom-[100vh] ${responsive ? ani : "hidden"} h-screen w-screen bg-[#141414]`}>
                        
                </div>

                <div>
                    <Menu className={responsive && "right-2 top-2 absolute"} height={20} onClick={() => setResponsive(!responsive)}/>
                </div>

            </div>


        </nav>
        
    )
}