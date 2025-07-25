"use client"
import { useState, useEffect } from "react";
import { Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { SignedIn, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [responsive, setResponsive] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname()

    const hideNavbar = pathname?.startsWith('/flashcards/practice/') || pathname?.startsWith('/flashcards/play/') || pathname?.startsWith('/flashcards/quiz/') 

    if (hideNavbar) return null
    return (
        <nav className={clsx(
            "fixed top-0 left-0 w-screen z-50 transition-transform duration-300",
            scrolled ? "bg-[#141414] shadow-md" : "bg-transparent"
        )}>
            <div className="flex items-center justify-between h-[50px] px-4 text-white border-b-1 border-b-[#828282]">
                <Link href="/" className="text-[16px] font-bold z-[999]">Dante</Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex gap-6 text-md font-semibold">
                    <Link className="hover-animation-text" href="/flashcards/my-sets">My Sets</Link>
                    <Link className="hover-animation-text" href="/flashcards/manager">Set Manager</Link>
                    <Link className="hover-animation-text" href="/explore">Explore</Link>

                    {/* <Link className="hover-animation-text" href="/contact">Pricing</Link> */}
                </ul>

                {/* Mobile Toggle Button */}
                <button
                    className="md:hidden text-white z-[999]"
                    onClick={() => setResponsive(!responsive)}
                >
                    {responsive ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:flex">
                    <SignedIn>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Link
                                label="Settings"
                                labelIcon={<Settings size={16} />}
                                href="/settings"
                            />
                            </UserButton.MenuItems>
                        </UserButton>
                    </SignedIn>
                    
                    <SignedOut>
                        <SignUpButton/>
                    </SignedOut>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    "fixed top-0 left-[50%] w-[50%] h-screen bg-[#141414] border-l-1 border-l-[#828282] flex flex-col items-center justify-center gap-3 text-white text-md transform transition-transform duration-500 ease-in-out lg:hidden",
                    responsive ? "translate-x-0" : "translate-x-full pointer-events-none"
                )}
            >
                <Link href="/flashcards/my-sets" onClick={() => setResponsive(false)}>
                    My Sets
                </Link>
                <Link href="/flashcards/manager" onClick={() => setResponsive(false)}>
                    Set Manager
                </Link>
                <Link href="/explore" onClick={() => setResponsive(false)}>
                    Explore
                </Link>
                {/* <Link href="/contact" onClick={() => setResponsive(false)}>
                    Pricing
                </Link> */}
            </div>
        </nav>   
    );
}
